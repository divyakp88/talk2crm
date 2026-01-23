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


