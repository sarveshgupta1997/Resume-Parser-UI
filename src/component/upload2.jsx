import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const ResumeUpload2 = () => {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set the extracted resume data in state
      setResumeData(response.data.resume);
      setError("");
    } catch (err) {
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      {/* File input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload
      </Button>

      {/* Error Message */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Resume Data */}
      {resumeData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resume Data</h3>
          <div><strong>Name:</strong> {resumeData.name}</div>
          <div><strong>Email:</strong> {resumeData.email}</div>
          <div><strong>Phone:</strong> {resumeData.phone}</div>
          <div><strong>Education:</strong> {resumeData.education}</div>
          <div><strong>Experience:</strong> {resumeData.experience}</div>
          <div><strong>Marital Status:</strong> {resumeData.maritalStatus}</div>
          <div><strong>Certificates:</strong> {resumeData.certificates}</div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload2;
