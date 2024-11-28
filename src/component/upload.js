import React, { useState } from "react";
import axios from "axios";
import mammoth from "mammoth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [previewContent, setPreviewContent] = useState("");
  const [fileType, setFileType] = useState(""); // Tracks the file type (pdf or docx)
  const [zoom, setZoom] = useState(1);
  const [resumeData, setResumeData] = useState({
    name: "",
    dob: "",
    phone: "",
    maritalStatus: "",
    email: "",
    education: {
      degree: [],
      college: [],
      year: [],
      mark: [],
    },
    gender: "",
    technicalSkills: {
      foundKeywords: [],
      extractedSkills: [],
    },
    languages: [],
    jobTitle: "",
    experience: [],
    companyDetails: "",
    certifications: [],
  });
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const fileType = file.type;

    // Determine file type
    if (fileType === "application/pdf") {
      setFileType("pdf");
      setPreviewContent(URL.createObjectURL(file)); // Generate preview URL for PDFs
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      setFileType("docx");
      convertDocxToHtml(file); // Convert DOCX to HTML for preview
    } else {
      setFileType("");
      alert("Unsupported file type. Please upload a PDF or DOCX file.");
    }
  };

  const convertDocxToHtml = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setPreviewContent(result.value); // Set converted HTML content for preview
    } catch (error) {
      console.error("Error converting DOCX file:", error);
      alert("Failed to preview DOCX file.");
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setLoading(true); // Show loading spinner
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axios.post(
        "https://resume-parser-7dfx.onrender.com/api/upload",
        // "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // response.data.education
      setResumeData(response.data);
      console.log(
        "Education Trimmed Text:",
        response?.data?.educationTrimmedText
      );
      console.log("Parsed Text:", response?.data?.text);
    } catch (error) {
      setLoading(false); // Hide loading spinner
      console.error("Error uploading file:", error);
      toast.error("There was an error uploading the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewContent("");
    setFileType("");
  };

  const handleZoomChange = (e) => {
    setZoom(e.target.value);
  };

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "center",
      alignItems: "start",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      padding: 3,
      gap: 4,
    }}
    >
      {/* Left Panel - Form and Extracted Data */}
      <Paper
       elevation={3}
       sx={{
         padding: 4,
         maxWidth: 600,
         width: "100%",
         textAlign: "center",
         backgroundColor: "#fff",
         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
       }}
      >
        <Typography variant="h5" gutterBottom>
          Upload Your Resume
        </Typography>

        <input
          type="file"
          accept=".pdf, .docx"
          onChange={handleFileChange}
          style={{
            display: "block",
            margin: "20px auto",
            cursor: "pointer",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          sx={{
            marginTop: 2,
            width: "100%",
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} /> : "Upload Resume"}
        </Button>

        {resumeData.name && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  value={resumeData.name}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="DOB"
                  value={resumeData.dob}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Contact No"
                  value={resumeData.phone}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Marital Status"
                  value={resumeData.maritalStatus}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  value={resumeData.email}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Languages"
                  value={resumeData.languages}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Title"
                  value={resumeData.jobTitle}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Gender"
                  value={resumeData.gender}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {/* Certifications  ---------------------------------------------*/}
              <Grid item xs={12} style={{ paddingLeft: "20px", margin: 0 }}>
                <Typography variant="h6" sx={{ textAlign: "left" }}>
                  Certifications:
                </Typography>
                <ul>
                  {(Array.isArray(resumeData.certifications)
                    ? resumeData.certifications
                    : resumeData.certifications?.split(",") || []
                  ).map((certification, index) => (
                    <li key={index} style={{ textAlign: "left" }}>
                      <Typography variant="body1">
                        {certification.trim()}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Grid>

              {/* education --------------------------------------------- */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align="left">
                  Education
                </Typography>

                {/* Table to display Education details */}
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="education details">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Degree/Course</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>University</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Year</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Score/CGPA</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(resumeData.education) &&
                      resumeData.education.length > 0 ? (
                        resumeData.education.map((edu, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {edu.degree || "No Information Found"}
                            </TableCell>
                            <TableCell align="left">
                              {edu.college || "No Information Found"}
                            </TableCell>
                            <TableCell align="left">
                              {edu.year || "No Information Found"}
                            </TableCell>
                            <TableCell align="left">
                              {edu.mark || "No Information Found"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No Education Details Available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            
              {/* Experience -----------------*/}
              {/* <Grid item xs={12}>
                <TextField
                  label="Experience"
                  value={resumeData.experience}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  fullWidth
                  margin="normal"
                  multiline
                  rows={6} // Optional: to make it suitable for long text
                />
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align="left">
                  Experience
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Company Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Designation</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Start Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>End Date</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(resumeData.experience) &&
                        resumeData.experience.map((exp, index) => (
                          <TableRow key={index}>
                            <TableCell>{exp.company}</TableCell>
                            <TableCell>{exp.role}</TableCell>
                            <TableCell>{exp.startDate}</TableCell>
                            <TableCell>{exp.endDate}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Box mt={3} textAlign="left">
              <Typography variant="h6" gutterBottom>
                Technical Skills
              </Typography>

              {/* Check if there are extracted skills */}
              {resumeData.technicalSkills?.extractedSkills?.length > 0 ? (
                <Grid container spacing={1}>
                  {/* Iterate through the extracted skills and display them */}
                  {resumeData.technicalSkills.extractedSkills.map(
                    (skill, index) => (
                      <Grid item key={index}>
                        <Chip label={skill} />
                      </Grid>
                    )
                  )}
                </Grid>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No technical skills found.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Right Panel - Resume Preview */}
      {previewContent && (
        <div style={styles.previewContainer}>
          <button onClick={closePreview} style={styles.closeButton}>
            &times;
          </button>
          <h3 style={{ color: "black" }}>Document Preview</h3>

          {/* Zoom Slider */}
          <div style={styles.zoomContainer}>
            <label htmlFor="zoomSlider">Zoom: </label>
            <input
              type="range"
              id="zoomSlider"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={handleZoomChange}
              style={styles.zoomSlider}
            />
          </div>

          {fileType === "pdf" && (
            <iframe
              src={previewContent}
              style={{
                ...styles.iframe,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              title="PDF Preview"
            />
          )}

          {fileType === "docx" && (
            <div
              style={{
                ...styles.docxPreview,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          )}
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeButton
      />
    </Box>
  );
};
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },
  formContainer: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginRight: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  fileInputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  fileInput: {
    padding: "8px",
    backgroundColor: "black",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  uploadButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginTop: "10px",
  },
  resumeContainer: {
    marginTop: "20px",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "16px",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  previewContainer: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
    // marginTop: '20px',
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#333",
    cursor: "pointer",
  },
  iframe: {
    width: "100%",
    height: "500px",
    border: "none",
    backgroundColor: "#fff",
  },
  textPreview: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#333",
    fontSize: "16px",
  },
  zoomContainer: {
    marginBottom: "10px",
  },
  zoomSlider: {
    width: "100%",
  },
};
export default ResumeUpload;
