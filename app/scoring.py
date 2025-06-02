import spacy
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple, Set, Dict
import numpy as np

# Skill standardization dictionary - maps aliases to canonical forms
SKILL_ALIASES = {
    # Programming languages
    'js': 'javascript',
    'ts': 'typescript', 
    'py': 'python',
    'cpp': 'c++',
    'csharp': 'c#',
    'golang': 'go',
    
    # Frameworks & libraries
    'reactjs': 'react',
    'vue.js': 'vue',
    'vuejs': 'vue',
    'nodejs': 'node.js',
    'express.js': 'express',
    'next.js': 'nextjs',
    'nuxt.js': 'nuxtjs',
    
    # Databases
    'postgres': 'postgresql',
    'pg': 'postgresql',
    'mysql': 'mysql',
    'mongo': 'mongodb',
    'elastic': 'elasticsearch',
    
    # Cloud & DevOps
    'k8s': 'kubernetes',
    'docker': 'docker',
    'aws': 'amazon web services',
    'gcp': 'google cloud platform',
    'azure': 'microsoft azure',
    'ci/cd': 'continuous integration',
    
    # AI/ML
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'dl': 'deep learning',
    'nlp': 'natural language processing',
    'cv': 'computer vision',
    
    # General tech
    'api': 'application programming interface',
    'rest': 'representational state transfer',
    'graphql': 'graph query language',
    'orm': 'object relational mapping'
}

# Compound skill patterns - multi-word technical terms
COMPOUND_SKILLS = [
    'machine learning', 'artificial intelligence', 'deep learning', 'computer vision',
    'natural language processing', 'data science', 'data analysis', 'web development',
    'full stack', 'front end', 'back end', 'software engineering', 'devops engineer',
    'cloud computing', 'distributed systems', 'microservices architecture',
    'continuous integration', 'continuous deployment', 'test driven development',
    'agile methodology', 'scrum master', 'product management', 'project management',
    'team leadership', 'cross functional', 'problem solving'
]

def normalize_skill(skill: str) -> str:
    """Normalize skill to canonical form"""
    skill_lower = skill.lower().strip()
    
    # Check for direct alias match
    if skill_lower in SKILL_ALIASES:
        return SKILL_ALIASES[skill_lower]
    
    # Check for compound skills
    for compound in COMPOUND_SKILLS:
        if compound in skill_lower:
            return compound.title()
    
    # Return original skill in title case
    return skill.title()

def extract_compound_skills(text: str) -> Set[str]:
    """Extract compound/multi-word skills from text"""
    found_compounds = set()
    text_lower = text.lower()
    
    for compound in COMPOUND_SKILLS:
        if compound in text_lower:
            found_compounds.add(compound.title())
    
    return found_compounds

def extract_enhanced_skills_v2(text: str) -> Dict[str, any]:
    """Enhanced skill extraction with normalization and compound detection"""
    skills_by_category = {}
    text_lower = text.lower()
    
    # First, extract compound skills
    compound_skills = extract_compound_skills(text)
    
    for category, data in SKILL_CATEGORIES.items():
        found_skills = []
        
        # Check for single-word skills
        for skill in data['skills']:
            normalized_skill = normalize_skill(skill)
            
            # Check original skill name
            if skill in text_lower:
                skill_context = extract_skill_context(text_lower, skill)
                found_skills.append({
                    'skill': normalized_skill,
                    'context': skill_context,
                    'matched_as': skill
                })
            
            # Check normalized version
            elif normalized_skill.lower() in text_lower:
                skill_context = extract_skill_context(text_lower, normalized_skill.lower())
                found_skills.append({
                    'skill': normalized_skill,
                    'context': skill_context,
                    'matched_as': normalized_skill
                })
        
        # Add relevant compound skills to appropriate categories
        category_compounds = []
        if category == 'programming_languages':
            category_compounds = [s for s in compound_skills if any(lang in s.lower() for lang in ['programming', 'development'])]
        elif category == 'soft_skills':
            category_compounds = [s for s in compound_skills if any(soft in s.lower() for soft in ['leadership', 'management', 'communication', 'problem', 'team'])]
        elif category == 'cloud_devops':
            category_compounds = [s for s in compound_skills if any(cloud in s.lower() for cloud in ['cloud', 'devops', 'continuous', 'distributed'])]
        elif category == 'frameworks_libraries':
            category_compounds = [s for s in compound_skills if any(fw in s.lower() for fw in ['web', 'full', 'front', 'back'])]
        
        for compound in category_compounds:
            skill_context = extract_skill_context(text_lower, compound.lower())
            found_skills.append({
                'skill': compound,
                'context': skill_context,
                'matched_as': 'compound'
            })
        
        # Remove duplicates based on skill name
        unique_skills = {}
        for skill_data in found_skills:
            skill_name = skill_data['skill']
            if skill_name not in unique_skills:
                unique_skills[skill_name] = skill_data
        
        skills_by_category[category] = {
            'skills': list(unique_skills.values()),
            'weight': data['weight'],
            'count': len(unique_skills)
        }
    
    return skills_by_category


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

def calculate_advanced_score(resume_text: str, job_text: str, company_name: str) -> Dict:
    """Calculate comprehensive multi-dimensional score"""
    
    # 1. Extract data from both texts
    resume_skills = extract_enhanced_skills_v2(resume_text)
    job_skills = extract_enhanced_skills_v2(job_text)
    resume_exp = extract_experience_level(resume_text)
    job_exp = extract_experience_level(job_text)
    
    # 2. Calculate semantic similarity with confidence (0-1 scale)
    semantic_score, confidence = calculate_semantic_similarity_with_confidence(resume_text, job_text)

    # Apply confidence weighting to semantic score
    confidence_weighted_semantic = semantic_score * confidence
    
    # 3. Calculate weighted skills score
    skills_score = 0
    skills_breakdown = {}
    
    for category in resume_skills.keys():
        resume_count = resume_skills[category]['count']
        job_count = job_skills[category]['count']
        weight = resume_skills[category]['weight']
        
        if job_count > 0:
            category_score = min(100, (resume_count / job_count) * 100)
        else:
            category_score = 100 if resume_count > 0 else 0
            
        skills_score += category_score * weight
        skills_breakdown[category] = {
            'resume_skills': resume_count,
            'job_requirements': job_count,
            'score': round(category_score, 1),
            'weight': weight
        }
    
    # 4. Experience level matching
    exp_bonus = 0
    if resume_exp['level'] == job_exp['level']:
        exp_bonus = 10
    elif (resume_exp['level'] == 'senior' and job_exp['level'] in ['mid', 'junior']):
        exp_bonus = 5
    
    # Years experience bonus/penalty
    years_diff = resume_exp['years'] - job_exp['years']
    if years_diff >= 0:
        exp_bonus += min(10, years_diff * 2)
    else:
        exp_bonus += max(-15, years_diff * 3)
    
# 5. Combine all scores (with confidence weighting)
    base_score = int((skills_score * 0.6) + (confidence_weighted_semantic * 100 * 0.4))
    overall_score = min(100, max(0, base_score + exp_bonus))
    
    # 6. Apply company modifier
    company_mod = get_company_modifier(company_name)
    final_score = min(100, max(0, overall_score + company_mod))
    
    # 7. Generate explanation
    explanation = f"Skills match: {skills_score:.1f}%, Semantic similarity: {semantic_score*100:.1f}% (confidence: {confidence:.2f}), Experience bonus: {exp_bonus}, Company modifier: {company_mod}"
    
    return {
        'overall_score': overall_score,
        'semantic_similarity': round(semantic_score, 3),
        'skills_breakdown': skills_breakdown,
        'experience_match': {
            'resume_years': resume_exp['years'],
            'resume_level': resume_exp['level'],
            'job_years': job_exp['years'],
            'job_level': job_exp['level'],
            'experience_bonus': exp_bonus
        },
        'company_modifier': company_mod,
        'final_score': final_score,
        'explanation': explanation
    }

# Load models
try:
    nlp = spacy.load("en_core_web_sm")
    # Upgrade to better model
    sentence_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
    print("✅ Loaded all-mpnet-base-v2 (better than MiniLM)")
except Exception as e:
    print(f"Model loading error: {e}")
    try:
        # Fallback to current model
        sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("⚠️ Fallback to MiniLM model")
    except:
        sentence_model = None
        nlp = None


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

def calculate_semantic_similarity_with_confidence(resume_text: str, job_text: str) -> Tuple[float, float]:
    """Calculate semantic similarity with confidence score"""
    if not sentence_model:
        return 0.0, 0.0
    
    try:
        # Create embeddings
        resume_embedding = sentence_model.encode([resume_text])
        job_embedding = sentence_model.encode([job_text])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        
        # Calculate confidence based on text quality and length
        confidence = calculate_confidence_score(resume_text, job_text)
        
        return float(similarity), float(confidence)
    except:
        return 0.0, 0.0

def calculate_confidence_score(resume_text: str, job_text: str) -> float:
    """Calculate confidence score for semantic similarity"""
    # Text length factor (longer texts generally give more reliable embeddings)
    resume_length_factor = min(len(resume_text.split()) / 100, 1.0)  # Normalize to 100 words
    job_length_factor = min(len(job_text.split()) / 50, 1.0)        # Normalize to 50 words
    
    # Text quality factor (professional terms, proper grammar indicators)
    professional_terms = ['experience', 'skills', 'responsible', 'developed', 'managed', 'led', 'implemented']
    resume_quality = sum(1 for term in professional_terms if term in resume_text.lower()) / len(professional_terms)
    job_quality = sum(1 for term in professional_terms if term in job_text.lower()) / len(professional_terms)
    
    # Combined confidence score
    confidence = (resume_length_factor * 0.3 + 
                 job_length_factor * 0.3 + 
                 resume_quality * 0.2 + 
                 job_quality * 0.2)
    
    return min(confidence, 1.0)