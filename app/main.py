from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.vision import detect_animals
from app.services.webhook import send_to_webhook
from app.services.chatbot import ask_question
from app.utils.parser import parse_predictions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_alerts = []


class ChatRequest(BaseModel):
    message: str

# Health check
@app.get("/")
def home():
    return {"message": "WildTrack API running"}

# 🐘 Animal detection endpoint
@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    global latest_alerts
    image = await file.read()

    # AI detection (Custom Vision)
    result = detect_animals(image)
    print("RAW RESULT:", result)

    # Parse alerts
    alerts = parse_predictions(result)
    latest_alerts = alerts

    # Send alerts to Make webhook (zoo keeper SMS)
    for alert in alerts:
        send_to_webhook(alert)

    return {
        "status": "success",
        "alerts": alerts
    }


@app.get("/alerts")
def get_alerts():
    return {
        "status": "success",
        "alerts": latest_alerts,
    }


# 🤖 OPTIONAL: Bot webhook bridge (if you want bot → FastAPI)
@app.post("/bot-message")
async def bot_message(payload: dict):
    """
    This is ONLY needed if you want:
    Azure Bot → FastAPI → custom logic
    """

    user_message = payload.get("message", "")

    # You can add custom logic here (optional)
    response = {
        "reply": f"You asked: {user_message}"
    }

    return response


@app.post("/chat")
async def chat(payload: ChatRequest):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        answer = ask_question(message)
        return {"reply": answer}
    except Exception:
        raise HTTPException(status_code=500, detail="Chat service is unavailable")
