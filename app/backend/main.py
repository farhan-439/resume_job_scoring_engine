from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
from typing import List, Dict, Union, Any
from app.scoring import calculate_advanced_score

app = FastAPI(title="Resume Job Scoring Engine", version="2.0.0")

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

# Enhanced response model - fixed the 'any' type issue
class AdvancedScoringResponse(BaseModel):
    overall_score: int
    semantic_similarity: float
    skills_breakdown: Dict[str, Dict[str, Union[int, float, List[str]]]]
    experience_match: Dict[str, Union[int, str]]
    company_modifier: int
    final_score: int
    explanation: str
    
    class Config:
        arbitrary_types_allowed = True

@app.get("/")
def root():
    return {"message": "Advanced Resume Job Scoring Engine API v2.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/score", response_model=AdvancedScoringResponse)
def score_resume_job_match(request: JobResumeRequest):
    try:
        if len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short (minimum 50 characters)")
        
        if len(request.job_description) < 30:
            raise HTTPException(status_code=400, detail="Job description too short (minimum 30 characters)")
        
        result = calculate_advanced_score(
            request.resume_text, 
            request.job_description, 
            request.company_name
        )
        
        return AdvancedScoringResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")