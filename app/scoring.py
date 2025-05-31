import spacy
import re
from typing import List, Tuple, Set

# Load spacy model (you'll need to download: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except IOError:
    print("Please install spacy model: python -m spacy download en_core_web_sm")
    nlp = None

# Common tech skills for pattern matching
TECH_SKILLS = {
    'python', 'javascript', 'java', 'react', 'node.js', 'django', 'flask', 
    'fastapi', 'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 
    'aws', 'azure', 'gcp', 'git', 'api', 'rest', 'graphql', 'machine learning',
    'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch'
}

def extract_skills(text: str) -> Set[str]:
    """Extract skills from text using NLP and pattern matching"""
    skills = set()
    text_lower = text.lower()
    
    # Pattern matching for tech skills
    for skill in TECH_SKILLS:
        if skill in text_lower:
            skills.add(skill.title())
    
    # Use spacy for additional entity extraction if available
    if nlp:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT"] and len(ent.text) > 2:
                skills.add(ent.text)
    
    return skills

def calculate_match_score(resume_skills: Set[str], job_skills: Set[str]) -> Tuple[int, List[str], List[str]]:
    """Calculate match score and return matched/missing skills"""
    if not job_skills:
        return 0, [], []
    
    matched = list(resume_skills.intersection(job_skills))
    missing = list(job_skills - resume_skills)
    
    # Calculate base score (percentage of job skills found in resume)
    match_score = int((len(matched) / len(job_skills)) * 100)
    
    return match_score, matched, missing

def get_company_modifier(company_name: str) -> int:
    """Return company reputation modifier"""
    company_lower = company_name.lower()
    
    # Big tech companies (harder to get in)
    if any(big_tech in company_lower for big_tech in ['meta', 'google', 'amazon', 'apple', 'microsoft', 'netflix']):
        return -15
    
    # Startups (easier/more flexible)
    if any(startup in company_lower for startup in ['startup', 'early-stage', 'seed']):
        return +10
    
    # Default
    return 0