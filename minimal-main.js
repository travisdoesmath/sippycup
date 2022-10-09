import Sippycup from './sippycup.js';

const sippycup = new Sippycup();
await sippycup.initialize();

Promise.all([
    sippycup.addFile('app.py', '', `
    from flask import Flask

    app = Flask(__name__)

    @app.route('/')
    def index():
        return "Hello, World!"
    `),
]).then(() => {
    sippycup.startApp()
}).then(() => {
    return sippycup.request('/')
})
.then((response) => {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('srcdoc', response.content)
    document.querySelector('body').append(iframe)
})