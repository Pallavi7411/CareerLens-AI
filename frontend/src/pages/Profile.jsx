
export default function Profile({
  candidateAnalysis = null,
  candidateSkills = [],
  selectedRole = "Not selected",
  learningProgress = 0
}) {
  const name =
    candidateAnalysis?.name ||
    candidateAnalysis?.candidate_name ||
    "Not available";

  const email =
    candidateAnalysis?.email ||
    "Not available";

  const score =
    candidateAnalysis?.score ??
    candidateAnalysis?.resume_score ??
    null;

  return (
    <div className="profile-page">
      <div className="page-heading">
        <h1>My Profile</h1>
        <p>View your candidate information and career development progress.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {name !== "Not available"
            ? name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-identity">
          <h2>{name}</h2>
          <p>{email}</p>
          <span className="profile-role">{selectedRole}</span>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <span>Resume Score</span>
          <strong>{score !== null ? `${score}/100` : "--"}</strong>
        </div>

        <div className="profile-stat-card">
          <span>Skills Identified</span>
          <strong>{candidateSkills.length}</strong>
        </div>

        <div className="profile-stat-card">
          <span>Learning Progress</span>
          <strong>{learningProgress}%</strong>
        </div>
      </div>

      <div className="profile-details-card">
        <h3>Candidate Information</h3>

        <div className="profile-detail-row">
          <span>Full Name</span>
          <strong>{name}</strong>
        </div>

        <div className="profile-detail-row">
          <span>Email Address</span>
          <strong>{email}</strong>
        </div>

        <div className="profile-detail-row">
          <span>Target Career</span>
          <strong>{selectedRole}</strong>
        </div>
      </div>

      <div className="profile-details-card">
        <h3>My Analyzed Skills</h3>

        {candidateSkills.length > 0 ? (
          <div className="profile-skill-list">
            {candidateSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        ) : (
          <p className="profile-empty">
            Analyze your resume to display your skills here.
          </p>
        )}
      </div>
    </div>
  );
}
