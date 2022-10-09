class Sippycup {
    #worker;
  constructor(stdoutHandler) {
    this.#worker = new Worker(new URL("./worker.js", import.meta.url));
    this.ready = false;
    this.#worker.addEventListener("message", ({data}) => {
        if (data.type === 'stdout') {
            stdoutHandler(data.content)
        }
    })
  }

  async initialize() {
    await this.#sendMessageToWorker({type:'readyRequest'})

    this.#worker.addEventListener("message", ({data}) => {
        if (data.type === 'ready') {
            this.ready = true;
        }
    })

  }

  async startApp() {
    await this.#sendMessageToWorker({type:'startApp'})
  }

  #handleMessageFromWorker({ data }) {
    
  }

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
    })
  }

  async addFile(filename, path, content) {
    // console.log('addFile called: ', filename)
    await this.updateFile(filename, path, content);
  }

  async updateFile(filename, path, content) {
    
    try {
        const msg = {
            type: 'updateFile',
            filename: filename,
            path: path,
            content: content
        }
        const response = this.#sendMessageToWorker(msg)
        return response;
    } catch(e) {
        console.error(e)
    }
  }

  async request(request) {
    try {
        const msg = {
            type: 'request',
            request: request
        }
        const response = await this.#sendMessageToWorker(msg);
        return response
    } catch(e) {
        console.error(e.message);
    }
  }

  #parseHtml(html) {}
}

export default Sippycup;
