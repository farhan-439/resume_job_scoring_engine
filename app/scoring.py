import spacy
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple, Set, Dict
import numpy as np

# Load models
try:
    nlp = spacy.load("en_core_web_sm")
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Model loading error: {e}")
    nlp = None
    sentence_model = None

# Enhanced skill categories with weights
SKILL_CATEGORIES = {
    'programming_languages': {
        'skills': ['python', 'javascript', 'java', 'c++', 'c#', 'go', 'rust', 'typescript'],
        'weight': 0.3
    },
    'frameworks_libraries': {
        'skills': ['react', 'django', 'flask', 'fastapi', 'node.js', 'express', 'spring', 'angular'],
        'weight': 0.25
    },
    'databases': {
        'skills': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sql', 'nosql'],
        'weight': 0.2
    },
    'cloud_devops': {
        'skills': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ci/cd'],
        'weight': 0.15
    },
    'soft_skills': {
        'skills': ['leadership', 'communication', 'teamwork', 'problem solving', 'project management'],
        'weight': 0.1
    }
}

# Experience level patterns
EXPERIENCE_PATTERNS = {
    r'(\d+)\+?\s*years?\s+(?:of\s+)?experience': 'years_experience',
    r'senior|lead|principal|staff': 'senior_level',
    r'junior|entry.level|graduate|intern': 'junior_level', 
    r'mid.level|intermediate': 'mid_level'
}

def extract_experience_level(text: str) -> Dict[str, any]:
    """Extract experience level information"""
    text_lower = text.lower()
    experience_data = {
        'years': 0,
        'level': 'unknown',
        'leadership_keywords': 0
    }
    
    # Extract years of experience
    for pattern, _ in EXPERIENCE_PATTERNS.items():
        matches = re.findall(pattern, text_lower)
        if matches and pattern.startswith(r'(\d+)'):
            try:
                experience_data['years'] = max([int(m) for m in matches])
            except:
                pass
    
    # Extract seniority level
    if any(keyword in text_lower for keyword in ['senior', 'lead', 'principal', 'staff']):
        experience_data['level'] = 'senior'
    elif any(keyword in text_lower for keyword in ['junior', 'entry', 'graduate', 'intern']):
        experience_data['level'] = 'junior'
    elif any(keyword in text_lower for keyword in ['mid', 'intermediate']):
        experience_data['level'] = 'mid'
    
    # Count leadership indicators
    leadership_keywords = ['manage', 'lead', 'mentor', 'coordinate', 'oversee', 'direct']
    experience_data['leadership_keywords'] = sum(1 for kw in leadership_keywords if kw in text_lower)
    
    return experience_data

def extract_enhanced_skills(text: str) -> Dict[str, any]:
    """Enhanced skill extraction with categories and context"""
    skills_by_category = {}
    text_lower = text.lower()
    
    for category, data in SKILL_CATEGORIES.items():
        found_skills = []
        for skill in data['skills']:
            if skill in text_lower:
                # Try to extract context (years of experience with this skill)
                skill_context = extract_skill_context(text_lower, skill)
                found_skills.append({
                    'skill': skill.title(),
                    'context': skill_context
                })
        
        skills_by_category[category] = {
            'skills': found_skills,
            'weight': data['weight'],
            'count': len(found_skills)
        }
    
    return skills_by_category

def extract_skill_context(text: str, skill: str) -> Dict[str, any]:
    """Extract context around a skill (years of experience, proficiency level)"""
    context = {'years': 0, 'proficiency': 'unknown'}
    
    # Look for years of experience with this specific skill
    patterns = [
        rf'(\d+)\+?\s*years?\s+(?:of\s+)?{skill}',
        rf'{skill}.*?(\d+)\+?\s*years?',
        rf'(\d+)\+?\s*years?.*?{skill}'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text)
        if matches:
            try:
                context['years'] = max([int(m) for m in matches])
                break
            except:
                pass
    
    # Look for proficiency indicators
    if any(word in text for word in ['expert', 'advanced', 'proficient']):
        context['proficiency'] = 'advanced'
    elif any(word in text for word in ['experienced', 'skilled']):
        context['proficiency'] = 'intermediate'
    elif any(word in text for word in ['basic', 'familiar', 'exposure']):
        context['proficiency'] = 'basic'
    
    return context

def calculate_semantic_similarity(resume_text: str, job_text: str) -> float:
    """Calculate semantic similarity between resume and job description"""
    if not sentence_model:
        return 0.0
    
    try:
        # Create embeddings
        resume_embedding = sentence_model.encode([resume_text])
        job_embedding = sentence_model.encode([job_text])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        return float(similarity)
    except:
        return 0.0