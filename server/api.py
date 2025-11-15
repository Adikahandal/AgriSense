# server/api.py
import requests
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import base64
import json
import traceback
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure Config (DO NOT HARD-CODE)
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
MODEL_ID = "plant-disease-classification-dvfsj/1"
ROBOFLOW_URL = f"https://classify.roboflow.com/{MODEL_ID}?api_key={ROBOFLOW_API_KEY}"

# Load optional Disease Database
try:
    with open("disease_db.json", "r", encoding="utf-8") as f:
        DISEASE_DB = json.load(f)
except Exception:
    DISEASE_DB = {}


def generate_recommendation(label: str, confidence: float) -> str:
    """Smart recommendation generator using DB fallback + rule based suggestions."""

    l = label.lower()

    # DB-Based Recommendations
    if label in DISEASE_DB:
        entry = DISEASE_DB[label]
        parts = []

        if "treatment" in entry:
            parts.append("Treatment: " + ", ".join(entry["treatment"][:3]))
        if "prevention" in entry:
            parts.append("Prevention: " + ", ".join(entry["prevention"][:2]))

        result = ". ".join(parts).strip()
        if result:
            return result

    # Confidence Severity Notes
    if confidence >= 0.85:
        sev = "High confidence — treat immediately. "
    elif confidence >= 0.60:
        sev = "Moderate confidence — verify and treat. "
    else:
        sev = "Low confidence — re-check with a clearer image. "

    # Rule-Based Recommendations
    if "blight" in l:
        return sev + "Remove affected leaves, improve airflow, and apply a recommended fungicide (e.g., copper-based)."
    if "rust" in l:
        return sev + "Use sulfur spray, remove infected foliage, and ensure good spacing."
    if "mildew" in l:
        return sev + "Apply neem oil or potassium bicarbonate and reduce humidity."
    if "scab" in l or "spot" in l:
        return sev + "Apply fungicide, improve sanitation, and avoid overhead watering."
    if "healthy" in l:
        return "Plant appears healthy. Maintain balanced irrigation and nutrients."

    # Fallback
    return sev + "Perform sanitation, isolate infected plants, and consult local guidelines."


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    """Analyze image → return disease + confidence + recommendation"""
    try:
        if not ROBOFLOW_API_KEY:
            return {"error": "Missing Roboflow API key on server."}

        # Read & encode image
        img_bytes = await image.read()
        encoded = base64.b64encode(img_bytes).decode("utf-8")

        # Roboflow request
        response = requests.post(
            ROBOFLOW_URL,
            data=encoded,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30,
        )

        if response.status_code != 200:
            return {
                "error": f"Roboflow Error {response.status_code}",
                "raw": response.text,
            }

        data = response.json()

        # Predictions = list
        preds = data.get("predictions", [])
        if not preds:
            return {"error": "No predictions were returned. Try a clearer image."}

        # Best match
        best = max(preds, key=lambda x: float(x.get("confidence", 0)))
        label = best.get("class", "unknown")
        confidence = float(best.get("confidence", 0.0))

        # Generate AI recommendations
        recommendation = generate_recommendation(label, confidence)

        return {
            "label": label.replace("_", " "),
            "confidence": round(confidence, 4),
            "recommendation": recommendation,
        }

    except Exception as e:
        traceback.print_exc()
        return {"error": "Unexpected server error", "details": str(e)}


@app.get("/recommend")
def recommend_root():
    return {
        "info": "Upload an image on /analyze to receive AI-generated disease recommendations."
    }
