from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import whisper
import tempfile
import os
import re

app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Load whisper model

model=whisper.load_model("small")

def extract_customer_data(transcript:str):
    name_match = re.search(r"(?:name is|this is)\s+([A-Za-z ]+)", transcript, re.I)
    phone_match = re.search(r"\b\d{10}\b", transcript)
    return {
        "customer": {
            "full_name": name_match.group(1).strip() if name_match else "Unknown",
            "phone": phone_match.group() if phone_match else "Not mentioned",
            "address": "Not mentioned",
            "city": "Not mentioned",
            "locality": "Not mentioned"
        },
        "interaction": {
            "summary": transcript[:100],
            "created_at": datetime.utcnow().isoformat()
        }
    }

#API trancribe+extract
@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):

    #save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False,suffix=".wav") as temp_audio:
        temp_audio.write(await file.read())
        temp_audio_path=temp_audio.name

    #trancribe using whisper
    result=model.transcribe(temp_audio_path)
    transcript_text=result["text"]

    #extract CRM data
    extracted_data=extract_customer_data(transcript_text)

    if os.path.exists(temp_audio_path):
        os.remove(temp_audio_path)
    return{
        "transcript":transcript_text,
        "extracted_data":extracted_data
    }
