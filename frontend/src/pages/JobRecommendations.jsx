
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

function JobRecommendations({ candidateSkills = [] }) {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Fetch job recommendations from backend
  const findJobs = async (skillsToSearch) => {
    if (!skillsToSearch.trim()) {
      setError("Please enter your skills first.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const formData = new FormData();
      formData.append("skills", skillsToSearch);

      const response = await fetch(`${API_URL}/recommend-jobs`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to fetch recommendations.");
      }

      setJobs(data.recommendations || []);
      setSearched(true);

    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically use skills extracted from Resume Analyzer
  useEffect(() => {
    if (candidateSkills.length > 0) {
      const extractedSkills = candidateSkills.join(", ");

      setSkills(extractedSkills);
      findJobs(extractedSkills);
    }
  }, [candidateSkills]);

  return (
    <div className="job-recommendations-page">

      <div className="page-heading">
        <h1>Job Recommendations</h1>
        <p>Discover opportunities that match your skills.</p>
      </div>

      <div className="job-search-panel">
        <h2>Find Jobs That Match Your Skills</h2>
        <p>Enter your skills separated by commas.</p>

        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Example: Python, SQL, React, AWS, JavaScript"
          rows={4}
        />

        <button
          onClick={() => findJobs(skills)}
          disabled={loading}
        >
          {loading ? "Finding Jobs..." : "Find Matching Jobs"}
        </button>

        {error && <p className="job-error">{error}</p>}
      </div>

      {loading && (
        <p>Finding jobs that match your skills...</p>
      )}

      {searched && (
        <div className="job-results">

          <h2>Recommended Jobs</h2>

          <p className="sample-notice">
            These are sample job listings for demonstration, not live vacancies.
          </p>

          {jobs.length === 0 ? (
            <p>No matching jobs found.</p>
          ) : (
            jobs.map((job) => (
              <div className="job-card" key={job.job_id}>

                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.company} · {job.location}
                    </p>
                  </div>

                  <div className="match-score">
                    {job.match_percentage}% Match
                  </div>
                </div>

                <p className="job-description">
                  {job.description}
                </p>

                <div className="job-details">
                  <span>{job.job_type}</span>
                  <span>{job.experience_level}</span>
                </div>

                <h4>Matched Skills</h4>

                <div className="skill-tags">
                  {job.matched_skills.length > 0 ? (
                    job.matched_skills.map((skill) => (
                      <span className="matched-tag" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span>No matching skills yet</span>
                  )}
                </div>

                <h4>Skills to Improve</h4>

                <div className="skill-tags">
                  {job.missing_skills.map((skill) => (
                    <span className="missing-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}

export default JobRecommendations;
