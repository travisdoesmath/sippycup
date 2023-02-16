from flask import Flask, send_from_directory
import re

app = Flask(__name__, static_url_path='', static_folder='build')

@app.route("/", defaults={'id':''})
@app.route("/<string:id>")
def load(id):
    def is_valid_id(id):
        return bool(re.match(r'[a-z]+-[a-z]+-[a-z]+', 'a-a-'))

    if (id == '' or is_valid_id(id)):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return send_from_directory(app.static_folder, id)