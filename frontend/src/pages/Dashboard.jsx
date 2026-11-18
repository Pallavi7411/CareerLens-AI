
import {
  FileText,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Code,
  Cloud,
  Database,
  ShieldCheck
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import StatCard from "../components/StatCard";

const chartData = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 58 },
  { month: "Mar", score: 52 },
  { month: "Apr", score: 70 },
  { month: "May", score: 76 },
  { month: "Jun", score: 85 }
];

const recentJobs = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions",
    match: "92%",
    type: "Full Time"
  },
  {
    title: "Python Developer",
    company: "Digital Innovations",
    match: "86%",
    type: "Internship"
  },
  {
    title: "Cloud Engineer",
    company: "Cloud Systems",
    match: "79%",
    type: "Full Time"
  }
];

export default function Dashboard({ setActivePage }) {
  return (
    <div className="dashboard">

      <div className="welcome-banner">
        <div>
          <span className="eyebrow">YOUR CAREER JOURNEY STARTS HERE</span>
          <h2>Welcome to CareerLens AI!</h2>
          <p>
            Discover your strengths, improve your resume
            and find opportunities that match your skills.
          </p>

          <button
            className="primary-button"
            onClick={() => setActivePage("Resume Analyzer")}
          >
            Analyze Your Resume <ArrowRight size={17} />
          </button>
        </div>

        <div className="welcome-art">
          <Sparkles size={65} />
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Career Overview</h2>
          <p>Your career statistics at a glance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Resumes Analyzed"
          value="0"
          subtitle="Start your first analysis"
          icon={FileText}
          color="purple"
        />

        <StatCard
          title="Jobs Matched"
          value="0"
          subtitle="Opportunities waiting"
          icon={BriefcaseBusiness}
          color="blue"
        />

        <StatCard
          title="Skills Identified"
          value="0"
          subtitle="Skills will appear here"
          icon={Target}
          color="green"
        />

        <StatCard
          title="Resume Score"
          value="--"
          subtitle="Analyze your resume"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card chart-card">
          <div className="card-heading">
            <div>
              <h3>Career Progress</h3>
              <p>Illustrative resume score trend</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="score"
                fill="#7867ed"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="demo-note">
            Sample visualization – replace with real analysis history.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Recommended Jobs</h3>
              <p>Sample opportunities</p>
            </div>
            <button
              className="text-button"
              onClick={() => setActivePage("Job Recommendations")}
            >
              View All
            </button>
          </div>

          <div className="job-list">
            {recentJobs.map((job) => (
              <div className="job-item" key={job.title}>
                <div className="job-icon">
                  <BriefcaseBusiness size={20} />
                </div>

                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p>{job.company} · {job.type}</p>
                </div>

                <strong>{job.match}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="dashboard-card learning-card">
        <div className="card-heading">
          <div>
            <h3>Build Your Skills</h3>
            <p>Explore areas relevant to your career.</p>
          </div>
        </div>

        <div className="learning-grid">
          <div className="learning-item">
            <Code size={23} />
            <h4>Full-Stack Development</h4>
            <p>Frontend and backend technologies</p>
          </div>

          <div className="learning-item">
            <Cloud size={23} />
            <h4>Cloud Computing</h4>
            <p>Cloud infrastructure and deployment</p>
          </div>

          <div className="learning-item">
            <Database size={23} />
            <h4>Database Management</h4>
            <p>SQL and data management</p>
          </div>

          <div className="learning-item">
            <ShieldCheck size={23} />
            <h4>Cybersecurity</h4>
            <p>Security and risk awareness</p>
          </div>
        </div>

        <p className="demo-note">
          These are illustrative learning suggestions, not personalized
          recommendations yet.
        </p>
      </div>

    </div>
  );
}
