from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from groq import Groq
import whisper
import tempfile
import os
import re
import json

app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Load whisper model

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


model=whisper.load_model("small")

def extract_customer_data(transcript:str):
    prompt = f"""
You are a CRM data extraction system.

Extract the following fields from the transcript.
If a field is missing, return "Not mentioned".

Return ONLY valid JSON in this format:

{{
  "customer": {{
    "full_name": "",
    "phone": "",
    "address": "",
    "city": "",
    "locality": ""
  }},
  "interaction": {{
    "summary": "",
   
  }}
}}

Transcript:
\"\"\"{transcript}\"\"\"
"""
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "error": "LLM returned invalid JSON",
            "raw_output": content
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
    if "interaction" in extracted_data:
        extracted_data["interaction"]["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if os.path.exists(temp_audio_path):
        os.remove(temp_audio_path)
    return{
        "transcript":transcript_text,
        "extracted_data":extracted_data
    }
