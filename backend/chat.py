from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import re

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

def format_response(text: str) -> str:
    """Formats the response by adding bold headings, bigger text, spacing, and emojis."""

    # Format bold section headings with emojis
    text = re.sub(r"\*\*(.*?)\*\*", r"\n\n## 🔹 **\1**\n\n", text)

    # Ensure each bullet point is on a new line
    text = re.sub(r"🔹", r"\n🔹", text)

    return text.strip()

@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    try:
        response = chat.send_message(request.message, stream=True)
        full_response = "".join(chunk.text for chunk in response)

        # Format the response
        formatted_response = format_response(full_response)

        return {"reply": formatted_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
