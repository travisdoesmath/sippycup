/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide//v0.21.3/full/pyodide.js");

let pyodide, app;

let pyFiles = {};

let ready = false;

async function init() {
  // eslint-disable-next-line no-undef
  pyodide = await loadPyodide({
    stdout: (output) => {
      self.postMessage({ type: "stdout", content: output });
    },
  });

  pyodide.runPython(
    `import os

os.mkdir('templates')
`
  );

  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("flask");

  pyodide.runPython(`print('Python modules installed')`);
}

async function updateFile(filename, path, content) {
  const src = `
import os

if not os.path.exists("${path}"):
    os.mkdir("${path}")

with open("${path}/${filename}", "w") as file:
    file.write("""${content}""")
`;
  if (filename.slice(-3) === ".py") {
    pyFiles[`${path}/${filename}`] = content;
  } else {
    pyodide.runPython(src);
  }
}

addEventListener("message", async (event) => {
  const port = event.ports[0];
  const msg = event.data;

  try {
    if (msg.type === "readyRequest") {
      if (!ready) {
        await init();
        ready = true;
      }
      port.postMessage({ type: "ready" });
    }
    if (msg.type === "updateFile") {
      updateFile(msg.filename, msg.path, msg.content);

      port.postMessage({ type: "ready", result: `${msg.filename} updated` });
    }
    if (msg.type === "startApp") {
      pyodide.runPython(pyFiles["/app.py"]);
      app = pyodide.globals.get("app").toJs();
      port.postMessage({ type: "appReady" });
    }
    if (msg.type === "request") {
      response = await handleRequest(msg.request, port);
      port.postMessage({ type: "response", result: response });
    }
  } catch (e) {
    port.postMessage({ error: e });
  }
  port.close();
});

handleRequest = (request) => {
  const environ = {
    REQUEST_METHOD: "GET",
    PATH_INFO: request,
    SERVER_NAME: "127.0.0.1",
    SERVER_PORT: "5000",
    "wsgi.url_scheme": "http",
    "wsgi.version": (1, 0),
  };
  let response = {};
  startResponse = (status, headers) => {
    let _headers = {};
    headers.toJs().forEach(([key, value]) => {
      _headers[key] = value;
    });
    response.status = status;
    response.header = _headers;
  };
  let r = app(pyodide.toPy(environ), startResponse).toJs();

  response["content"] = r
    .__next__()
    .toString()
    .slice(2, -1)
    .replace(/\\n/g, "\n");
  // toString() includes the bytestring literal prefix and quotes; slice(2, -1) removes them.

  return response;
};
