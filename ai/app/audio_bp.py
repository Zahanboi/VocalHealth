import os
import numpy as np
import tensorflow as tf
from flask import Blueprint, request, jsonify, make_response
import tensorflow_hub as hub
import librosa
from app import client, model
from datetime import datetime
import json
import cloudinary.uploader
from werkzeug.utils import secure_filename
from app.report_generation import process_audio

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
audio_bp = Blueprint("audio", __name__)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
@audio_bp.route('/process_audio', methods=['POST'])
def analyze_voice():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    file = request.files['audio']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    filename = secure_filename(file.filename)
    unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)
    try:
        json_report = process_audio(filepath)
        report_data = json.loads(json_report)
        pdf_path = 'medical_report.pdf'
        cloudinary_response = cloudinary.uploader.upload(pdf_path, resource_type="raw")
        pdf_url = cloudinary_response.get("secure_url")
        formatted_report = {
            "Acoustic Features": {
                "Jitter_Percent": report_data["acoustic_analysis"]["voice_perturbation"]["jitter"]["value"],
                "MFCC_Mean": report_data["mfcc_features"]["mean"],
                "MFCC_Std": report_data["mfcc_features"]["std"],
                "Shimmer_Percent": report_data["acoustic_analysis"]["voice_perturbation"]["shimmer"]["value"]
            },
            "Analysis Date": datetime.now().strftime("%Y-%m-%d"),
            "Confidence Scores": {
                "Healthy": report_data["diagnosis"]["confidence_scores"]["Healthy"],
                "Laryngitis": report_data["diagnosis"]["confidence_scores"]["Laryngitis"],
                "Vocal Polyp": report_data["diagnosis"]["confidence_scores"]["Vocal Polyp"]
            },
            "Findings": report_data["detailed_report"],
            "PDF_URL": pdf_url,
            "Prediction": report_data["diagnosis"]["predicted_condition"]
        }
        response = make_response(json.dumps(formatted_report, indent=4))
        response.content_type = 'application/json'
        return response
    except Exception as e:
        return jsonify({'error': f'Error processing audio: {str(e)}'}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
        if os.path.exists('medical_report.pdf'):
            os.remove('medical_report.pdf')
        if os.path.exists("medical_report.json"):
            os.remove("medical_report.json") 