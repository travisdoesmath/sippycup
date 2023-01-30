/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide//v0.21.3/full/pyodide.js");

// eslint-disable-next-line no-restricted-globals
let environ = {'HTTP_ACCEPT': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
'HTTP_ACCEPT_ENCODING': 'gzip, deflate, br',
'HTTP_ACCEPT_LANGUAGE': 'en,en-US;q=0.9',
'HTTP_CONNECTION': 'keep-alive',
'HTTP_DNT': '1',
'HTTP_HOST': 'localhost:5000',
'HTTP_REFERER': 'http://localhost:5000/',
'HTTP_SEC_CH_UA': '"Google Chrome";v="105"',
'HTTP_SEC_CH_UA_MOBILE': '?0',
'HTTP_SEC_CH_UA_PLATFORM': '"Windows"',
'HTTP_SEC_FETCH_DEST': 'image',
'HTTP_SEC_FETCH_MODE': 'no-cors',
'HTTP_SEC_FETCH_SITE': 'same-origin',
'HTTP_USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ',
'PATH_INFO': '/',
'QUERY_STRING': '',
'RAW_URI': '/',
'REMOTE_ADDR': '127.0.0.1',
'REMOTE_PORT': 55166,
'REQUEST_METHOD': 'GET',
'REQUEST_URI': '/',
'SCRIPT_NAME': '',
'SERVER_NAME': '127.0.0.1',
'SERVER_PORT': '5000',
'SERVER_PROTOCOL': 'HTTP/1.1',
'SERVER_SOFTWARE': 'Werkzeug/2.2.2',
'wsgi.multiprocess': false,
'wsgi.multithread': true,
'wsgi.run_once': false,
'wsgi.url_scheme': 'http',
'wsgi.version': (1, 0)}

let pyodide, app;

// let template = 
// `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     <h1>{{ msg }}</h1>
// </body>
// </html>`

function start_response(status, response_headers, exc_info) {   
    self.postMessage({'command':'stdout', 'message': `${status} ${response_headers}`})     
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
// with open("templates/index.html", "w") as fh:
//     fh.write("""${template}
//     """)
// `);

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


}

init()

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

    function handleRequest() {
        let r = app(pyodide.toPy(environ), start_response).toJs()
        let response = r.__next__().toString()
        response = response.slice(2, response.length-1)
        response = response.replace(`<link rel="stylesheet" href="style.css">`, `<style>${getCss()}</style>`)
        console.log('response:', response)
        self.postMessage({'command':'response', 'data':response})    
    }

    if (msg.data.command === "updateFile") {
        const filename = msg.data.filename;
        const content = msg.data.content;
        updateFile(filename, content)
        console.log(`${filename} updated`)
    }
    if (msg.data.command === "request") {
        // await main(msg.data.src)
        handleRequest()
    }
    if (msg.data.command === "run") {
        await main(msg.data.src)
        self.postMessage({'command':'stdout', 'data':"* Serving Flask app 'app'"})
        self.postMessage({'command':'stdout', 'data':" * Running on http://127.0.0.1:5000"})
        self.postMessage({command:'appRunning'})
        handleRequest()
    }
}
