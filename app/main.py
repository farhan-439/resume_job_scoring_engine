from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
from typing import List

app = FastAPI(title="Resume Job Scoring Engine", version="1.0.0")

# Request models
class JobResumeRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str = "unknown"

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
    # Placeholder logic - we'll implement this next
    return ScoringResponse(
        match_score=75,
        matched_skills=["Python", "API Development"],
        missing_skills=["Docker", "AWS"],
        company_modifier=-5,
        final_score=70
    )

# Add this validator to JobResumeRequest class
class JobResumeRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str = "unknown"
    
    @validator('resume_text', 'job_description')
    def text_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Text fields cannot be empty')
        return v.strip()

# Update the scoring endpoint
@app.post("/score", response_model=ScoringResponse)
def score_resume_job_match(request: JobResumeRequest):
    try:
        # Basic validation
        if len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short (minimum 50 characters)")
        
        if len(request.job_description) < 30:
            raise HTTPException(status_code=400, detail="Job description too short (minimum 30 characters)")
        
        # Placeholder logic - we'll implement this next
        return ScoringResponse(
            match_score=75,
            matched_skills=["Python", "API Development"],
            missing_skills=["Docker", "AWS"],
            company_modifier=-5,
            final_score=70
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")