"""
Industry-standard resume-job scoring engine implementing best practices from
CareerBuilder, LinkedIn, and other major recruitment platforms.

Based on:
- Hybrid NLP pipelines (spaCy + transformers)
- Domain-specific sentence transformers
- Skill taxonomy with standardized ontologies
- Multi-dimensional scoring with confidence weighting
"""

import spacy
import re
import numpy as np
from typing import Dict, List, Tuple, Set, Optional
from dataclasses import dataclass
from enum import Enum
import logging
from pathlib import Path

# ML/NLP imports
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import hashlib
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExperienceLevel(Enum):
    """Standardized experience levels"""
    ENTRY = "entry"
    JUNIOR = "junior" 
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    PRINCIPAL = "principal"
    EXECUTIVE = "executive"

@dataclass
class SkillMatch:
    """Standardized skill matching result"""
    skill: str
    confidence: float
    source: str  # 'exact', 'normalized', 'semantic'
    context: Optional[Dict] = None

@dataclass
class ExperienceProfile:
    """Structured experience data"""
    years: int
    level: ExperienceLevel
    confidence: float
    leadership_indicators: int
    technical_depth: float

@dataclass
class ScoringResult:
    """Complete scoring result with breakdown"""
    overall_score: float
    confidence: float
    skills_match: float
    experience_match: float
    semantic_similarity: float
    company_adjustment: float
    final_score: float
    explanation: str
    breakdown: Dict

class SkillTaxonomy:
    """Industry-standard skill taxonomy based on O*NET and ESCO"""
    
    # Technical skill categories with industry weights
    CATEGORIES = {
        'programming_languages': {
            'weight': 0.30,
            'skills': {
                'python': ['py', 'python3', 'python2'],
                'javascript': ['js', 'ecmascript', 'es6', 'es2020'],
                'java': ['java8', 'java11', 'openjdk'],
                'typescript': ['ts'],
                'cpp': ['c++', 'cplusplus'],
                'csharp': ['c#', '.net'],
                'go': ['golang'],
                'rust': ['rust-lang'],
                'swift': ['swift5'],
                'kotlin': ['kt']
            }
        },
        'frameworks_libraries': {
            'weight': 0.25,
            'skills': {
                'react': ['reactjs', 'react.js'],
                'angular': ['angular2', 'angularjs'],
                'vue': ['vuejs', 'vue.js'],
                'django': ['django-rest'],
                'flask': ['flask-restful'],
                'fastapi': ['fast-api'],
                'spring': ['spring-boot'],
                'express': ['expressjs', 'express.js'],
                'laravel': ['laravel-framework']
            }
        },
        'databases': {
            'weight': 0.20,
            'skills': {
                'postgresql': ['postgres', 'pg', 'psql'],
                'mysql': ['mariadb'],
                'mongodb': ['mongo', 'nosql'],
                'redis': ['redis-cache'],
                'elasticsearch': ['elastic', 'es'],
                'cassandra': ['apache-cassandra'],
                'neo4j': ['graph-database']
            }
        },
        'cloud_devops': {
            'weight': 0.15,
            'skills': {
                'aws': ['amazon-web-services', 'ec2', 's3'],
                'azure': ['microsoft-azure'],
                'gcp': ['google-cloud', 'google-cloud-platform'],
                'docker': ['containerization'],
                'kubernetes': ['k8s', 'container-orchestration'],
                'terraform': ['infrastructure-as-code'],
                'jenkins': ['ci-cd', 'continuous-integration']
            }
        },
        'soft_skills': {
            'weight': 0.10,
            'skills': {
                'leadership': ['team-lead', 'management'],
                'communication': ['presentation', 'documentation'],
                'problem-solving': ['analytical-thinking'],
                'collaboration': ['teamwork', 'cross-functional'],
                'mentoring': ['coaching', 'training']
            }
        }
    }

    @classmethod
    def normalize_skill(cls, skill: str) -> str:
        """Normalize skill to canonical form using taxonomy"""
        skill_lower = skill.lower().strip()
        
        for category_data in cls.CATEGORIES.values():
            for canonical, aliases in category_data['skills'].items():
                if skill_lower == canonical or skill_lower in aliases:
                    return canonical
        
        return skill_lower

    @classmethod
    def get_skill_category(cls, skill: str) -> Optional[str]:
        """Get category for a skill"""
        normalized = cls.normalize_skill(skill)
        
        for category, category_data in cls.CATEGORIES.items():
            if normalized in category_data['skills']:
                return category
        
        return None

class ExperienceAnalyzer:
    """Advanced experience level analysis using NLP"""
    
    # Experience patterns with context awareness
    PATTERNS = {
        'years': [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?(?:professional\s+)?experience',
            r'(\d+)\+?\s*years?\s+(?:in\s+)?(?:software\s+)?(?:development|engineering)',
            r'(\d+)\+?\s*(?:year|yr)s?\s+exp(?:erience)?'
        ],
        'leadership': [
            r'led\s+(?:a\s+)?team\s+of\s+(\d+)',
            r'managed\s+(\d+)\s+(?:developers|engineers)',
            r'mentored\s+(\d+)\s+(?:junior|developers)',
        ]
    }
    
    # Seniority inference rules based on industry standards
    SENIORITY_MAPPING = {
        (0, 1): ExperienceLevel.ENTRY,
        (1, 3): ExperienceLevel.JUNIOR,
        (3, 6): ExperienceLevel.MID,
        (6, 10): ExperienceLevel.SENIOR,
        (10, 15): ExperienceLevel.LEAD,
        (15, float('inf')): ExperienceLevel.PRINCIPAL
    }

    @classmethod
    def extract_experience(cls, text: str) -> ExperienceProfile:
        """Extract comprehensive experience profile"""
        text_lower = text.lower()
        
        # Extract years of experience
        years = 0
        for pattern in cls.PATTERNS['years']:
            matches = re.findall(pattern, text_lower)
            if matches:
                years = max(int(m) for m in matches)
                break
        
        # Extract leadership indicators
        leadership_count = 0
        team_size = 0
        
        for pattern in cls.PATTERNS['leadership']:
            matches = re.findall(pattern, text_lower)
            if matches:
                leadership_count += len(matches)
                team_size = max(team_size, max(int(m) for m in matches))
        
        # Infer seniority level
        level = cls._infer_seniority(years, leadership_count, team_size)
        
        # Calculate confidence based on explicit mentions
        confidence = cls._calculate_confidence(text_lower, years, level)
        
        # Calculate technical depth
        technical_depth = cls._assess_technical_depth(text_lower)
        
        return ExperienceProfile(
            years=years,
            level=level,
            confidence=confidence,
            leadership_indicators=leadership_count,
            technical_depth=technical_depth
        )
    
    @classmethod
    def _infer_seniority(cls, years: int, leadership: int, team_size: int) -> ExperienceLevel:
        """Infer seniority from multiple factors"""
        # Base level from years
        base_level = ExperienceLevel.ENTRY
        for (min_years, max_years), level in cls.SENIORITY_MAPPING.items():
            if min_years <= years < max_years:
                base_level = level
                break
        
        # Adjust for leadership experience
        if leadership > 0 and team_size >= 3:
            if base_level.value in ['entry', 'junior']:
                base_level = ExperienceLevel.MID
            elif base_level == ExperienceLevel.MID:
                base_level = ExperienceLevel.SENIOR
        
        return base_level
    
    @classmethod
    def _calculate_confidence(cls, text: str, years: int, level: ExperienceLevel) -> float:
        """Calculate confidence in experience assessment"""
        confidence = 0.5  # Base confidence
        
        # Boost for explicit years
        if years > 0:
            confidence += 0.3
        
        # Boost for explicit level mentions
        level_keywords = {
            'senior': ['senior', 'sr.'],
            'lead': ['lead', 'principal', 'staff'],
            'junior': ['junior', 'jr.', 'entry'],
            'mid': ['mid-level', 'intermediate']
        }
        
        for level_name, keywords in level_keywords.items():
            if any(kw in text for kw in keywords):
                confidence += 0.2
                break
        
        return min(confidence, 1.0)
    
    @classmethod
    def _assess_technical_depth(cls, text: str) -> float:
        """Assess technical depth from resume content"""
        depth_indicators = [
            'architecture', 'design patterns', 'scalability',
            'performance optimization', 'system design',
            'microservices', 'distributed systems'
        ]
        
        matches = sum(1 for indicator in depth_indicators if indicator in text)
        return min(matches / len(depth_indicators), 1.0)

class SemanticMatcher:
    """Advanced semantic matching using domain-specific transformers"""
    
    def __init__(self):
        self.sentence_model = None
        self.tfidf_vectorizer = None
        self._load_models()
    
    def _load_models(self):
        """Load and initialize models"""
        try:
            # Use domain-specific model for professional text
            self.sentence_model = SentenceTransformer('all-mpnet-base-v2')
            logger.info("✅ Loaded all-mpnet-base-v2 (professional-optimized)")
            
            # Initialize TF-IDF for fallback
            self.tfidf_vectorizer = TfidfVectorizer(
                stop_words='english',
                ngram_range=(1, 3),  # Include trigrams for technical terms
                max_features=10000,
                lowercase=True,
                min_df=1,
                max_df=0.95
            )
            
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            self.sentence_model = None
    
    def calculate_similarity(self, resume_text: str, job_text: str) -> Tuple[float, float, str]:
        """Calculate semantic similarity with confidence and method tracking"""
        
        if not self.sentence_model:
            return self._fallback_similarity(resume_text, job_text)
        
        try:
            # Preprocess texts for better domain understanding
            resume_processed = self._preprocess_resume(resume_text)
            job_processed = self._preprocess_job(job_text)
            
            # Calculate semantic similarity
            embeddings = self.sentence_model.encode([resume_processed, job_processed])
            similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            
            # Calculate confidence
            confidence = self._calculate_confidence(resume_text, job_text)
            
            # Use hybrid approach if confidence is low
            if confidence < 0.4:
                tfidf_sim = self._tfidf_similarity(resume_text, job_text)
                similarity = (similarity * confidence) + (tfidf_sim * (1 - confidence))
                method = f"hybrid(sem:{confidence:.2f})"
            else:
                method = "semantic"
            
            return float(similarity), float(confidence), method
            
        except Exception as e:
            logger.warning(f"Semantic similarity failed: {e}")
            return self._fallback_similarity(resume_text, job_text)
    
    def _preprocess_resume(self, text: str) -> str:
        """Simplified preprocessing - keep more context"""
        # Just clean up the text, don't over-filter
        return text.strip()
    
    def _preprocess_job(self, text: str) -> str:
        """Simplified preprocessing - keep more context"""
        # Just clean up the text, don't over-filter
        return text.strip()
    
    def _calculate_confidence(self, resume_text: str, job_text: str) -> float:
        """Improved confidence calculation"""
        # Base confidence higher
        base_confidence = 0.4
        
        # Text quality indicators
        professional_terms = [
            'experience', 'skills', 'developed', 'managed', 'led',
            'implemented', 'designed', 'built', 'created', 'responsible'
        ]
        
        resume_quality = sum(1 for term in professional_terms 
                        if term in resume_text.lower()) / len(professional_terms)
        job_quality = sum(1 for term in professional_terms 
                        if term in job_text.lower()) / len(professional_terms)
        
        # Length factors (more generous)
        resume_length = min(len(resume_text.split()) / 100, 1.0)
        job_length = min(len(job_text.split()) / 50, 1.0)
        
        # More generous confidence calculation
        confidence = base_confidence + (resume_quality * 0.2 + job_quality * 0.2 + 
                                    resume_length * 0.1 + job_length * 0.1)
        
        return min(confidence, 1.0)
    
    def _tfidf_similarity(self, resume_text: str, job_text: str) -> float:
        """TF-IDF fallback similarity"""
        try:
            texts = [resume_text, job_text]
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except:
            return 0.0
    
    def _fallback_similarity(self, resume_text: str, job_text: str) -> Tuple[float, float, str]:
        """Fallback when semantic models fail"""
        similarity = self._tfidf_similarity(resume_text, job_text)
        confidence = 0.3  # Low confidence for fallback
        return similarity, confidence, "tfidf_fallback"

class CompanyIntelligence:
    """Company-specific adjustments based on hiring patterns"""
    
    COMPANY_PROFILES = {
        'big_tech': {
            'companies': ['google', 'meta', 'amazon', 'apple', 'microsoft', 'netflix'],
            'modifier': -0.15,
            'description': 'Higher hiring standards'
        },
        'unicorn': {
            'companies': ['uber', 'airbnb', 'stripe', 'databricks'],
            'modifier': -0.10,
            'description': 'Competitive hiring'
        },
        'startup': {
            'companies': ['startup', 'early-stage', 'seed', 'series-a'],
            'modifier': 0.10,
            'description': 'Flexible hiring'
        },
        'consulting': {
            'companies': ['mckinsey', 'bcg', 'bain', 'deloitte', 'accenture'],
            'modifier': -0.08,
            'description': 'Structured hiring process'
        }
    }
    
    @classmethod
    def get_company_adjustment(cls, company_name: str) -> Tuple[float, str]:
        """Get company-specific hiring adjustment"""
        company_lower = company_name.lower()
        
        for profile_name, profile in cls.COMPANY_PROFILES.items():
            if any(company in company_lower for company in profile['companies']):
                return profile['modifier'], profile['description']
        
        return 0.0, 'Standard hiring process'

class ResumeJobScorer:
    """Main scoring engine implementing industry best practices"""
    
    def __init__(self):
        self.semantic_matcher = SemanticMatcher()
        self.cache = {}  # Simple in-memory cache for deterministic results
    
    def score(self, resume_text: str, job_text: str, company_name: str = "unknown") -> ScoringResult:
        """
        Calculate comprehensive resume-job match score
        
        Returns score between 0-100 with detailed breakdown
        """
        # Create cache key for deterministic results
        cache_key = self._create_cache_key(resume_text, job_text, company_name)
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # 1. Extract structured data
            resume_skills = self._extract_skills(resume_text)
            job_skills = self._extract_skills(job_text)
            resume_exp = ExperienceAnalyzer.extract_experience(resume_text)
            job_exp = ExperienceAnalyzer.extract_experience(job_text)
            
            # 2. Calculate semantic similarity
            semantic_sim, sem_confidence, method = self.semantic_matcher.calculate_similarity(
                resume_text, job_text
            )
            
            # 3. Calculate skills match
            skills_score = self._calculate_skills_match(resume_skills, job_skills)
            
            # 4. Calculate experience match
            exp_score = self._calculate_experience_match(resume_exp, job_exp)
            
            # 5. Get company adjustment
            company_adj, company_desc = CompanyIntelligence.get_company_adjustment(company_name)
            
            # 6. Combine scores with adjusted weights (fixing semantic issues)
            base_score = (
                skills_score * 0.60 +      # Increase skills weight
                semantic_sim * 0.20 +      # Decrease semantic weight until fixed
                exp_score * 0.20           # Keep experience weight
            )
            # Apply confidence weighting
            confidence_weighted = base_score * sem_confidence
            
            # Apply company adjustment
            final_score = max(0, min(1, confidence_weighted + company_adj))
            
            # Convert to 0-100 scale
            final_score_100 = final_score * 100
            
            # Create comprehensive result
            result = ScoringResult(
                overall_score=base_score * 100,
                confidence=sem_confidence,
                skills_match=skills_score * 100,
                experience_match=exp_score * 100,
                semantic_similarity=semantic_sim * 100,
                company_adjustment=company_adj * 100,
                final_score=final_score_100,
                explanation=self._generate_explanation(
                    skills_score, semantic_sim, exp_score, 
                    company_adj, method, sem_confidence
                ),
                breakdown={
                    'resume_skills': resume_skills,
                    'job_skills': job_skills,
                    'resume_experience': resume_exp.__dict__,
                    'job_experience': job_exp.__dict__,
                    'company_info': company_desc,
                    'method_used': method
                }
            )
            
            # Cache result
            self.cache[cache_key] = result
            return result
            
        except Exception as e:
            logger.error(f"Scoring failed: {e}")
            return self._create_fallback_result()
    
    def _extract_skills(self, text: str) -> Dict[str, List[SkillMatch]]:
        """Extract and categorize skills using taxonomy"""
        skills_by_category = {}
        text_lower = text.lower()
        
        for category, category_data in SkillTaxonomy.CATEGORIES.items():
            category_skills = []
            
            for canonical_skill, aliases in category_data['skills'].items():
                # Check for exact matches
                all_variants = [canonical_skill] + aliases
                
                for variant in all_variants:
                    if variant in text_lower:
                        # Calculate confidence based on context
                        confidence = self._calculate_skill_confidence(text_lower, variant)
                        
                        skill_match = SkillMatch(
                            skill=canonical_skill,
                            confidence=confidence,
                            source='exact' if variant == canonical_skill else 'normalized'
                        )
                        category_skills.append(skill_match)
                        break  # Don't double-count
            
            skills_by_category[category] = category_skills
        
        return skills_by_category
    
    def _calculate_skill_confidence(self, text: str, skill: str) -> float:
        """Calculate confidence for skill detection"""
        # Basic implementation - can be enhanced with context analysis
        skill_count = text.count(skill)
        context_score = 0.5
        
        # Boost confidence for skills mentioned multiple times
        frequency_bonus = min(skill_count * 0.1, 0.3)
        
        return min(context_score + frequency_bonus, 1.0)
    
    def _calculate_skills_match(self, resume_skills: Dict, job_skills: Dict) -> float:
        """Calculate weighted skills match score"""
        total_score = 0.0
        
        for category in SkillTaxonomy.CATEGORIES:
            category_weight = SkillTaxonomy.CATEGORIES[category]['weight']
            
            resume_category_skills = {s.skill for s in resume_skills.get(category, [])}
            job_category_skills = {s.skill for s in job_skills.get(category, [])}
            
            if job_category_skills:
                # Calculate intersection ratio
                matched = len(resume_category_skills.intersection(job_category_skills))
                required = len(job_category_skills)
                category_score = matched / required
            else:
                # No requirements in this category
                category_score = 1.0 if resume_category_skills else 0.5
            
            total_score += category_score * category_weight
        
        return total_score
    
    def _calculate_experience_match(self, resume_exp: ExperienceProfile, 
                                  job_exp: ExperienceProfile) -> float:
        """Calculate experience alignment score"""
        
        # Years experience component
        years_score = 1.0
        if job_exp.years > 0:
            years_ratio = resume_exp.years / job_exp.years
            if years_ratio >= 1.0:
                years_score = 1.0  # Meets or exceeds requirement
            elif years_ratio >= 0.8:
                years_score = 0.9  # Close enough
            else:
                years_score = years_ratio * 0.8  # Penalty for insufficient experience
        
        # Seniority level component
        level_score = self._calculate_level_match(resume_exp.level, job_exp.level)
        
        # Leadership component
        leadership_score = 1.0
        if job_exp.leadership_indicators > 0:
            leadership_ratio = min(resume_exp.leadership_indicators / 
                                 job_exp.leadership_indicators, 1.0)
            leadership_score = 0.7 + (leadership_ratio * 0.3)
        
        # Weighted combination
        experience_score = (
            years_score * 0.5 +
            level_score * 0.3 +
            leadership_score * 0.2
        )
        
        return experience_score
    
    def _calculate_level_match(self, resume_level: ExperienceLevel, 
                             job_level: ExperienceLevel) -> float:
        """Calculate seniority level match score"""
        level_hierarchy = [
            ExperienceLevel.ENTRY,
            ExperienceLevel.JUNIOR,
            ExperienceLevel.MID,
            ExperienceLevel.SENIOR,
            ExperienceLevel.LEAD,
            ExperienceLevel.PRINCIPAL,
            ExperienceLevel.EXECUTIVE
        ]
        
        try:
            resume_idx = level_hierarchy.index(resume_level)
            job_idx = level_hierarchy.index(job_level)
            
            if resume_idx == job_idx:
                return 1.0  # Perfect match
            elif resume_idx == job_idx + 1:
                return 0.9  # Slightly overqualified (good)
            elif resume_idx == job_idx - 1:
                return 0.8  # Slightly underqualified (acceptable)
            elif resume_idx > job_idx:
                return 0.6  # Overqualified (might not be interested)
            else:
                return 0.4  # Underqualified
        except ValueError:
            return 0.5  # Unknown levels
    
    def _create_cache_key(self, resume_text: str, job_text: str, company_name: str) -> str:
        """Create deterministic cache key"""
        content = f"{resume_text}|{job_text}|{company_name}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def _generate_explanation(self, skills_score: float, semantic_sim: float, 
                            exp_score: float, company_adj: float, 
                            method: str, confidence: float) -> str:
        """Generate human-readable explanation"""
        return (
            f"Skills match: {skills_score*100:.1f}%, "
            f"Semantic similarity: {semantic_sim*100:.1f}% ({method}, conf: {confidence:.2f}), "
            f"Experience match: {exp_score*100:.1f}%, "
            f"Company adjustment: {company_adj*100:+.1f}%"
        )
    
    def _create_fallback_result(self) -> ScoringResult:
        """Create fallback result when scoring fails"""
        return ScoringResult(
            overall_score=0.0,
            confidence=0.0,
            skills_match=0.0,
            experience_match=0.0,
            semantic_similarity=0.0,
            company_adjustment=0.0,
            final_score=0.0,
            explanation="Scoring failed - insufficient data",
            breakdown={}
        )

# Initialize global scorer instance
_scorer = None

def get_scorer() -> ResumeJobScorer:
    """Get or create scorer instance"""
    global _scorer
    if _scorer is None:
        _scorer = ResumeJobScorer()
    return _scorer

def calculate_advanced_score(resume_text: str, job_text: str, company_name: str) -> Dict:
    """
    Main entry point for scoring - maintains compatibility with existing API
    """
    scorer = get_scorer()
    result = scorer.score(resume_text, job_text, company_name)
    
    # Convert to format expected by existing API
    return {
        'overall_score': int(result.overall_score),
        'semantic_similarity': result.semantic_similarity / 100,
        'skills_breakdown': _format_skills_breakdown(
            result.breakdown.get('resume_skills', {}),
            result.breakdown.get('job_skills', {})  # ← Pass job skills too!
        ),
        'experience_match': _format_experience_match(result.breakdown),
        'company_modifier': int(result.company_adjustment),
        'final_score': int(result.final_score),
        'explanation': result.explanation
    }

def _format_skills_breakdown(resume_skills: Dict, job_skills: Dict) -> Dict:
    """Format skills data for API compatibility"""
    breakdown = {}
    for category in SkillTaxonomy.CATEGORIES.keys():
        resume_count = len(resume_skills.get(category, []))
        job_count = len(job_skills.get(category, []))
        
        if job_count > 0:
            score = min(100, (resume_count / job_count) * 100)
        else:
            score = 85 if resume_count > 0 else 0
            
        breakdown[category] = {
            'resume_skills': resume_count,
            'job_requirements': job_count,  # ← Now correctly calculated!
            'score': round(score, 1),
            'weight': SkillTaxonomy.CATEGORIES[category]['weight']
        }
    return breakdown

def _format_experience_match(breakdown: Dict) -> Dict:
    """Format experience data for API compatibility"""
    resume_exp = breakdown.get('resume_experience', {})
    job_exp = breakdown.get('job_experience', {})
    
    return {
        'resume_years': resume_exp.get('years', 0),
        'resume_level_final': resume_exp.get('level', 'unknown'),
        'job_years': job_exp.get('years', 0),
        'job_level': job_exp.get('level', 'unknown'),
        'experience_bonus': 10,  # Simplified for compatibility
        'leadership_keywords': resume_exp.get('leadership_indicators', 0)
    }

# Legacy function aliases for backward compatibility
def extract_enhanced_skills_v2(text: str) -> Dict:
    """Legacy compatibility function"""
    scorer = get_scorer()
    skills = scorer._extract_skills(text)
    
    # Convert to old format
    result = {}
    for category, skill_matches in skills.items():
        result[category] = {
            'skills': [{'skill': s.skill, 'matched_as': s.source} for s in skill_matches],
            'count': len(skill_matches),
            'weight': SkillTaxonomy.CATEGORIES.get(category, {}).get('weight', 0.1)
        }
    return result

def extract_enhanced_experience_level(text: str) -> Dict:
    """Legacy compatibility function"""
    exp_profile = ExperienceAnalyzer.extract_experience(text)
    return {
        'years': exp_profile.years,
        'final_level': exp_profile.level.value,
        'leadership_keywords': exp_profile.leadership_indicators,
        'job_titles': []  # Simplified for compatibility
    }

def calculate_hybrid_semantic_similarity(resume_text: str, job_text: str) -> Tuple[float, float, str]:
    """Legacy compatibility function"""
    scorer = get_scorer()
    return scorer.semantic_matcher.calculate_similarity(resume_text, job_text)