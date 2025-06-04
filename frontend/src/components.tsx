import React, { useState } from 'react';
import { ScoringResponse, SkillsBreakdown, ExperienceMatch, Company, AnalysisInsight } from './types';

// Utility functions
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#007AFF'; // Apple blue
  if (score >= 60) return '#FF9500'; // Apple orange
  if (score >= 40) return '#FF3B30'; // Apple red
  return '#8E8E93'; // Apple gray
};

// Enhanced companies data with more details
export const POPULAR_COMPANIES: Company[] = [
  { name: 'Google', category: 'big_tech', description: 'Extremely high standards, rigorous process', modifier: -15 },
  { name: 'Meta', category: 'big_tech', description: 'Focus on scale and innovation', modifier: -15 },
  { name: 'Amazon', category: 'big_tech', description: 'Customer obsession, ownership principles', modifier: -15 },
  { name: 'Apple', category: 'big_tech', description: 'Design excellence, attention to detail', modifier: -15 },
  { name: 'Microsoft', category: 'big_tech', description: 'Growth mindset, collaboration', modifier: -15 },
  { name: 'Netflix', category: 'big_tech', description: 'High performance culture', modifier: -15 },
  { name: 'Uber', category: 'unicorn', description: 'Fast-paced, global scale', modifier: -10 },
  { name: 'Airbnb', category: 'unicorn', description: 'Belong anywhere, design thinking', modifier: -10 },
  { name: 'Stripe', category: 'unicorn', description: 'Financial infrastructure, quality', modifier: -10 },
  { name: 'Databricks', category: 'unicorn', description: 'Data and AI platform', modifier: -10 },
  { name: 'Startup', category: 'startup', description: 'Flexible, growth-oriented', modifier: 10 },
  { name: 'Early-stage', category: 'startup', description: 'Rapid iteration, versatility', modifier: 10 },
  { name: 'McKinsey', category: 'consulting', description: 'Problem-solving, client impact', modifier: -8 },
  { name: 'BCG', category: 'consulting', description: 'Strategic insights, innovation', modifier: -8 },
  { name: 'Bain', category: 'consulting', description: 'Results delivery, teamwork', modifier: -8 },
  { name: 'Deloitte', category: 'consulting', description: 'Digital transformation', modifier: -8 },
  { name: 'Accenture', category: 'consulting', description: 'Technology consulting', modifier: -8 },
];

// Enhanced Input Form Component
interface InputFormProps {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  onResumeChange: (text: string) => void;
  onJobChange: (text: string) => void;
  onCompanyChange: (company: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  resumeText,
  jobDescription,
  companyName,
  onResumeChange,
  onJobChange,
  onCompanyChange,
  onSubmit,
  isLoading
}) => {
  const [showTips, setShowTips] = useState(false);
  const canSubmit = resumeText.length >= 50 && jobDescription.length >= 30 && !isLoading;
  const selectedCompany = POPULAR_COMPANIES.find(c => c.name.toLowerCase() === companyName);

  const resumeTips = [
    "Include specific years of experience with technologies",
    "Mention leadership roles and team sizes managed",
    "Add architecture and system design experience",
    "Include quantifiable achievements and metrics",
    "List specific frameworks, tools, and platforms"
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Tips Section */}
      <div style={{ 
        marginBottom: '32px', 
        padding: '24px', 
        backgroundColor: '#F2F2F7', 
        borderRadius: '16px',
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1D1D1F', fontSize: '17px', fontWeight: '600' }}>
            Optimize Your Results
          </h3>
          <button
            onClick={() => setShowTips(!showTips)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007AFF',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '400'
            }}
          >
            {showTips ? 'Hide' : 'Show'} Tips
          </button>
        </div>
        {showTips && (
          <div style={{ marginTop: '16px', fontSize: '15px', color: '#86868B' }}>
            {resumeTips.map((tip, index) => (
              <div key={index} style={{ marginBottom: '8px', paddingLeft: '12px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '0', 
                  top: '9px', 
                  width: '4px', 
                  height: '4px', 
                  backgroundColor: '#007AFF', 
                  borderRadius: '50%' 
                }} />
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#1D1D1F', fontSize: '17px' }}>
            Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => onResumeChange(e.target.value)}
            placeholder="Paste your resume content here..."
            style={{
              width: '100%',
              height: '280px',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              resize: 'vertical',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: '1.5',
              transition: 'box-shadow 0.2s ease'
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.2)'}
            onBlur={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '13px', 
            marginTop: '8px',
            color: '#86868B'
          }}>
            <span>
              {resumeText.length >= 50 ? '✓' : '◦'} {resumeText.length}/50 characters minimum
            </span>
            <span>
              {resumeText.split(/\s+/).filter(w => w.length > 0).length} words
            </span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#1D1D1F', fontSize: '17px' }}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobChange(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: '100%',
              height: '280px',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              resize: 'vertical',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: '1.5',
              transition: 'box-shadow 0.2s ease'
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.2)'}
            onBlur={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '13px', 
            marginTop: '8px',
            color: '#86868B'
          }}>
            <span>
              {jobDescription.length >= 30 ? '✓' : '◦'} {jobDescription.length}/30 characters minimum
            </span>
            <span>
              {jobDescription.split(/\s+/).filter(w => w.length > 0).length} words
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#1D1D1F', fontSize: '17px' }}>
            Company
          </label>
          <select
            value={companyName}
            onChange={(e) => onCompanyChange(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            <option value="unknown">Select Company (Optional)</option>
            <optgroup label="Big Tech">
              {POPULAR_COMPANIES.filter(c => c.category === 'big_tech').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Unicorns">
              {POPULAR_COMPANIES.filter(c => c.category === 'unicorn').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Consulting">
              {POPULAR_COMPANIES.filter(c => c.category === 'consulting').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Startups">
              {POPULAR_COMPANIES.filter(c => c.category === 'startup').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name}
                </option>
              ))}
            </optgroup>
          </select>
          {selectedCompany && (
            <div style={{ 
              fontSize: '13px', 
              color: '#86868B', 
              marginTop: '8px'
            }}>
              {selectedCompany.description}
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            padding: '16px 32px',
            background: canSubmit ? '#007AFF' : '#D1D1D6',
            color: canSubmit ? 'white' : '#86868B',
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '600',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            minWidth: '140px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (canSubmit) {
              e.currentTarget.style.backgroundColor = '#0056CC';
            }
          }}
          onMouseLeave={(e) => {
            if (canSubmit) {
              e.currentTarget.style.backgroundColor = '#007AFF';
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Analyzing
            </span>
          ) : 'Analyze Match'}
        </button>
      </div>
    </div>
  );
};

// Sleek Score Display
interface ScoreDisplayProps {
  score: number;
  label: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  label, 
  subtitle,
  size = 'medium'
}) => {
  const sizes = {
    small: { font: '20px', padding: '16px' },
    medium: { font: '32px', padding: '24px' },
    large: { font: '48px', padding: '32px' }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: sizes[size].padding,
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        fontSize: sizes[size].font,
        fontWeight: '700',
        color: getScoreColor(score),
        marginBottom: '8px'
      }}>
        {Math.round(score)}%
      </div>
      <div style={{
        fontSize: '15px',
        color: '#1D1D1F',
        fontWeight: '600',
        marginBottom: subtitle ? '4px' : 0
      }}>
        {label}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '13px',
          color: '#86868B'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

// Clean Skills Breakdown
interface SkillsBreakdownProps {
  skillsBreakdown: SkillsBreakdown;
  overallScore: number;
}

export const SkillsBreakdownComponent: React.FC<SkillsBreakdownProps> = ({ 
  skillsBreakdown, 
  overallScore 
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const formatCategoryName = (category: string): string => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, color: '#1D1D1F', fontSize: '22px', fontWeight: '700' }}>
          Skills Analysis
        </h3>
        <div style={{ 
          backgroundColor: '#F2F2F7', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: '600',
          color: '#1D1D1F'
        }}>
          {Math.round(overallScore)}%
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {Object.entries(skillsBreakdown).map(([category, data]) => {
          const skillData = data as {
            resume_skills: number;
            job_requirements: number;
            score: number;
            weight: number;
            matched_skills?: string[];
            missing_skills?: string[];
          };
          
          const isExpanded = expandedCategory === category;
          
          return (
            <div key={category} style={{
              border: '1px solid #F2F2F7',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF'
            }}>
              <div 
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                onMouseEnter={(e) => {
                  if (!isExpanded) e.currentTarget.style.backgroundColor = '#FAFAFA';
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1D1D1F', fontSize: '17px' }}>
                      {formatCategoryName(category)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '700', 
                      color: getScoreColor(skillData.score),
                      fontSize: '20px'
                    }}>
                      {Math.round(skillData.score)}%
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#F2F2F7',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(skillData.score, 100)}%`,
                      height: '100%',
                      backgroundColor: getScoreColor(skillData.score),
                      transition: 'width 0.8s ease-out',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div style={{ color: '#34C759' }}>
                    <div style={{ fontWeight: '600' }}>Found: {skillData.resume_skills}</div>
                  </div>
                  <div style={{ color: '#FF3B30' }}>
                    <div style={{ fontWeight: '600' }}>Required: {skillData.job_requirements}</div>
                  </div>
                  <div style={{ color: '#86868B' }}>
                    <div style={{ fontWeight: '600' }}>Weight: {Math.round(skillData.weight * 100)}%</div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '13px', 
                  color: '#86868B',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{isExpanded ? '−' : '+'}</span>
                  <span>{isExpanded ? 'Less' : 'More'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ 
                  padding: '20px', 
                  borderTop: '1px solid #F2F2F7',
                  backgroundColor: '#FAFAFA'
                }}>
                  {skillData.matched_skills && skillData.matched_skills.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#34C759', marginBottom: '8px', fontSize: '15px' }}>
                        Matched Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skillData.matched_skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#D1F2EB',
                            color: '#00C896',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skillData.missing_skills && skillData.missing_skills.length > 0 && (
                    <div>
                      <div style={{ fontWeight: '600', color: '#FF3B30', marginBottom: '8px', fontSize: '15px' }}>
                        Missing Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skillData.missing_skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#FFECEB',
                            color: '#FF3B30',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Clean Experience Match Component  
interface ExperienceMatchProps {
  experienceMatch: ExperienceMatch;
}

export const ExperienceMatchComponent: React.FC<ExperienceMatchProps> = ({ experienceMatch }) => {
  const formatLevel = (level: string): string => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getExperienceGap = (): { gap: number; status: string; color: string; message: string } => {
    const gap = experienceMatch.resume_years - experienceMatch.job_years;
    if (gap >= 3) return { 
      gap, 
      status: 'Exceeds Requirements', 
      color: '#007AFF', 
      message: 'Significantly exceeds requirements' 
    };
    if (gap >= 0) return { 
      gap, 
      status: 'Meets Requirements', 
      color: '#34C759', 
      message: 'Meets or exceeds requirements' 
    };
    if (gap >= -2) return { 
      gap, 
      status: 'Close Match', 
      color: '#FF9500', 
      message: 'Slightly below requirements' 
    };
    return { 
      gap, 
      status: 'Experience Gap', 
      color: '#FF3B30', 
      message: 'Below requirements' 
    };
  };

  const experienceGap = getExperienceGap();

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 24px 0', color: '#1D1D1F', fontSize: '22px', fontWeight: '700' }}>
        Experience Analysis
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#F2F2F7',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '15px', color: '#86868B', fontWeight: '600', marginBottom: '8px' }}>
            Your Experience
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#1D1D1F', marginBottom: '8px' }}>
            {experienceMatch.resume_years}
          </div>
          <div style={{ fontSize: '17px', color: '#1D1D1F', fontWeight: '600' }}>
            {formatLevel(experienceMatch.resume_level_final)} Level
          </div>
          {experienceMatch.leadership_keywords > 0 && (
            <div style={{ 
              marginTop: '12px',
              fontSize: '13px',
              color: '#007AFF',
              backgroundColor: '#E3F2FD',
              padding: '4px 8px',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              {experienceMatch.leadership_keywords} leadership indicators
            </div>
          )}
        </div>

        <div style={{ 
          padding: '24px', 
          backgroundColor: '#F2F2F7',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '15px', color: '#86868B', fontWeight: '600', marginBottom: '8px' }}>
            Job Requirements
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#1D1D1F', marginBottom: '8px' }}>
            {experienceMatch.job_years}+
          </div>
          <div style={{ fontSize: '17px', color: '#1D1D1F', fontWeight: '600' }}>
            {formatLevel(experienceMatch.job_level)} Level
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#FAFAFA',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '600', color: '#1D1D1F' }}>
              Assessment
            </div>
            <div style={{ fontSize: '15px', color: '#86868B', marginTop: '4px' }}>
              {experienceGap.message}
            </div>
          </div>
          <div style={{
            backgroundColor: experienceGap.color,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            {experienceGap.status}
          </div>
        </div>

        <div style={{ position: 'relative', height: '8px', backgroundColor: '#E5E5EA', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min((experienceMatch.resume_years / Math.max(experienceMatch.resume_years, experienceMatch.job_years, 10)) * 100, 100)}%`,
            backgroundColor: experienceGap.color,
            borderRadius: '4px',
            transition: 'width 1s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
};

// Clean Semantic Analysis Component
interface SemanticAnalysisProps {
  semanticSimilarity: number;
  confidence: number;
  method: string;
  explanation: string;
}

export const SemanticAnalysisComponent: React.FC<SemanticAnalysisProps> = ({ 
  semanticSimilarity, 
  confidence, 
  method, 
  explanation 
}) => {
  const similarityScore = semanticSimilarity * 100;

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 24px 0', color: '#1D1D1F', fontSize: '22px', fontWeight: '700' }}>
        Semantic Analysis
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#F2F2F7',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: getScoreColor(similarityScore), marginBottom: '8px' }}>
            {Math.round(similarityScore)}%
          </div>
          <div style={{ fontSize: '17px', color: '#1D1D1F', fontWeight: '600' }}>
            Semantic Match
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#F2F2F7',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '15px', color: '#86868B', fontWeight: '600', marginBottom: '16px' }}>
            Analysis Method
          </div>
          <div style={{ fontSize: '17px', color: '#1D1D1F', fontWeight: '600', marginBottom: '8px' }}>
            AI Semantic Understanding
          </div>
          <div style={{ fontSize: '13px', color: '#86868B', marginBottom: '16px' }}>
            {method}
          </div>
          <div style={{
            backgroundColor: confidence >= 0.7 ? '#D1F2EB' : confidence >= 0.4 ? '#FFF4E6' : '#FFECEB',
            color: confidence >= 0.7 ? '#00C896' : confidence >= 0.4 ? '#FF9500' : '#FF3B30',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {Math.round(confidence * 100)}% Confidence
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#FAFAFA',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '15px', color: '#1D1D1F', fontWeight: '600', marginBottom: '8px' }}>
          Analysis Details
        </div>
        <div style={{ fontSize: '15px', color: '#86868B', lineHeight: '1.5' }}>
          {explanation}
        </div>
      </div>
    </div>
  );
};

// Clean AI Insights Component
interface AIInsightsProps {
  results: ScoringResponse;
}

export const AIInsightsComponent: React.FC<AIInsightsProps> = ({ results }) => {
  const generateInsights = (): AnalysisInsight[] => {
    const insights: AnalysisInsight[] = [];
    
    let weakestCategory = '';
    let weakestScore = 100;
    
    Object.entries(results.skills_breakdown).forEach(([category, data]) => {
      const skillData = data as any;
      
      if (skillData.score < weakestScore) {
        weakestScore = skillData.score;
        weakestCategory = category.replace(/_/g, ' ');
      }
    });

    if (results.final_score >= 80) {
      insights.push({
        type: 'strength',
        title: 'Excellent Match',
        description: 'Your profile is a strong match for this position. You exceed most requirements.',
        impact: 'high'
      });
    } else if (results.final_score >= 60) {
      insights.push({
        type: 'suggestion',
        title: 'Good Foundation',
        description: 'Solid match with room for improvement in specific areas.',
        impact: 'medium'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Skills Gap Identified',
        description: 'Significant gaps exist. Focus on developing key missing skills.',
        impact: 'high'
      });
    }

    if (weakestScore < 60) {
      insights.push({
        type: 'weakness',
        title: `Improve ${weakestCategory.charAt(0).toUpperCase() + weakestCategory.slice(1)}`,
        description: `Your ${weakestCategory} skills scored ${Math.round(weakestScore)}%. This is a key area for development.`,
        impact: 'high'
      });
    }

    const expGap = results.experience_match.resume_years - results.experience_match.job_years;
    if (expGap < -2) {
      insights.push({
        type: 'suggestion',
        title: 'Experience Enhancement',
        description: `Consider highlighting transferable skills to bridge the ${Math.abs(expGap)}-year experience gap.`,
        impact: 'medium'
      });
    }

    if (results.experience_match.leadership_keywords > 0) {
      insights.push({
        type: 'strength',
        title: 'Leadership Experience Detected',
        description: `Found ${results.experience_match.leadership_keywords} leadership indicators. This is valuable for senior roles.`,
        impact: 'medium'
      });
    }

    if (results.company_modifier < 0) {
      insights.push({
        type: 'suggestion',
        title: 'Competitive Environment',
        description: `This company has high hiring standards. Ensure your application highlights exceptional achievements.`,
        impact: 'medium'
      });
    }

    return insights.slice(0, 4);
  };

  const insights = generateInsights();

  const getInsightColor = (type: AnalysisInsight['type']): string => {
    const colors = {
      strength: '#34C759',
      weakness: '#FF3B30',
      suggestion: '#007AFF',
      warning: '#FF9500'
    };
    return colors[type];
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 24px 0', color: '#1D1D1F', fontSize: '22px', fontWeight: '700' }}>
        Key Insights
      </h3>

      <div style={{ display: 'grid', gap: '16px' }}>
        {insights.map((insight, index) => (
          <div key={index} style={{
            padding: '20px',
            backgroundColor: '#FAFAFA',
            borderRadius: '12px',
            borderLeft: `4px solid ${getInsightColor(insight.type)}`
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1D1D1F', 
                  marginBottom: '8px',
                  fontSize: '17px'
                }}>
                  {insight.title}
                </div>
                <div style={{ 
                  color: '#86868B', 
                  fontSize: '15px',
                  lineHeight: '1.5'
                }}>
                  {insight.description}
                </div>
              </div>
              <div style={{
                backgroundColor: getInsightColor(insight.type),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {insight.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Clean Main Results Component
interface ResultsDisplayProps {
  results: ScoringResponse;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Hero Score Section */}
      <div style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '48px 32px',
        marginBottom: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', color: '#86868B', fontWeight: '400' }}>
          Match Analysis Complete
        </h2>
        <div style={{ fontSize: '96px', fontWeight: '800', marginBottom: '16px', color: getScoreColor(results.final_score) }}>
          {Math.round(results.final_score)}%
        </div>
        <div style={{ fontSize: '22px', color: '#1D1D1F', fontWeight: '600', marginBottom: '16px' }}>
          Overall Match Score
        </div>
        <div style={{ fontSize: '17px', color: '#86868B', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          {results.explanation}
        </div>
      </div>

      {/* Score Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <ScoreDisplay 
          score={results.overall_score} 
          label="Base Score" 
          subtitle="Before adjustments"
        />
        <ScoreDisplay 
          score={results.semantic_similarity * 100} 
          label="Semantic Match" 
          subtitle="AI understanding"
        />
        <ScoreDisplay 
          score={results.company_modifier + 50} 
          label="Company Factor" 
          subtitle={results.company_modifier >= 0 ? 'Bonus applied' : 'Standards applied'}
        />
        <ScoreDisplay 
          score={(results.breakdown?.confidence || 0.7) * 100} 
          label="Confidence" 
          subtitle="Analysis reliability"
        />
      </div>

      {/* Detailed Analysis Grid */}
      <div style={{ display: 'grid', gap: '32px' }}>
        <SkillsBreakdownComponent 
          skillsBreakdown={results.skills_breakdown} 
          overallScore={results.overall_score}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <ExperienceMatchComponent experienceMatch={results.experience_match} />
          <SemanticAnalysisComponent 
            semanticSimilarity={results.semantic_similarity}
            confidence={results.breakdown?.confidence || 0.7}
            method={results.breakdown?.method_used || 'semantic'}
            explanation={results.explanation}
          />
        </div>

        <AIInsightsComponent results={results} />
      </div>
    </div>
  );
};

// Clean Loading Component
export const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '64px',
    flexDirection: 'column',
    gap: '24px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #F2F2F7',
      borderTop: '3px solid #007AFF',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#1D1D1F', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
        Analyzing your match
      </div>
      <div style={{ color: '#86868B', fontSize: '17px' }}>
        This may take a moment
      </div>
    </div>
  </div>
);

// Clean Error Component
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    border: '1px solid #FF3B30',
    borderRadius: '12px',
    padding: '24px',
    margin: '16px 0'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div>
        <strong style={{ color: '#FF3B30', fontSize: '17px', fontWeight: '600' }}>Analysis Failed</strong>
        <div style={{ color: '#86868B', fontSize: '15px', marginTop: '4px' }}>
          {error}
        </div>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          backgroundColor: '#FF3B30',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D70015'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF3B30'}
      >
        Try Again
      </button>
    )}
  </div>
);