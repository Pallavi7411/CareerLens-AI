from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import re
import csv
from pathlib import Path



app = FastAPI(
    title="CareerLens AI API",
    description="AI-powered Resume Analysis and Job Recommendation System",
    version="1.0.0"
)

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



SKILL_LIST = [
    "Python", "Java", "C++", "C", "JavaScript", "TypeScript",
    "React", "Node.js", "Express", "FastAPI", "Django", "Flask",
    "HTML", "CSS", "SQL", "PostgreSQL", "MySQL", "MongoDB",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
    "Git", "GitHub", "Linux", "Machine Learning", "Deep Learning",
    "NLP", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas",
    "NumPy", "Power BI", "Tableau", "Excel", "REST API",
    "Data Structures", "Algorithms", "Data Analysis"
]

SECTION_KEYWORDS = {
    "education": ["education", "academic background"],
    "skills": ["skills", "technical skills", "technical expertise"],
    "projects": ["projects", "personal projects", "academic projects"],
    "experience": ["experience", "work experience", "internship"],
    "certifications": ["certifications", "certificates"],
    "achievements": ["achievements", "awards", "accomplishments"]
}


def extract_text_from_pdf(content):
    text = ""

    with pymupdf.open(stream=content, filetype="pdf") as pdf:
        for page in pdf:
            text += page.get_text() + "\n"

    return text


def extract_text_from_docx(content):
    document = Document(BytesIO(content))

    paragraphs = [
        paragraph.text for paragraph in document.paragraphs
    ]

    # Also read text inside tables
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                paragraphs.append(cell.text)

    return "\n".join(paragraphs)


def find_email(text):
    match = re.search(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text
    )
    return match.group(0) if match else "Not found"


def find_candidate_name(text):
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    for line in lines[:8]:
        cleaned = re.sub(r"\s+", " ", line).strip()

        if (
            len(cleaned) <= 50
            and re.fullmatch(r"[A-Za-z][A-Za-z .'-]+", cleaned)
            and not any(
                word in cleaned.lower()
                for word in [
                    "resume", "curriculum vitae", "email",
                    "phone", "mobile", "linkedin"
                ]
            )
        ):
            return cleaned

    return "Not identified"


def extract_skills(text):
    found_skills = []

    for skill in SKILL_LIST:
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


def analyze_resume(text, skills, email):
    lower_text = text.lower()

    found_sections = []

    for section, keywords in SECTION_KEYWORDS.items():
        if any(keyword in lower_text for keyword in keywords):
            found_sections.append(section)

    score = 0
    strengths = []
    improvements = []

    # Contact information: 15 points
    if email != "Not found":
        score += 15
        strengths.append("Email address is included.")
    else:
        improvements.append("Add a professional email address.")

    # Education: 15 points
    if "education" in found_sections:
        score += 15
        strengths.append("Education details are included.")
    else:
        improvements.append("Add a clearly labeled Education section.")

    # Skills: 20 points
    if len(skills) >= 5:
        score += 20
        strengths.append("Good range of technical skills identified.")
    elif len(skills) >= 1:
        score += 10
        strengths.append("Some technical skills are identified.")
        improvements.append("Include more relevant technical skills.")
    else:
        improvements.append("Add a dedicated technical skills section.")

    # Projects and experience: 25 points
    has_projects = "projects" in found_sections
    has_experience = "experience" in found_sections

    if has_projects and has_experience:
        score += 25
        strengths.append("Both projects and experience are included.")
    elif has_projects or has_experience:
        score += 15
        strengths.append("Projects or experience details are included.")
        improvements.append(
            "Include both relevant projects and experience where applicable."
        )
    else:
        improvements.append(
            "Add relevant academic projects, internships or work experience."
        )

    # Certifications: 10 points
    if "certifications" in found_sections:
        score += 10
        strengths.append("Certifications section is included.")
    else:
        improvements.append(
            "Include relevant certifications if you have them."
        )

    # Achievements: 10 points
    if "achievements" in found_sections:
        score += 10
        strengths.append("Achievements section is included.")
    else:
        improvements.append(
            "Highlight relevant achievements, awards or accomplishments."
        )

    # Resume content length: 5 points
    word_count = len(text.split())

    if word_count >= 150:
        score += 5
        strengths.append("Resume contains a reasonable amount of text.")
    else:
        improvements.append(
            "Add more relevant details to make your resume informative."
        )

    if not improvements:
        improvements.append(
            "Continue tailoring your resume to each job description."
        )

    if not strengths:
        strengths.append(
            "Resume text was extracted successfully. Consider adding "
            "more clearly labeled sections."
        )

    return {
        "resume_score": score,
        "candidate_name": find_candidate_name(text),
        "email": email,
        "skills": skills,
        "strengths": strengths,
        "improvements": improvements
    }


@app.get("/")
def home():
    return {
        "message": "Welcome to CareerLens AI API",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}




@app.post("/analyze-text")
async def analyze_text_endpoint(
    resume_text: str = Form(...)
):
    # Validate pasted resume text
    resume_text = resume_text.strip()

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Please paste your resume text."
        )

    if len(resume_text) > 50000:
        raise HTTPException(
            status_code=400,
            detail="Resume text must not exceed 50,000 characters."
        )

    # Reuse the existing analysis functions
    email = find_email(resume_text)
    skills = extract_skills(resume_text)

    result = analyze_resume(
        resume_text,
        skills,
        email
    )

    return result


# Job dataset location
JOBS_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "jobs.csv"
)


@app.post("/recommend-jobs")
async def recommend_jobs(skills: str = Form(...)):

    # Convert submitted skills into a set
    candidate_skills = {
        skill.strip().casefold()
        for skill in skills.split(",")
        if skill.strip()
    }

    if not candidate_skills:
        raise HTTPException(
            status_code=400,
            detail="Please provide candidate skills."
        )

    if not JOBS_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="Job dataset not found. Check the data/jobs.csv file."
        )

    recommendations = []

    try:
        with open(
            JOBS_FILE,
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

                required_set = {
                    skill.casefold()
                    for skill in required_skills
                }

                matched = [
                    skill for skill in required_skills
                    if skill.casefold() in candidate_skills
                ]

                missing = [
                    skill for skill in required_skills
                    if skill.casefold() not in candidate_skills
                ]

                match_percentage = round(
                    (len(matched) / len(required_skills)) * 100
                ) if required_skills else 0

                recommendations.append({
                    "job_id": job["job_id"],
                    "title": job["title"],
                    "company": job["company"],
                    "location": job["location"],
                    "job_type": job["job_type"],
                    "experience_level": job["experience_level"],
                    "required_skills": required_skills,
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "match_percentage": match_percentage,
                    "description": job["description"],
                    "listing_type": "Sample listing"
                })

    except (OSError, KeyError) as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to read job dataset: {error}"
        )

    recommendations.sort(
        key=lambda job: job["match_percentage"],
        reverse=True
    )

    return {
        "candidate_skills": sorted(candidate_skills),
        "total_jobs_analyzed": len(recommendations),
        "recommendations": recommendations
    }



@app.get("/debug-jobs")
def debug_jobs():
    return {
        "main_file": str(Path(__file__).resolve()),
        "jobs_file": str(JOBS_FILE.resolve()),
        "file_exists": JOBS_FILE.exists(),
        "current_directory": str(Path.cwd())
    }
