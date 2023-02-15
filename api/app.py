from flask import Flask, request, send_from_directory
from flask_cors import CORS
import hashlib
from friendly_id import get_id
from google.cloud import firestore
import json

db = firestore.Client(project='sippycup')

app = Flask(__name__)
CORS(app)

@app.route("/<string:id>")
def load(id):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/save', methods=['POST'])
def save():
    def data_is_well_formed():
        try:
            data = json.loads(request.data)
            index_html_is_text = type(data['index.html']) == str
            app_py_is_text = type(data['app.py']) == str
            style_css_is_text = type(data['style.css']) == str
            if not all([index_html_is_text, app_py_is_text, style_css_is_text]):
                return False, {"success": False, "error":"source files are not text"}
            else:
                return True, data
        except (TypeError, KeyError):
            return False, {"success": False, "error":"data is not well formed"}
        
    def check_if_save_exists(hash):
        match = db.collection('files').where('hash', '==', hash).limit(1).get()
        if len(match) > 0:
            return True, match[0].id
        return False, None

    data = json.loads(request.data)

    well_formed, data = data_is_well_formed()

    if not well_formed:
        return data

    hash = hashlib.sha256(bytes(json.dumps(data), encoding='utf-8')).hexdigest()
    save_exists, id = check_if_save_exists(hash)
    if save_exists:
        return {"success":True, "id":id}    
    else:
        id = get_id()

    doc_ref = db.collection('files').document(id)
    doc_ref.set({
        'index.html': data['index.html'],
        'app.py': data['app.py'],
        'style.css': data['style.css'],
        'hash':hash
    })

    return {'success': True, 'id': id}

@app.route('/api/get/<id>')
def get(id):
    doc_ref = db.collection('files').document(id)

    doc = doc_ref.get()

    return doc.to_dict()