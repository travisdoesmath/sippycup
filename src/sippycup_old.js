/* eslint-disable no-restricted-globals */

if ('function' === typeof(importScripts)) {

    // eslint-disable-next-line no-undef
    importScripts("https://cdn.jsdelivr.net/pyodide//v0.21.3/full/pyodide.js");
}

let pyodide, app, requestStatus, headers;

let port;

function start_response(status, responseHeaders, exc_info) {   
    requestStatus = status
    let headersObject = {}
    console.log(responseHeaders.toJs())
    responseHeaders.toJs().forEach(([key, value]) => headersObject[key] = value)
    headers = headersObject
    console.log('headers', headers)
}

async function init() {
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ stdout: (output) => {
        self.postMessage({'command':'stdout', 'message':output})
    }});

    pyodide.runPython(
`import os

os.mkdir('templates')
`);

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('flask')

    self.postMessage({'command':'appReady'})
}

async function updateFile(filename, content) {
    const src=`
with open("templates/${filename}", "w") as file:
    file.write("""${content}""")
`
    pyodide.runPython(src)
}

async function main(src) {
    pyodide.runPython(src)

    app = pyodide.globals.get("app").toJs();

    self.postMessage({'command':'appReady'})
}

const logDateFormat = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})
function logDate() {
    let now = new Date()
    let dateParts = {}
    logDateFormat.formatToParts(now).map(x => dateParts[x.type] = x.value)
    return `${dateParts.day}/${dateParts.month}/${dateParts.year} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
}

self.onmessage = async function(msg) {
    function getCssBlob() {
        return new Blob(getCss())
    }

    function getCss() {
        pyodide.runPython(`
with open("templates/style.css", "r") as file:
    css = file.readlines()    
`
        )
        let css = pyodide.globals.get("css").toJs();
        return css.join('')
    }

    function handleRequest(requestMethod="GET", route="/", target=self) {
        const environ = {
            'wsgi.url_scheme': 'http',
            'REQUEST_METHOD': requestMethod,
            'PATH_INFO': route
        }
        let r = app(pyodide.toPy(environ), start_response).toJs()
        let response = r.__next__().toString()
        response = response.slice(2, response.length-1)
        response = response.replace(`<link rel="stylesheet" href="style.css">`, `<style>${getCss()}</style>`)
        target.postMessage({'command':'response', 'data':response, 'headers':headers, 'status':requestStatus})    
        target.postMessage({'command':'stdout', 'message': `127.0.0.1 - - [${logDate()}] "${requestMethod} ${route} HTTP/1.1" ${requestStatus} -\n`})
    }

    if (msg.data.command === "updateFile") {
        const filename = msg.data.filename;
        const content = msg.data.content;
        updateFile(filename, content)
    }
    if (msg.data.command === "request") {
        handleRequest(msg.data.method, msg.data.route)
    }
    if (msg.data.command === "run") {
        await main(msg.data.src)
        self.postMessage({'command':'stdout', 'message':`\n * Serving Flask app 'app'\n * Running on http://127.0.0.1:5000\n`})
        self.postMessage({command:'appReady'})
        handleRequest('GET', '/')
    }
    if (msg.data.command === "connect") {
        port = msg.ports[0]
        port.onmessage = (msg) => {
            if (msg.data.command === "requst") {
                let method = msg.data.method
                let route = msg.data.route
                handleRequest(method, route, port)
            }
        }
    }
}

init()