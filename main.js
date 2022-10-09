import Sippycup from './sippycup.js';

const stdout = (msg) => {
    console.debug("STDOUT: ", msg)
}

const sippycup = new Sippycup(stdout);
await sippycup.initialize();

Promise.all([
    sippycup.addFile('index.html', 'templates', `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
        <title>My Flask App</title>
    </head>
    <body>
        <h1>{{ msg }}</h1>
    </body>
    </html>
    `),
    
    sippycup.addFile('app.py', '', `
    from flask import Flask, render_template
    
    app = Flask(__name__)
    
    @app.route("/")
    def index():
        return render_template("index.html", msg="Hello, World!")

    @app.route("/data")
    def data():
        return {"hello":"world"}
    `),
    
    sippycup.addFile('style.css', 'static', `
    body, html {
        margin: 0;
        background: red;
    }
    `)
]).then(() => {
    sippycup.startApp()
}).then(() => sippycup.request('/'))
.then((response) => {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('srcdoc', response.content)
    document.querySelector('body').append(iframe)

})