
import { useState, useEffect } from "react";

const roleSkills = {
  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React",
    "Node.js", "SQL", "Git", "REST API"
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React",
    "Git", "TypeScript"
  ],
  "Python Developer": [
    "Python", "SQL", "FastAPI", "Git",
    "REST API", "PostgreSQL"
  ],
  "Cloud Engineer": [
    "AWS", "Linux", "Python", "Docker", "Git"
  ],
  "Machine Learning Engineer": [
    "Python", "Machine Learning", "NumPy",
    "Pandas", "Scikit-learn"
  ]
};

const learningRoadmaps = {
  "Node.js": {
    steps: [
      "Understand Node.js, its runtime and event-driven architecture.",
      "Learn modules, npm and package management.",
      "Practice asynchronous JavaScript, callbacks, promises and async/await.",
      "Learn Express.js and build REST APIs.",
      "Connect your application to a PostgreSQL or MongoDB database."
    ],
    project: "Build a task management REST API with user registration and login."
  },
  "TypeScript": {
    steps: [
      "Learn TypeScript setup and basic types.",
      "Understand interfaces, type aliases and functions.",
      "Practice classes, generics and type narrowing.",
      "Learn how to use TypeScript with React.",
      "Convert a small JavaScript application into TypeScript."
    ],
    project: "Build a typed React task manager with reusable components."
  },
  "HTML": {
    steps: [
      "Learn semantic HTML elements and document structure.",
      "Practice forms, tables, links and images.",
      "Understand accessibility attributes.",
      "Build multi-page web layouts."
    ],
    project: "Create a responsive portfolio website."
  },
  "CSS": {
    steps: [
      "Learn selectors, box model and positioning.",
      "Practice Flexbox and CSS Grid.",
      "Understand responsive design and media queries.",
      "Learn transitions, animations and reusable styles."
    ],
    project: "Design a responsive dashboard for a career platform."
  },
  "JavaScript": {
    steps: [
      "Learn variables, data types, operators and functions.",
      "Practice arrays, objects and array methods.",
      "Understand DOM manipulation and events.",
      "Learn promises, async/await and API requests."
    ],
    project: "Build an interactive job search interface using a public API."
  },
  "React": {
    steps: [
      "Understand components, JSX and props.",
      "Learn state management using useState.",
      "Practice useEffect and handling API requests.",
      "Learn React Router and reusable components.",
      "Build and deploy a complete React application."
    ],
    project: "Build a job portal with search, filters and application tracking."
  },
  "SQL": {
    steps: [
      "Learn database concepts and basic SQL queries.",
      "Practice SELECT, INSERT, UPDATE and DELETE.",
      "Understand joins, grouping and aggregate functions.",
      "Learn subqueries, indexes and database relationships."
    ],
    project: "Create a job application database with reports and queries."
  },
  "Git": {
    steps: [
      "Understand repositories and version control.",
      "Practice add, commit, push and pull.",
      "Learn branches, merging and conflict resolution.",
      "Understand GitHub collaboration and pull requests."
    ],
    project: "Collaborate on a project using feature branches and pull requests."
  },
  "REST API": {
    steps: [
      "Understand HTTP methods and status codes.",
      "Learn REST principles and endpoint design.",
      "Practice JSON requests and responses.",
      "Understand API validation, authentication and error handling."
    ],
    project: "Build a REST API for managing student or job records."
  },
  "Python": {
    steps: [
      "Learn Python syntax, variables and data types.",
      "Practice functions, collections and loops.",
      "Understand object-oriented programming and exceptions.",
      "Learn file handling, modules and virtual environments."
    ],
    project: "Build a Python application that analyzes and organizes data."
  },
  "FastAPI": {
    steps: [
      "Learn FastAPI setup and route creation.",
      "Understand request parameters and Pydantic models.",
      "Practice validation and HTTP methods.",
      "Learn database integration and API documentation.",
      "Understand authentication and deployment."
    ],
    project: "Build a resume analysis API with multiple endpoints."
  },
  "PostgreSQL": {
    steps: [
      "Understand relational databases and tables.",
      "Practice SQL queries and constraints.",
      "Learn joins, indexes and relationships.",
      "Connect PostgreSQL to a Python backend.",
      "Practice database design and backups."
    ],
    project: "Create a database-backed job recommendation application."
  },
  "AWS": {
    steps: [
      "Understand cloud computing and AWS global infrastructure.",
      "Learn IAM users, roles and permissions.",
      "Explore EC2, S3 and VPC fundamentals.",
      "Practice deploying a web application on AWS.",
      "Understand monitoring, security and cost management."
    ],
    project: "Deploy a web application using EC2 and S3."
  },
  "Linux": {
    steps: [
      "Learn Linux file system navigation.",
      "Practice common terminal commands.",
      "Understand users, permissions and processes.",
      "Learn package management and shell scripting.",
      "Practice networking and service management."
    ],
    project: "Set up and manage a Linux server for a web application."
  },
  "Docker": {
    steps: [
      "Understand containers and images.",
      "Learn Dockerfiles and image creation.",
      "Practice running and managing containers.",
      "Learn Docker Compose and multi-container applications.",
      "Understand container networking and volumes."
    ],
    project: "Containerize a frontend and backend application."
  },
  "Machine Learning": {
    steps: [
      "Learn supervised and unsupervised learning.",
      "Understand training, testing and validation datasets.",
      "Practice regression and classification algorithms.",
      "Learn model evaluation and feature engineering.",
      "Build and evaluate an end-to-end ML pipeline."
    ],
    project: "Build a machine learning model to predict outcomes from a dataset."
  },
  "NumPy": {
    steps: [
      "Learn NumPy arrays and array creation.",
      "Practice indexing, slicing and reshaping.",
      "Understand broadcasting and vectorized operations.",
      "Learn aggregation and mathematical functions."
    ],
    project: "Create a numerical data analysis application using NumPy."
  },
  "Pandas": {
    steps: [
      "Learn Series and DataFrame structures.",
      "Practice loading CSV and Excel datasets.",
      "Understand filtering, sorting and grouping.",
      "Practice handling missing values and data cleaning.",
      "Learn data analysis and export operations."
    ],
    project: "Analyze a job dataset and generate a data insights report."
  },
  "Scikit-learn": {
    steps: [
      "Understand the Scikit-learn workflow.",
      "Learn preprocessing and feature transformation.",
      "Practice model training and prediction.",
      "Understand model evaluation and cross-validation.",
      "Learn pipelines and model saving."
    ],
    project: "Train and evaluate a classification model using a real dataset."
  }
};

const defaultRoadmap = {
  steps: [
    "Understand the fundamentals and terminology.",
    "Learn the core concepts and tools.",
    "Practice with guided examples.",
    "Build a small practical application."
  ],
  project: "Build a small project demonstrating this skill."
};

export default function SkillGap({
  candidateSkills = [],
  selectedRole: selectedRoleProp,
  setSelectedRole: updateSelectedRole,
  setLearningProgress
}) {
  const [selectedRole, setSelectedRole] = useState(
  selectedRoleProp || "Full Stack Developer"
);
  const [completedSteps, setCompletedSteps] = useState({});

  const requiredSkills = roleSkills[selectedRole];

  const normalize = (value) => value.trim().toLowerCase();

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkills.some(
      (candidateSkill) =>
        normalize(candidateSkill) === normalize(skill)
    )
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  const coverage = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  const roadmapTasks = missingSkills.flatMap((skill) => {
    const roadmap = learningRoadmaps[skill] || defaultRoadmap;
    return roadmap.steps.map((step, index) => ({
      id: `${selectedRole}-${skill}-${index}`,
      skill,
      step
    }));
  });

  const completedCount = roadmapTasks.filter(
    (task) => completedSteps[task.id]
  ).length;

  const learningProgress = roadmapTasks.length
    ? Math.round((completedCount / roadmapTasks.length) * 100)
    : 100;

    useEffect(() => {
  updateSelectedRole?.(selectedRole);
}, [selectedRole, updateSelectedRole]);

useEffect(() => {
  setLearningProgress?.(learningProgress);
}, [learningProgress, setLearningProgress]);

useEffect(() => {
  if (selectedRoleProp && selectedRoleProp !== selectedRole) {
    setSelectedRole(selectedRoleProp);
  }
}, [selectedRoleProp]);

  const toggleStep = (taskId) => {
    setCompletedSteps((previous) => ({
      ...previous,
      [taskId]: !previous[taskId]
    }));
  };

  return (
    <div className="skill-gap-page">
      <div className="page-heading">
        <h1>Skill Gap Analysis</h1>
        <p>
          Identify the skills you have and the skills you need to develop.
        </p>
      </div>

      <div className="skill-gap-card">
        <h2>Select Your Target Career</h2>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {Object.keys(roleSkills).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {candidateSkills.length === 0 ? (
          <p className="skill-gap-notice">
            Please analyze your resume first to view your skill gap.
          </p>
        ) : (
          <>
            <div className="coverage-section">
              <h3>Skill Coverage</h3>
              <strong>{coverage}%</strong>
              <div className="coverage-track">
                <div
                  className="coverage-fill"
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <p>
                {matchedSkills.length} of {requiredSkills.length} required
                skills identified.
              </p>
            </div>

            <div className="gap-section">
              <h3>Your Existing Skills</h3>
              <div className="gap-tags">
                {matchedSkills.length ? (
                  matchedSkills.map((skill) => (
                    <span className="gap-match" key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No matching skills found yet.</p>
                )}
              </div>
            </div>

            <div className="gap-section">
              <h3>Skills to Develop</h3>
              <div className="gap-tags">
                {missingSkills.length ? (
                  missingSkills.map((skill) => (
                    <span className="gap-missing" key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>You have all the listed skills for this role!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {candidateSkills.length > 0 && (
        <div className="learning-roadmap">
          <div className="roadmap-heading">
            <div>
              <h2>Your Personalized Learning Roadmap</h2>
              <p>
                Follow these steps to work towards your selected career.
              </p>
            </div>
            <span className="roadmap-role">{selectedRole}</span>
          </div>

          {missingSkills.length === 0 ? (
            <div className="roadmap-complete">
              <h3>Great work!</h3>
              <p>
                You have matched all the skills in this role's checklist.
                Continue practising and building projects to strengthen them.
              </p>
            </div>
          ) : (
            <>
              <div className="learning-progress">
                <div className="progress-label">
                  <strong>Learning progress</strong>
                  <strong>{learningProgress}%</strong>
                </div>
                <div className="coverage-track">
                  <div
                    className="coverage-fill"
                    style={{ width: `${learningProgress}%` }}
                  />
                </div>
                <p>
                  {completedCount} of {roadmapTasks.length} learning steps completed
                </p>
              </div>

              {missingSkills.map((skill, skillIndex) => {
                const roadmap = learningRoadmaps[skill] || defaultRoadmap;
                const skillTasks = roadmap.steps.map((step, index) => ({
                  id: `${selectedRole}-${skill}-${index}`,
                  step
                }));

                const skillCompleted = skillTasks.filter(
                  (task) => completedSteps[task.id]
                ).length;

                return (
                  <div className="roadmap-skill-card" key={skill}>
                    <div className="roadmap-skill-header">
                      <div>
                        <span className="roadmap-step-label">
                          SKILL {skillIndex + 1}
                        </span>
                        <h3>{skill}</h3>
                      </div>
                      <span className="roadmap-count">
                        {skillCompleted}/{skillTasks.length} completed
                      </span>
                    </div>

                    <div className="roadmap-task-list">
                      {skillTasks.map((task, index) => (
                        <label
                          className={`roadmap-task ${
                            completedSteps[task.id] ? "completed" : ""
                          }`}
                          key={task.id}
                        >
                          <input
                            type="checkbox"
                            checked={!!completedSteps[task.id]}
                            onChange={() => toggleStep(task.id)}
                          />
                          <span className="roadmap-task-number">
                            {index + 1}
                          </span>
                          <span className="roadmap-task-text">
                            {task.step}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="roadmap-project">
                      <strong> <span>Practice project:</span> </strong>
                      <p>{roadmap.project}</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <p className="roadmap-disclaimer">
            This roadmap is a suggested learning sequence based on your
            missing skills. Completion tracking is stored in the current
            page session and may reset when the page is refreshed.
          </p>
        </div>
      )}
    </div>
  );
}


