import requests
from app.config import PREDICTION_URL, PREDICTION_KEY

def detect_animals(image_bytes):
    headers = {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
    }

    response = requests.post(
        PREDICTION_URL,
        headers=headers,
        data=image_bytes  # ✅ raw bytes only
    )

    return response.json()
