
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobRecommendations from "./pages/JobRecommendations";
import SkillGap from "./pages/SkillGap";
import Profile from "./pages/Profile";
import "./index.css";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [candidateAnalysis, setCandidateAnalysis] = useState(null);

  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [learningProgress, setLearningProgress] = useState(0);

  const candidateSkills = candidateAnalysis?.skills || [];

  return (
    <div className="app-container">
      <div className={menuOpen ? "sidebar-wrapper open" : "sidebar-wrapper"}>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </div>

      <main className="main-content">
        <Header onMenuClick={() => setMenuOpen(!menuOpen)} />

        <section className="page-content">
          {activePage === "Dashboard" ? (
            <>
              <div className="page-heading">
                <span className="eyebrow">
                  CAREER MANAGEMENT PLATFORM
                </span>
                <h1>Dashboard</h1>
                <p>Welcome to your intelligent career workspace.</p>
              </div>

              <Dashboard setActivePage={setActivePage} />
            </>
          ) : activePage === "Resume Analyzer" ? (
            <ResumeAnalyzer
              onAnalysisComplete={setCandidateAnalysis}
            />
          ) : activePage === "Job Recommendations" ? (
            <JobRecommendations
              candidateSkills={candidateSkills}
            />
          ) : activePage === "Skill Gap Analysis" ? (
            <SkillGap
              candidateSkills={candidateSkills}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              setLearningProgress={setLearningProgress}
            />
          ) : activePage === "My Profile" ? (
            <Profile
              candidateAnalysis={candidateAnalysis}
              candidateSkills={candidateSkills}
              selectedRole={selectedRole}
              learningProgress={learningProgress}
            />
          ) : (
            <div className="placeholder-card">
              <h2>{activePage}</h2>
              <p>This section will be implemented next.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
