from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='build')

@app.route("/", defaults={'id':''})
@app.route("/<string:id>")
def load(id):
    return send_from_directory(app.static_folder, 'index.html')