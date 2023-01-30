/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide//v0.21.3/full/pyodide.js");

let pyodide, app, requestStatus;

function start_response(status, response_headers, exc_info) {   
    requestStatus = status
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

    self.postMessage({'command':'ready'})
}

async function updateFile(filename, content) {
    const src=`
with open("templates/${filename}", "w") as file:
    file.write("""${content}""")
`        
    console.log('src', src)
    pyodide.runPython(src)
}

async function main(src) {
    pyodide.runPython(src)

    app = pyodide.globals.get("app").toJs();

    self.postMessage({'command':'appReady'})
}

init()

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
        console.log('css', css)
        return css.join('')
    }

    function handleRequest(requestMethod="GET", route="/") {
        const environ = {
            'wsgi.url_scheme': 'http',
            'REQUEST_METHOD': requestMethod,
            'PATH_INFO': route
        }
        let r = app(pyodide.toPy(environ), start_response).toJs()
        let response = r.__next__().toString()
        response = response.slice(2, response.length-1)
        response = response.replace(`<link rel="stylesheet" href="style.css">`, `<style>${getCss()}</style>`)
        console.log('response:', response)
        self.postMessage({'command':'response', 'data':response})    
        self.postMessage({'command':'stdout', 'message': `127.0.0.1 - - [${logDate()}] "${requestMethod} ${route} HTTP/1.1" ${requestStatus} -\n`})
    }

    if (msg.data.command === "updateFile") {
        const filename = msg.data.filename;
        const content = msg.data.content;
        updateFile(filename, content)
        console.log(`${filename} updated`)
    }
    if (msg.data.command === "request") {
        handleRequest(msg.data.method, msg.data.route)
    }
    if (msg.data.command === "run") {
        await main(msg.data.src)
        self.postMessage({'command':'stdout', 'message':` * Serving Flask app 'app'\n * Running on http://127.0.0.1:5000`})
        self.postMessage({command:'appRunning'})
        handleRequest('GET', '/')
    }
}
