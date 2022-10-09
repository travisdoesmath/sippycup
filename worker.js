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

let pyFiles = {};

let ready = false;

async function init() {
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ stdout: (output) => {
        self.postMessage({'type':'stdout', 'content':output})
    }});

    pyodide.runPython(
`import os

os.mkdir('templates')
`);

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('flask')

    pyodide.runPython(`print('Python modules installed')`)
}

async function updateFile(filename, path, content) {
    const src=`
import os

if not os.path.exists("${path}"):
    os.mkdir("${path}")

with open("${path}/${filename}", "w") as file:
    file.write("""${content}""")
`
    if (filename.slice(-3) === '.py') {
        pyFiles[`${path}/${filename}`] = content
    } else {
        pyodide.runPython(src)
    }
}

addEventListener("message", async (event) => {
    const port = event.ports[0]
    const msg = event.data

    try {
        if (msg.type === 'readyRequest') {
            if (!ready) {
                await init();
                ready = true;
            }
            port.postMessage({type:'ready'})
        }
        if (msg.type === 'updateFile') {
            updateFile(msg.filename, msg.path, msg.content)

            port.postMessage({type:'ready', result:`${msg.filename} updated`})
        }
        if (msg.type === 'startApp') {
            pyodide.runPython(pyFiles['/app.py'])
            app = pyodide.globals.get("app").toJs();    
            port.postMessage({type:'appReady'})
        }
        if (msg.type === 'request') {
            response = await handleRequest(msg.request, port);
            port.postMessage({type:'response', result:response})
        }
    } catch(e) {
        port.postMessage({error: e});
    }
    port.close();
})

handleRequest = (request, port) => {
    let r = app(pyodide.toPy(environ), () => {}).toJs()
    let response = r.__next__().toString()
    response = response.slice(2, response.length-1)
    return response
    
}