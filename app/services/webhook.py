import requests
from datetime import datetime, timezone
from app.config import MAKE_WEBHOOK_URL


def send_to_webhook(data):
    confidence = data.get("confidence", 0)
    confidence_pct = int(round(float(confidence) * 100))
    animal = data.get("animal", "Unknown animal")
    zone = data.get("zone", "monitored zone")

    payload = {
        "animal": animal,
        "confidence": confidence,
        "confidence_percent": confidence_pct,
        "zone": zone,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "message": f"WildTrack Alert: {animal} detected in {zone} at {confidence_pct}% confidence."
    }

    try:
        requests.post(MAKE_WEBHOOK_URL, json=payload, timeout=15)
    except Exception as e:
        print("Webhook error:", e)
