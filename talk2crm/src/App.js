import logo from './logo.svg';
import './App.css';
import React, { useState,useRef } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";

function App() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);

  // Browser SpeechRecognition for live transcription
  const recognitionRef = useRef(null);

if (!recognitionRef.current) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.lang = "en-IN";
  recognitionRef.current.continuous = false;
  recognitionRef.current.interimResults = false;

  recognitionRef.current.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("Recognized:", text);
    setTranscript(text);
  };
}

  // Start recording
  const startRecording = () => {
    setTranscript("");
    setJsonOutput(null);
    setRecording(true);
    recognitionRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
    recognitionRef.current.stop();
  };

  // Handle ReactMic stop event 
  const onStop = async (recordedBlob) => {
    console.log("Recorded blob:", recordedBlob);

    
  };

  // Send transcript to backend
  const sendToBackend = async () => {
    console.log("Sending transcript:", transcript);

    try {
      const response = await axios.post(
        "http://localhost:8001/extract",
        { transcript }
      );
      console.log("Response:", response.data);
      setJsonOutput(response.data);
    } catch (error) {
      console.error("Backend error:", error);
      setJsonOutput({ error: "Backend not connected" });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Talk2CRM – Voice CRM</h2>

      {/* ReactMic sound wave */}
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#1976d2"
        backgroundColor="#f5f5f5"
      />

      {/* Recording buttons */}
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {/* Transcription display */}
      {transcript && (
        <div style={{ marginTop: "20px" }}>
          <h3>Transcribed Text</h3>
          <p>{transcript}</p>
          <button onClick={sendToBackend}>
            Send to Backend
          </button>
        </div>
      )}

      {/* JSON output */}
      {jsonOutput && (
        <div style={{ marginTop: "20px" }}>
          <h3>Extracted JSON</h3>
          <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;