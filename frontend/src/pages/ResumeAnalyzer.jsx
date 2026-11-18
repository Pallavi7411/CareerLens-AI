
import { useState } from "react";
import {
  ClipboardPaste,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function ResumeAnalyzer({ onAnalysisComplete }) {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);



  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume content.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume_text", resumeText);

    try {
      const response = await fetch(
        `${API_URL}/analyze-text`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }

      setResult(data);
     onAnalysisComplete(data);
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

   const resetAnalysis = () => {
    setResumeText("");
    setResult(null);
    setError("");
    onAnalysisComplete(null);
  };

  return (
    <div className="resume-analyzer">
      <div className="page-heading">
        <div>
          <h1>Resume Analyzer</h1>
          <p>
            Analyze your resume and discover opportunities
            to improve your career profile.
          </p>
        </div>
      </div>

      <div className="upload-card">
        <div className="text-input-area">
          <div className="paste-heading">
            <ClipboardPaste size={25} />
            <h3>Paste Your Resume</h3>
          </div>

          <p>
            Copy your resume content from Word or PDF
            and paste it below.
          </p>

          <textarea
            value={resumeText}
            onChange={(event) => {
              setResumeText(event.target.value);
              setError("");
              setResult(null);
            }}
            placeholder={`Paste your resume here...

Include:
Name
Email
Education
Technical Skills
Projects
Experience
Certifications
Achievements`}
            rows={14}
            maxLength={50000}
          />

          <div className="character-count">
            {resumeText.length}/50000 characters
          </div>
        </div>

        <button
          className="analyze-button"
          onClick={analyzeResume}
          disabled={!resumeText.trim() || loading}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={18} />
              Analyzing...
            </>
          ) : (
            <>
              <ClipboardPaste size={18} />
              Analyze Resume
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <AlertCircle size={19} />
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="analysis-results">
          <div className="results-heading">
            <h2>Analysis Results</h2>
            <button onClick={resetAnalysis}>
              Analyze Another Resume
            </button>
          </div>

          <div className="result-score-card">
            <span>Resume Quality Score</span>
            <strong>{result.resume_score}/100</strong>
          </div>

          <div className="result-profile">
            <h3>Candidate Information</h3>
            <p>
              <strong>Name:</strong> {result.candidate_name}
            </p>
            <p>
              <strong>Email:</strong> {result.email}
            </p>
          </div>

          <div className="result-section">
            <h3>Detected Skills</h3>
            <div className="skills-list">
              {result.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
              {result.skills.length === 0 && (
                <p>No recognized skills found.</p>
              )}
            </div>
          </div>

          <div className="result-section">
            <h3>Strengths</h3>
            <ul>
              {result.strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h3>Areas for Improvement</h3>
            <ul>
              {result.improvements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-note">
            <FileText size={17} />
            Resume quality score is based on our
            rule-based evaluation criteria.
          </div>
        </div>
      )}
    </div>
  );
}


