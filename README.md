# Talk2CRM – Voice-First Progressive Web App (PWA)

---

## Overview

Talk2CRM is a voice‑first Progressive Web Application (PWA) designed to help sales teams capture customer interaction details using speech instead of typing. A salesperson speaks naturally, and the system automatically:

- Converts speech to text using **Whisper**  
- Extracts structured CRM fields using an LLM (**Groq – LLaMA 3.1**)  
- Displays results as **JSON + Evaluation Dashboard**  
- Exports results as an **Excel-compatible CSV** for Human‑in‑the‑Loop (HITL) verification and training  

This project was built as part of a technical assessment for a **voice-first CRM system**.

---

## 🎯 Key Features

- 🎤 **Voice recording from browser** (ReactMic)  
-  **Speech-to-Text** using Whisper (backend)  
-  **Structured CRM JSON extraction** (customer + interaction)  
-  **Evaluation Dashboard** supporting multiple test runs (10–20)  
-  **Export dashboard results as CSV** (Excel-ready)  
-  **HITL-friendly output** for internal verification and model training  
-  **Progressive Web App (PWA-ready)**  
- 📱 **APK generation from PWA** (via Trusted Web Activity, TWA)  

---

## 🧱 Tech Stack

### Frontend
- **React (Web)**  
- **ReactMic** for audio recording  
- **Axios** for API calls  
- HTML / CSS  

### Backend
- **FastAPI**  
- **OpenAI Whisper** (Speech-to-Text)  
- **Groq API** (LLaMA‑3.1‑8B‑Instant)  
- Python  

---

## 🏗️ Architecture Flow

1. **User records voice input** from the browser  
2. **Audio sent to backend** via REST API  
3. **Whisper** converts audio → transcript  
4. **LLM / Groq API** extracts structured CRM fields from transcript  
5. **Dashboard displays**:  
   - Transcript  
   - Extracted CRM JSON  
   - Evaluation metrics / multiple test runs  
6. **CSV export** available for HITL review or training

- **User Speech**  
  ↓
- **ReactMic (Browser)**  
  ↓
- **FastAPI (/transcribe)**  
  ↓
- **Whisper → Transcription**  
  ↓
- **Groak LLM → Structured CRM JSON**  
  ↓
- **Frontend Dashboard + CSV Export**

## 📊 Extracted CRM Fields

### Customer
- Full Name  
- Phone Number  
- Address  
- City  
- Locality  

### Interaction
- Summary  
- Timestamp  

> If a field is not found, the system returns: `Not mentioned`  

---

## 🧪 Evaluation Dashboard

Each voice interaction creates one row in the dashboard. The dashboard displays:

- Transcript (raw Whisper output)  
- Extracted CRM fields  
- Interaction summary  
- Timestamp  

This allows reviewers to:

- Verify extraction accuracy  
- Compare transcript vs structured data

# CSV Export (HITL‑Ready)

The dashboard can be exported as a **CSV file**:

- Excel‑compatible
- UTF‑8 encoded
- One row per voice interaction

This supports:

- Internal verification
- QA review
- Training data curation
# How to Run the Project
 ## Frontend Setup
 ```
npm start
```
The app will run at:
```
http://localhost/3000
```
 ## Backend Setup(Expected API)

The frontend expects a backend endpoint:
```
POST http://localhost:8001/transcribe
```
Request:

Multipart form‑data

Key: file (audio/wav)

Response format:
- **Format:** JSON  
```json
{
  "customer": {
    "full_name": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "locality": "string"
  },
  "interaction": {
    "summary": "string",
    "created_at": "ISO 8601 timestamp"
  }
}
```

## 📊 Demo Screenshots

### 1.Voice Input (Microphone Capture)
<img src="https://github.com/user-attachments/assets/fa5f0cb6-0c60-462d-a10b-36407cac425f" width="900" />

### 2.Speech-to-Text & Evaluation Dashboard
<img src="https://github.com/user-attachments/assets/0fa7afd4-dd75-4095-b1da-3aef8f8b26f0" width="900" />

### 3.HITL Evaluation – Excel-Style Results Sheet
<img src="https://github.com/user-attachments/assets/8b0f18db-3a8e-436d-a5fd-f13668ad932d" width="900" /> 

## Key Design Decisions

- **Vertical layout only** for clarity and mobile friendliness  
- **Client-side CSV export** (no backend dependency)  
- **Explicit evaluation focus**, not just UI demo  
- **Graceful fallback** for missing data

## Future Enhancements

- **Confidence score** per extracted field  
- **Field-level source highlighting**  
- **Editable corrections** (HITL feedback loop)  
- **Batch audio upload**  
- **Authentication & user roles**

## Conclusion

Talk2CRM demonstrates how voice interactions can be reliably converted into structured, auditable CRM data. The focus on evaluation transparency and HITL-friendly outputs makes it suitable for real-world internal deployments and further ML training.


