from app import create_app
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

app = create_app()
CORS(app, resources={r"/api/*": {"origins": os.getenv("BACKEND_ORIGIN", "*")}}, supports_credentials=True)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081, use_reloader=False) 