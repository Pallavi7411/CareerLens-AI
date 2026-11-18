
import streamlit as st
import csv
from pathlib import Path
import main

# --------------------------------------------------
# PAGE CONFIGURATION
# --------------------------------------------------

st.set_page_config(
    page_title="CareerLens AI",
    page_icon="🎯",
    layout="wide"
)

# --------------------------------------------------
# STYLING
# --------------------------------------------------

st.markdown("""
<style>
    .main {
        background-color: #f7f8fc;
    }
    .block-container {
        padding-top: 2rem;
    }
    .hero {
        padding: 25px;
        border-radius: 15px;
        background: linear-gradient(120deg, #182848, #4b6cb7);
        color: white;
        margin-bottom: 25px;
    }
    .hero h1 {
        color: white;
    }
    .result-card {
        background: white;
        padding: 18px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)

# --------------------------------------------------
# SESSION STATE
# --------------------------------------------------

if "resume_result" not in st.session_state:
    st.session_state.resume_result = None

if "resume_text" not in st.session_state:
    st.session_state.resume_text = ""

if "recommendations" not in st.session_state:
    st.session_state.recommendations = None

# --------------------------------------------------
# SIDEBAR NAVIGATION
# --------------------------------------------------

st.sidebar.title("🎯 CareerLens AI")
st.sidebar.caption("AI Resume Analyzer & Job Recommendation System")

page = st.sidebar.radio(
    "Navigation",
    [
        "Dashboard",
        "Resume Analyzer",
        "Job Recommendations",
        "Skill Gap Analysis",
        "My Profile"
    ]
)

st.sidebar.divider()
st.sidebar.info("Build your career with smarter insights.")

# --------------------------------------------------
# DASHBOARD
# --------------------------------------------------

if page == "Dashboard":

    st.markdown("""
    <div class="hero">
        <h1>Welcome to CareerLens AI</h1>
        <p>Your AI-powered career and resume assistant.</p>
        <p>Analyze your resume, discover your skills and explore
        suitable job opportunities.</p>
    </div>
    """, unsafe_allow_html=True)

    st.subheader("What can you do?")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("### 📄 Resume Analysis")
        st.write(
            "Evaluate your resume and identify your technical "
            "skills, strengths and areas for improvement."
        )

        st.markdown("### 💼 Job Recommendations")
        st.write(
            "Find suitable sample job listings based on your "
            "detected skills."
        )

    with col2:
        st.markdown("### 📊 Skill Gap Analysis")
        st.write(
            "Compare your skills with job requirements and "
            "identify skills you may need to develop."
        )

        st.markdown("### 👤 My Profile")
        st.write(
            "View your latest resume analysis and detected skills."
        )

    if st.session_state.resume_result:
        st.success("Your resume has been analyzed. Visit My Profile to view your results.")
    else:
        st.info("Start by opening Resume Analyzer and pasting your resume text.")

# --------------------------------------------------
# RESUME ANALYZER
# --------------------------------------------------

elif page == "Resume Analyzer":

    st.title("📄 Resume Analyzer")
    st.write("Paste your resume text below to analyze it.")

    resume_text = st.text_area(
        "Resume Content",
        value=st.session_state.resume_text,
        height=300,
        max_chars=50000,
        placeholder="Paste your complete resume text here..."
    )

    if st.button("Analyze Resume", type="primary"):

        if not resume_text.strip():
            st.warning("Please paste your resume text first.")

        else:
            with st.spinner("Analyzing your resume..."):

                email = main.find_email(resume_text)
                skills = main.extract_skills(resume_text)

                result = main.analyze_resume(
                    resume_text,
                    skills,
                    email
                )

                st.session_state.resume_result = result
                st.session_state.resume_text = resume_text
                st.session_state.recommendations = None

            st.success("Resume analysis completed successfully!")

    result = st.session_state.resume_result

    if result:

        st.divider()
        st.subheader("Resume Analysis Results")

        col1, col2, col3 = st.columns(3)

        col1.metric("Resume Score", f"{result['resume_score']}/100")
        col2.metric("Skills Identified", len(result["skills"]))
        col3.metric("Email", result["email"])

        st.progress(result["resume_score"] / 100)

        st.subheader("Candidate Information")
        st.write("**Name:**", result["candidate_name"])
        st.write("**Email:**", result["email"])

        st.subheader("Technical Skills")

        if result["skills"]:
            st.write(", ".join(result["skills"]))
        else:
            st.warning("No recognized technical skills were found.")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("✅ Strengths")
            for item in result["strengths"]:
                st.write("•", item)

        with col2:
            st.subheader("💡 Areas to Improve")
            for item in result["improvements"]:
                st.write("•", item)

# --------------------------------------------------
# JOB RECOMMENDATIONS
# --------------------------------------------------

elif page == "Job Recommendations":

    st.title("💼 Job Recommendations")
    st.write("Discover job matches based on your resume skills.")

    result = st.session_state.resume_result

    if not result:
        st.info("Please analyze your resume first.")
    else:

        skills = result["skills"]

        st.write("**Your detected skills:**")
        st.write(", ".join(skills) if skills else "No skills detected.")

        if st.button("Find Matching Jobs", type="primary"):

            if not skills:
                st.warning("No skills are available for matching.")
            else:
                jobs_file = (
                    Path(__file__).resolve().parent.parent
                    / "data"
                    / "jobs.csv"
                )

                recommendations = []

                try:
                    with open(
                        jobs_file,
                        mode="r",
                        encoding="utf-8-sig",
                        newline=""
                    ) as csvfile:

                        reader = csv.DictReader(csvfile)

                        for job in reader:

                            if not job.get("job_id") or not job.get("required_skills"):
                                continue

                            required_skills = [
                                skill.strip()
                                for skill in job["required_skills"].split(",")
                                if skill.strip()
                            ]

                            candidate_set = {
                                skill.casefold() for skill in skills
                            }

                            matched = [
                                skill for skill in required_skills
                                if skill.casefold() in candidate_set
                            ]

                            missing = [
                                skill for skill in required_skills
                                if skill.casefold() not in candidate_set
                            ]

                            percentage = round(
                                len(matched) / len(required_skills) * 100
                            ) if required_skills else 0

                            recommendations.append({
                                "title": job["title"],
                                "company": job["company"],
                                "location": job["location"],
                                "job_type": job["job_type"],
                                "experience_level": job["experience_level"],
                                "matched_skills": matched,
                                "missing_skills": missing,
                                "match_percentage": percentage,
                                "description": job["description"]
                            })

                    recommendations.sort(
                        key=lambda x: x["match_percentage"],
                        reverse=True
                    )

                    st.session_state.recommendations = recommendations

                except (OSError, KeyError) as error:
                    st.error(f"Unable to load job dataset: {error}")

        recommendations = st.session_state.recommendations

        if recommendations is not None:

            st.divider()
            st.subheader("Recommended Jobs")

            st.caption(
                "These are sample listings from the project's local dataset, "
                "not verified live vacancies."
            )

            st.write(
                f"**Total jobs analyzed:** {len(recommendations)}"
            )

            if not recommendations:
                st.warning("No job listings were found.")
            else:
                for job in recommendations:

                    with st.container(border=True):

                        st.subheader(job["title"])
                        st.write(
                            f"**Company:** {job['company']}  |  "
                            f"**Location:** {job['location']}"
                        )

                        st.write(
                            f"**Job type:** {job['job_type']}  |  "
                            f"**Experience:** {job['experience_level']}"
                        )

                        st.metric(
                            "Skill Match",
                            f"{job['match_percentage']}%"
                        )

                        st.progress(job["match_percentage"] / 100)

                        st.write("**Matched skills:**")
                        st.write(
                            ", ".join(job["matched_skills"])
                            if job["matched_skills"] else "None"
                        )

                        st.write("**Skills to develop:**")
                        st.write(
                            ", ".join(job["missing_skills"])
                            if job["missing_skills"] else "No missing skills"
                        )

                        st.write(job["description"])

# --------------------------------------------------
# SKILL GAP ANALYSIS
# --------------------------------------------------

elif page == "Skill Gap Analysis":

    st.title("📊 Skill Gap Analysis")

    result = st.session_state.resume_result
    recommendations = st.session_state.recommendations

    if not result:
        st.info("Please analyze your resume first.")

    elif recommendations is None:
        st.info("Please find matching jobs first to compare your skills.")

    elif not recommendations:
        st.warning("No job listings are available for comparison.")

    else:
        job_titles = [
            f"{job['title']} - {job['company']}"
            for job in recommendations
        ]

        selected = st.selectbox(
            "Select a job to compare your skills",
            range(len(job_titles)),
            format_func=lambda x: job_titles[x]
        )

        job = recommendations[selected]

        st.subheader(job["title"])
        st.metric("Your Skill Match", f"{job['match_percentage']}%")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("✅ Skills You Have")
            for skill in job["matched_skills"]:
                st.write("•", skill)

        with col2:
            st.subheader("📚 Skills to Learn")
            for skill in job["missing_skills"]:
                st.write("•", skill)

        if not job["missing_skills"]:
            st.success("You have all the skills listed for this job!")
        else:
            st.info(
                "Consider learning the missing skills to improve "
                "your alignment with this job."
            )

# --------------------------------------------------
# MY PROFILE
# --------------------------------------------------

elif page == "My Profile":

    st.title("👤 My Profile")

    result = st.session_state.resume_result

    if not result:
        st.info("Analyze your resume to create your profile.")
    else:

        st.subheader(
            result["candidate_name"]
            if result["candidate_name"] != "Not identified"
            else "Candidate Profile"
        )

        st.write("**Email:**", result["email"])

        col1, col2 = st.columns(2)

        col1.metric("Resume Score", f"{result['resume_score']}/100")
        col2.metric("Technical Skills", len(result["skills"]))

        st.subheader("My Skills")

        if result["skills"]:
            st.write(", ".join(result["skills"]))
        else:
            st.write("No technical skills identified.")

        st.subheader("Resume Strengths")

        for item in result["strengths"]:
            st.write("•", item)

        st.subheader("Areas to Improve")

        for item in result["improvements"]:
            st.write("•", item)

# --------------------------------------------------
# FOOTER
# --------------------------------------------------

st.divider()

st.caption(
    "CareerLens AI | AI-Powered Resume Analysis and "
    "Job Recommendation System"
)
