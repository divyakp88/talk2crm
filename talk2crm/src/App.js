import logo from './logo.svg';
import './App.css';
import React, { useState} from "react";
import { ReactMic } from "react-mic";
import axios from "axios";


function App() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);

  // Start recording
  const startRecording = () => {
    setRecording(true);
    setTranscript("");
    setJsonOutput(null);
    setAudioBlob(null);
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
  };

  // When ReactMic stops recording, this is called
  const onStop = (recordedBlob) => {
    console.log("Recorded blob:", recordedBlob);
    setAudioBlob(recordedBlob);
  };

  // Send audio blob to Whisper backend
  const sendToBackend = async () => {
    if (!audioBlob) return alert("Please record audio first");

    try {
      const formData = new FormData();
      formData.append("file", audioBlob.blob, "recording.wav");

      const response = await axios.post(
        "http://localhost:8001/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Backend response:", response.data);

      setTranscript(response.data.transcript);
      setJsonOutput(response.data.extracted_data);
    } catch (error) {
      console.error("Backend error:", error);
      setJsonOutput({ error: "Backend not connected or failed" });
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
        mimeType="audio/wav"
      />

      {/* Recording buttons */}
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {/* Send to backend */}
      {audioBlob && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={sendToBackend}>Send to Backend</button>
        </div>
      )}

      {/* Transcription display */}
      {transcript && (
        <div style={{ marginTop: "20px" }}>
          <h3>Transcribed Text</h3>
          <p>{transcript}</p>
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