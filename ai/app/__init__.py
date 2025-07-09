from flask import Flask
from keras.layers import TFSMLayer
from groq import Groq
from dotenv import load_dotenv
import os
import cloudinary

# Load .env variables BEFORE using them
load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_key)

# ✅ Load model using TFSMLayer instead of load_model (Keras 3 change)
model_path = "app/lsm_model3"
model = TFSMLayer(model_path, call_endpoint="serving_default")  # You can change this if needed

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    
    from .audio_bp import audio_bp
    app.register_blueprint(audio_bp, url_prefix='/api')
    return app
