import os
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import librosa
from tensorflow.keras.models import load_model
from fpdf import FPDF
from groq import Groq
import re
import json
from datetime import datetime
from app import client, model
label_mapping = {0: "Healthy", 1: "Laryngitis", 2: "Vocal Polyp"}
vggish_model_url = "https://tfhub.dev/google/vggish/1"
vggish_model = hub.load(vggish_model_url)
def extract_audio_features(file_path, max_length=128):
    audio = tf.io.read_file(file_path)
    waveform, sample_rate = tf.audio.decode_wav(audio, desired_channels=1)
    waveform = tf.squeeze(waveform, axis=-1)
    waveform = tf.cast(waveform, tf.float32)
    embeddings = vggish_model(waveform)
    if embeddings.shape[0] < max_length:
        pad_width = max_length - embeddings.shape[0]
        embeddings = tf.pad(embeddings, [[0, pad_width], [0, 0]])
    elif embeddings.shape[0] > max_length:
        embeddings = embeddings[:max_length, :]
    return embeddings.numpy()
def extract_advanced_features(audio_path):
    y, sr = librosa.load(audio_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = mfcc.mean(axis=1)
    mfcc_std = mfcc.std(axis=1)
    f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    f0_mean = np.nanmean(f0)
    f0_std = np.nanstd(f0)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
    jitter = np.std(zero_crossing_rate) * 100
    shimmer = np.std(rms) / np.mean(rms) * 100
    harmonics = librosa.effects.harmonic(y)
    harmonic_ratio = np.mean(librosa.feature.spectral_flatness(y=harmonics))
    S = np.abs(librosa.stft(y))
    formant_freqs = np.mean(librosa.feature.spectral_centroid(S=S, sr=sr))
    return {
        "MFCC_Mean": mfcc_mean.tolist(),
        "MFCC_Std": mfcc_std.tolist(),
        "Fundamental_Frequency_Mean": float(f0_mean),
        "Fundamental_Frequency_Std": float(f0_std),
        "Spectral_Centroid": float(np.mean(spectral_centroid)),
        "Spectral_Bandwidth": float(np.mean(spectral_bandwidth)),
        "Spectral_Rolloff": float(np.mean(spectral_rolloff)),
        "Spectral_Contrast": float(np.mean(spectral_contrast)),
        "RMS_Energy_Mean": float(np.mean(rms)),
        "RMS_Energy_Std": float(np.std(rms)),
        "Jitter_Percent": float(jitter),
        "Shimmer_Percent": float(shimmer),
        "Harmonic_Ratio": float(harmonic_ratio),
        "Voice_Period_Mean": float(1/f0_mean if f0_mean > 0 else 0),
        "Voiced_Segments_Ratio": float(np.mean(voiced_flag)),
        "Formant_Frequency": float(formant_freqs)
    }
def clean_llm_response(text):
    cleaned_text = re.sub(r'<think>.*?</think>\s*', '', text, flags=re.DOTALL)
    cleaned_text = re.sub(r'<[^>]+>', '', cleaned_text)
    cleaned_text = ' '.join(cleaned_text.split())
    return cleaned_text
def generate_medical_report(features, prediction, probabilities):
    prompt = f"""
    Generate a detailed voice pathology medical report with the following format:
    VOICE PATHOLOGY MEDICAL REPORT
    PATIENT INFORMATION
    Analysis Date: {datetime.now().strftime('%Y-%m-%d')}
    Predicted Condition: {prediction} ({probabilities[prediction]})
    SUMMARY OF FINDINGS
    [Provide a concise summary of the main findings and their clinical significance]
    ACOUSTIC ANALYSIS
    Fundamental Frequency:
    - Mean: {features['Fundamental_Frequency_Mean']:.2f} Hz
    - Standard Deviation: {features['Fundamental_Frequency_Std']:.2f} Hz
    - Clinical Significance: [Explain]
    Voice Perturbation Measures:
    - Jitter: {features['Jitter_Percent']:.2f}%
    - Shimmer: {features['Shimmer_Percent']:.2f}%
    - Harmonic Ratio: {features['Harmonic_Ratio']:.3f}
    - Clinical Significance: [Explain]
    Additional Measurements:
    - Voice Period: {features['Voice_Period_Mean']:.4f} seconds
    - Voiced Segments Ratio: {features['Voiced_Segments_Ratio']:.2f}
    - Formant Frequency: {features['Formant_Frequency']:.2f} Hz
    - Clinical Significance: [Explain]
    CLINICAL IMPLICATIONS
    [Discuss the clinical implications of these findings]
    RECOMMENDATIONS
    [Provide specific recommendations for treatment and follow-up]
    Please format all headers in bold without using asterisks (*). Use clear section breaks and maintain professional medical terminology.
    """
    completion = client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
        max_tokens=4096,
    )
    return clean_llm_response(completion.choices[0].message.content)
def process_audio(audio_path):
    features = extract_advanced_features(audio_path)
    audio_features = extract_audio_features(audio_path)
    pred = model.predict(np.expand_dims(audio_features, axis=0))
    pred_idx = int(np.argmax(pred))
    prediction = label_mapping[pred_idx]
    probabilities = {label_mapping[i]: float(pred[0][i]) for i in range(len(label_mapping))}
    report_text = generate_medical_report(features, prediction, probabilities)
    result = {
        "acoustic_analysis": {
            "voice_perturbation": {
                "jitter": {"value": features["Jitter_Percent"]},
                "shimmer": {"value": features["Shimmer_Percent"]}
            }
        },
        "mfcc_features": {
            "mean": features["MFCC_Mean"],
            "std": features["MFCC_Std"]
        },
        "diagnosis": {
            "confidence_scores": probabilities,
            "predicted_condition": prediction
        },
        "detailed_report": report_text
    }
    with open("medical_report.json", "w") as f:
        json.dump(result, f)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, report_text)
    pdf.output("medical_report.pdf")
    return json.dumps(result) 