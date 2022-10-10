class Sippycup {
  #worker;
  constructor(stdoutHandler = console.debug) {
    this.#worker = new Worker(new URL("./worker.js", import.meta.url));
    this.ready = false;
    this.#worker.addEventListener("message", ({ data }) => {
      if (data.type === "stdout") {
        stdoutHandler(data.content);
      }
    });
  }

  async initialize() {
    await this.#sendMessageToWorker({ type: "readyRequest" });

    this.#worker.addEventListener("message", ({ data }) => {
      if (data.type === "ready") {
        this.ready = true;
      }
    });
  }

  async startApp() {
    await this.#sendMessageToWorker({ type: "startApp" });
  }

  #handleMessageFromWorker({ data }) {}

  #sendMessageToWorker(msg) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = ({ data }) => {
        channel.port1.close();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      };

      this.#worker.postMessage(msg, [channel.port2]);
    });
  }

  async addFile(filename, path, content) {
    await this.updateFile(filename, path, content);
  }

  async updateFile(filename, path, content) {
    try {
      const msg = {
        type: "updateFile",
        filename: filename,
        path: path,
        content: content,
      };
      const response = this.#sendMessageToWorker(msg);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async request(request) {
    try {
      const msg = {
        type: "request",
        request: request,
      };
      const response = await this.#sendMessageToWorker(msg);

      if (
        response.header["Content-Type"] &&
        response.header["Content-Type"].includes("text/html")
      ) {
        response.content = await this.#parseHtml(response.content);
      }

      return response;
    } catch (e) {
      console.error(e.message);
    }
  }

  async #parseHtml(html) {
    let localUrls = html.match(
      /(?<=src=|href=)(['"])(?![a-zA-Z+]*:\/\/)(.*)\1/g
    );
    if (localUrls) {
      localUrls = new Set(localUrls.map((s) => s.slice(1, -1)));

      let localContent = {};

      await Promise.all(
        [...localUrls].map(async (url) => {
          let response = await this.request(url);
          let content = URL.createObjectURL(new Blob([response.content]));
          localContent[url] = content;
        })
      );

      Object.keys(localContent).forEach((url) => {
        html = html.replace(url, localContent[url]);
      });
    }

    return html;
  }
}

export default Sippycup;
