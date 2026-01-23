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
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [results, setResults] = useState([]);
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
    setLoading(true);
    setStatusMsg("Please wait, data is processing at the backend...");
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
      
      setResults([
        ...results,
        {
          transcript: response.data.transcript,
          full_name: response.data.extracted_data.customer.full_name,
          phone: response.data.extracted_data.customer.phone,
          address: response.data.extracted_data.customer.address,
          city: response.data.extracted_data.customer.city,
          locality: response.data.extracted_data.customer.locality,
          summary: response.data.extracted_data.interaction.summary,
          timestamp: response.data.extracted_data.interaction.created_at
        }
      ]);
      setStatusMsg("Processing completed successfully");
    } catch (error) {
      console.error("Backend error:", error);
      setJsonOutput({ error: "Backend not connected or failed" });
      setStatusMsg("Backend error. Please try again.");
      
    } finally{
      setLoading(false);
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
          <button onClick={sendToBackend} disabled={loading} style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            }}>{loading ? "Processing..." : "Send to Backend"}</button>
            {statusMsg && (
        <p style={{ marginTop: "10px", color: "#555" }}>
        {statusMsg}
  </p>
)}
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

      {/*Dashboard table*/}
      {results.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3>Evaluation Dashboard</h3>
    <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Transcript</th>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>City</th>
          <th>Locality</th>
          <th>Summary</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {results.map((row, index) => (
          <tr key={index}>
            <td>{row.transcript}</td>
            <td>{row.full_name}</td>
            <td>{row.phone}</td>
            <td>{row.address}</td>
            <td>{row.city}</td>
            <td>{row.locality}</td>
            <td>{row.summary}</td>
            <td>{row.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
</div>
);
}

export default App;