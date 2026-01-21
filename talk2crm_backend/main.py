from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#input model
class TranscriptInput(BaseModel):
    transcript:str

def extract_customer_data(transcript:str):
    data={
        "customer":{
            "full_name":"Amit vatma",
            "phone":"9961540763",
            "address":"45 park street",
            "city":"Kolkata",
            "locality":"salt LAke"
        },
        "interaction":{
            "summary":"Discussed demo",
            "created_At":datetime.utcnow().isoformat()
        }
    }
    return data

#API end point
@app.post("/extract")
async def extract_data(input:TranscriptInput):
    transcript=input.transcript
    json_output=extract_customer_data(transcript)
    return json_output
