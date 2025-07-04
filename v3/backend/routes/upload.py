import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.extract_text import extract_text_from_pdf

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join('uploads', filename)
    file.save(filepath)

    # Extract text
    extracted_text = extract_text_from_pdf(filepath)

    return jsonify({
        'filename': filename,
        'text': extracted_text
    })
