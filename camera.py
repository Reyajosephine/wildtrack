import cv2
import requests

API_URL = "http://127.0.0.1:8000/detect"

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    _, img_encoded = cv2.imencode('.jpg', frame)

    response = requests.post(
        API_URL,
        files={"file": img_encoded.tobytes()}
    )

    print(response.json())

    cv2.imshow("WildTrack Camera", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
