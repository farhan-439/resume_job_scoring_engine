from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
from typing import List
from app.scoring import extract_skills, calculate_match_score, get_company_modifier

app = FastAPI(title="Resume Job Scoring Engine", version="1.0.0")

# Request models
class JobResumeRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str = "unknown"
    
    @validator('resume_text', 'job_description')
    def text_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Text fields cannot be empty')
        return v.strip()

# Response models  
class ScoringResponse(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    company_modifier: int
    final_score: int

@app.get("/")
def root():
    return {"message": "Resume Job Scoring Engine API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/score", response_model=ScoringResponse)
def score_resume_job_match(request: JobResumeRequest):
    try:
        # Basic validation
        if len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short (minimum 50 characters)")
        
        if len(request.job_description) < 30:
            raise HTTPException(status_code=400, detail="Job description too short (minimum 30 characters)")
        
        # Extract skills from resume and job description
        resume_skills = extract_skills(request.resume_text)
        job_skills = extract_skills(request.job_description)
        
        # Calculate match score
        match_score, matched_skills, missing_skills = calculate_match_score(resume_skills, job_skills)
        
        # Apply company modifier
        company_modifier = get_company_modifier(request.company_name)
        final_score = max(0, min(100, match_score + company_modifier))
        
        return ScoringResponse(
            match_score=match_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            company_modifier=company_modifier,
            final_score=final_score
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")