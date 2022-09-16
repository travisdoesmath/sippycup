importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js");
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

async function main() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('flask')
    let processRequest = function(req) {
        console.log(req)
    }

    pyodide.runPython(`
    from flask import Flask, render_template

    app = Flask(__name__)

    @app.route("/")
    def index():
        return "Hello!"
    `)

    let app = pyodide.globals.get("app").toJs();


    function start_response(status, response_headers, exc_info) {
        
    }

    self.onmessage = function(event) {
        let r = app(pyodide.toPy(environ), start_response).toJs()
        console.log(r.__next__().toString())
    }

}

main()