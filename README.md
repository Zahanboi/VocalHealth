# VocalHealth

## Project Overview

A basic description about the project is provided in the ppt [presentation](https://www.canva.com/design/DAGsOC_zwJM/eMYN14kZyyUACfZuyMpcmA/view?utm_content=DAGsOC_zwJM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha120e4347d).

VocalHealth is a web application with a Node.js/Express backend and a modern React frontend. This project is organized into three main folders: `ai` , `backend` and `frontend`.

## Demo & Live Site

- **Project Demo:** [Watch here](https://drive.google.com/file/d/11Nl2WbcNF2KJelZP5ub_QegvAbF47nTu/view?usp=sharing)
- **Live Site:** [https://vocalhealth-frontend.onrender.com/](https://vocalhealth-frontend.onrender.com/)


## Installation

First, clone the project to your local machine using the following command in your desired directory:

```bash
git clone https://github.com/Zahanboi/VocalHealth.git
```

Then, follow the instructions below to run the ai, backend and frontend in separate terminals.

## Project Structure

```
VocalHealth/
├── ai/
├── backend/
└── frontend/
```

## Getting Started
### AI

1. Navigate to the `ai` directory:
    ```bash
    cd ai
    ```
2. Open a new terminal in this folder.

3. Install Python 3.10.11 from [here](https://www.python.org/downloads/release/python-31011/). During installation, ensure you check "Add Python to PATH".

4. After installation, verify the Python version:
    ```bash
    py -3.10 --version
    ```
    Confirm the output is `3.10.11`.
5. (Optional) Delete any existing virtual environment:
    ```powershell
    Remove-Item -Recurse -Force venv
    ```
6. Create a new virtual environment with Python 3.10:
    ```bash
    py -3.10 -m venv venv
    ```
7. Activate the virtual environment:
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
8. Install dependencies:(run inside environment, let all install)
    ```bash
    pip install -r requirements.txt
    ```
9. Run the AI application:
    ```bash
    python main.py
    ```

10. Copy the example environment file and update it with your credentials:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and fill in the required environment variables.   
### Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Copy the example environment file and update it with your credentials:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and fill in the required environment variables.
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm run dev
    ```
    The backend will run on [http://localhost:8000](http://localhost:8000).

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies and put your Backend Server URL in env:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run on [http://localhost:5173](http://localhost:5173).

