/* eslint-disable no-restricted-globals */
let pyodide;
let app, requestStatus, headers;

if ('function' === typeof(importScripts)) {
    // eslint-disable-next-line no-undef
    importScripts("https://cdn.jsdelivr.net/pyodide//v0.21.3/full/pyodide.js");
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
    let response = r.__next__()
    console.log('response before converting to string', response)
    response = response.toString()
    response = response.slice(2, response.length-1)
    response = response.replace(`<link rel="stylesheet" href="style.css">`, `<style>${getCss()}</style>`)
    const textEncoder = new TextEncoder();
    console.log(response)
    console.log('sippycup response: ', textEncoder.encode(response))
    return {
        value:
        {
            body: textEncoder.encode(response),
            headers: headers,
            status: requestStatus
        },
        stdout:  `127.0.0.1 - - [${logDate()}] "${requestMethod} ${route} HTTP/1.1" ${requestStatus} -\n`
    }
}



function logDate() {
    const logDateFormat = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    let now = new Date()
    let dateParts = {}
    logDateFormat.formatToParts(now).map(x => dateParts[x.type] = x.value)
    return `${dateParts.day}/${dateParts.month}/${dateParts.year} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
}

async function main(src) {
    pyodide.runPython(src)

    app = pyodide.globals.get("app").toJs();

    self.postMessage({'command':'appReady'})
}

function start_response(status, responseHeaders, exc_info) {   
    requestStatus = status
    let headersObject = {}
    responseHeaders.toJs().forEach(([key, value]) => headersObject[key] = value)
    headers = headersObject
}

export async function request(method, route) {
    return handleRequest(method, route)
}

export async function run(src) {
    await main(src)
        let stdout = `\n * Serving Flask app 'app'\n * Running on http://127.0.0.1:5000\n`
        return stdout
}

export async function start() {
    let output
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ stdout: (_output) => {
        output = _output
    }});

    pyodide.runPython(
`import os

os.mkdir('templates')
`);
        
    await pyodide.loadPackage("micropip")
        .then(() => pyodide.pyimport("micropip"))
        .then(micropip => micropip.install('flask'));

    return output
}

export async function updateFile(filename, content) {
    const src=`
with open("templates/${filename}", "w") as file:
    file.write("""${content}""")
`
    pyodide.runPython(src)
}



