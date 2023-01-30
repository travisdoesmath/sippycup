const src = {
    python: `from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", msg="Hello, World!")

@app.route("/api")
def api():
    return {"hello":"world"}
    
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
</body>
</html>
`,

    css: `body, html {
    margin: 0;
    height: 100%;
    width: 100%;
}`
}

export { src };

