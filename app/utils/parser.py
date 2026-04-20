def parse_predictions(result, threshold=0.5):
    alerts = []

    for pred in result.get("predictions", []):
        if pred["probability"] > threshold:
            alerts.append({
                "animal": pred["tagName"],
                "confidence": round(pred["probability"], 2),
                "bbox": pred.get("boundingBox", {})
            })

    return alerts
