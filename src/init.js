const src = {
    python: `from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", msg="Hello, World!")

@app.route("/api/")
def api():
    return {'value':random.random()}
`,

    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>My Fullstack App</title>
    </head>
    <body>
        <h1>{{ msg }}</h1>
        <button>Get Random Number</button>
        <p></p>

        <script>
            const button = document.querySelector('button')
            button.addEventListener('click', (e) => {
                fetch('/api/').then(res => res.json())
                .then(data => p.textContent = data.value)
            })
        </script>
    </body>
    </html>    
  
`,

    css: `body, html {
    height: 100%;
    width: 100%;
}`
}

export { src };

