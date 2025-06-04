// API Types
export interface JobResumeRequest {
    resume_text: string;
    job_description: string;
    company_name: string;
  }
  
  export interface SkillsBreakdown {
    [category: string]: {
      resume_skills: number;
      job_requirements: number;
      score: number;
      weight: number;
    };
  }
  
  export interface ExperienceMatch {
    resume_years: number;
    resume_level_final: string;
    job_years: number;
    job_level: string;
    experience_bonus: number;
    leadership_keywords: number;
  }
  
  export interface ScoringResponse {
    overall_score: number;
    semantic_similarity: number;
    skills_breakdown: SkillsBreakdown;
    experience_match: ExperienceMatch;
    company_modifier: number;
    final_score: number;
    explanation: string;
  }
  
  // UI Types
  export interface Company {
    name: string;
    category: string;
  }
  
  export interface LoadingState {
    isLoading: boolean;
    error: string | null;
  }