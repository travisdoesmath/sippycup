export const htmlSrc = `<!DOCTYPE html>
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
`;

export const pythonSrc = `from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", msg="Hello, World!")

@app.route("/data")
def data():
    return {"hello":"world"}
`;

export const cssSrc = `body, html {
    margin: 0;
    background: red;
}
`;
