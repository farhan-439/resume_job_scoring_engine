import React, { useState } from 'react';
import { ScoringResponse, SkillsBreakdown, ExperienceMatch, Company, AnalysisInsight } from './types';

// Utility functions
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow  
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
};

const getGradientColor = (score: number): string => {
  if (score >= 80) return 'linear-gradient(135deg, #10b981, #059669)';
  if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
  if (score >= 40) return 'linear-gradient(135deg, #f97316, #ea580c)';
  return 'linear-gradient(135deg, #ef4444, #dc2626)';
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
    "💡 Include specific years of experience with technologies",
    "🎯 Mention leadership roles and team sizes managed",
    "🏗️ Add architecture and system design experience",
    "📊 Include quantifiable achievements and metrics",
    "🔧 List specific frameworks, tools, and platforms"
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Tips Section */}
      <div style={{ 
        marginBottom: '1.5rem', 
        padding: '1rem', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #0ea5e9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#0369a1', fontSize: '16px' }}>
            🎯 Optimize Your Results
          </h3>
          <button
            onClick={() => setShowTips(!showTips)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0369a1',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>
        {showTips && (
          <div style={{ marginTop: '0.75rem', fontSize: '14px', color: '#0369a1' }}>
            {resumeTips.map((tip, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>{tip}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            📄 Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => onResumeChange(e.target.value)}
            placeholder="Paste your resume content here... Include specific skills, years of experience, leadership roles, and achievements."
            style={{
              width: '100%',
              height: '320px',
              padding: '1rem',
              border: `2px solid ${resumeText.length >= 50 ? '#10b981' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = resumeText.length >= 50 ? '#10b981' : '#e5e7eb'}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '12px', 
            marginTop: '0.25rem' 
          }}>
            <span style={{ color: resumeText.length >= 50 ? '#10b981' : '#ef4444' }}>
              {resumeText.length}/50 characters minimum
            </span>
            <span style={{ color: '#6b7280' }}>
              Words: {resumeText.split(/\s+/).filter(w => w.length > 0).length}
            </span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            💼 Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobChange(e.target.value)}
            placeholder="Paste the job description here... Include required skills, experience level, and responsibilities."
            style={{
              width: '100%',
              height: '320px',
              padding: '1rem',
              border: `2px solid ${jobDescription.length >= 30 ? '#10b981' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = jobDescription.length >= 30 ? '#10b981' : '#e5e7eb'}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '12px', 
            marginTop: '0.25rem' 
          }}>
            <span style={{ color: jobDescription.length >= 30 ? '#10b981' : '#ef4444' }}>
              {jobDescription.length}/30 characters minimum
            </span>
            <span style={{ color: '#6b7280' }}>
              Words: {jobDescription.split(/\s+/).filter(w => w.length > 0).length}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            🏢 Company / Organization
          </label>
          <select
            value={companyName}
            onChange={(e) => onCompanyChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="unknown">Select Company (Optional)</option>
            <optgroup label="Big Tech">
              {POPULAR_COMPANIES.filter(c => c.category === 'big_tech').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name} ({company.modifier}pts)
                </option>
              ))}
            </optgroup>
            <optgroup label="Unicorns">
              {POPULAR_COMPANIES.filter(c => c.category === 'unicorn').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name} ({company.modifier}pts)
                </option>
              ))}
            </optgroup>
            <optgroup label="Consulting">
              {POPULAR_COMPANIES.filter(c => c.category === 'consulting').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name} ({company.modifier}pts)
                </option>
              ))}
            </optgroup>
            <optgroup label="Startups">
              {POPULAR_COMPANIES.filter(c => c.category === 'startup').map((company) => (
                <option key={company.name} value={company.name.toLowerCase()}>
                  {company.name} (+{company.modifier}pts)
                </option>
              ))}
            </optgroup>
          </select>
          {selectedCompany && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '0.25rem',
              fontStyle: 'italic'
            }}>
              {selectedCompany.description}
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            padding: '0.75rem 2rem',
            background: canSubmit ? getGradientColor(85) : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            minWidth: '140px',
            boxShadow: canSubmit ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (canSubmit) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (canSubmit) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Analyzing...
            </span>
          ) : '🚀 Analyze Match'}
        </button>
      </div>
    </div>
  );
};

// Enhanced Score Display with Animation
interface ScoreDisplayProps {
  score: number;
  label: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  subtitle?: string;
  showProgress?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  label, 
  color, 
  size = 'medium',
  subtitle,
  showProgress = false
}) => {
  const displayColor = color || getScoreColor(score);
  const sizes = {
    small: { font: '18px', padding: '0.75rem' },
    medium: { font: '28px', padding: '1.25rem' },
    large: { font: '42px', padding: '1.5rem' }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: sizes[size].padding,
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {showProgress && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          width: `${Math.min(score, 100)}%`,
          background: getGradientColor(score),
          transition: 'width 1s ease-out'
        }} />
      )}
      <div style={{
        fontSize: sizes[size].font,
        fontWeight: 'bold',
        background: getGradientColor(score),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        animation: size === 'large' ? 'pulse 2s ease-in-out' : 'none'
      }}>
        {Math.round(score)}%
      </div>
      <div style={{
        fontSize: '14px',
        color: '#374151',
        fontWeight: '600',
        marginBottom: subtitle ? '0.25rem' : 0
      }}>
        {label}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

// Advanced Skills Breakdown Component
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

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'programming_languages': '💻',
      'frameworks_libraries': '⚡',
      'databases': '🗄️',
      'cloud_devops': '☁️',
      'soft_skills': '🤝'
    };
    return icons[category] || '📋';
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      'programming_languages': 'Core programming languages and syntax',
      'frameworks_libraries': 'Frameworks, libraries, and development tools',
      'databases': 'Database systems and data storage technologies',
      'cloud_devops': 'Cloud platforms and DevOps infrastructure',
      'soft_skills': 'Leadership, communication, and interpersonal skills'
    };
    return descriptions[category] || 'Technical skills and competencies';
  };

  const getMatchQuality = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'Excellent Match', color: '#059669' };
    if (score >= 75) return { label: 'Strong Match', color: '#10b981' };
    if (score >= 60) return { label: 'Good Match', color: '#f59e0b' };
    if (score >= 40) return { label: 'Partial Match', color: '#f97316' };
    return { label: 'Skills Gap', color: '#ef4444' };
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
          🎯 Skills Analysis
        </h3>
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#374151'
        }}>
          Overall: {Math.round(overallScore)}%
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
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
          const matchQuality = getMatchQuality(skillData.score);
          const impact = skillData.weight * skillData.score;
          
          return (
            <div key={category} style={{
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              backgroundColor: isExpanded ? '#fafafa' : 'white'
            }}>
              <div 
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                onMouseEnter={(e) => {
                  if (!isExpanded) e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '24px' }}>{getCategoryIcon(category)}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#374151', fontSize: '16px' }}>
                        {formatCategoryName(category)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.25rem' }}>
                        {getCategoryDescription(category)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: getScoreColor(skillData.score),
                      fontSize: '18px'
                    }}>
                      {Math.round(skillData.score)}%
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: matchQuality.color,
                      fontWeight: '600'
                    }}>
                      {matchQuality.label}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${Math.min(skillData.score, 100)}%`,
                      height: '100%',
                      background: getGradientColor(skillData.score),
                      transition: 'width 0.8s ease-out',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '12px' }}>
                  <div style={{ color: '#059669' }}>
                    <div style={{ fontWeight: 'bold' }}>Found: {skillData.resume_skills}</div>
                  </div>
                  <div style={{ color: '#dc2626' }}>
                    <div style={{ fontWeight: 'bold' }}>Required: {skillData.job_requirements}</div>
                  </div>
                  <div style={{ color: '#7c3aed' }}>
                    <div style={{ fontWeight: 'bold' }}>Impact: {Math.round(impact)}pts</div>
                    <div style={{ color: '#6b7280' }}>Weight: {Math.round(skillData.weight * 100)}%</div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '12px', 
                  color: '#6b7280',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{isExpanded ? '▲' : '▼'}</span>
                  <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ 
                  padding: '1.25rem', 
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  {skillData.matched_skills && skillData.matched_skills.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem', fontSize: '14px' }}>
                        ✅ Matched Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {skillData.matched_skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '12px',
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
                      <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem', fontSize: '14px' }}>
                        ❌ Missing Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {skillData.missing_skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#fecaca',
                            color: '#991b1b',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '12px',
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

// Enhanced Experience Match Component  
interface ExperienceMatchProps {
  experienceMatch: ExperienceMatch;
}

export const ExperienceMatchComponent: React.FC<ExperienceMatchProps> = ({ experienceMatch }) => {
  const formatLevel = (level: string): string => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getLevelIcon = (level: string): string => {
    const icons: { [key: string]: string } = {
      'entry': '🌱',
      'junior': '👨‍💻',
      'mid': '⚡',
      'senior': '🎯',
      'lead': '👑',
      'principal': '🏆',
      'executive': '💎'
    };
    return icons[level.toLowerCase()] || '👤';
  };

  const getExperienceGap = (): { gap: number; status: string; color: string; message: string } => {
    const gap = experienceMatch.resume_years - experienceMatch.job_years;
    if (gap >= 3) return { 
      gap, 
      status: 'Overqualified', 
      color: '#7c3aed', 
      message: 'Significantly exceeds requirements' 
    };
    if (gap >= 0) return { 
      gap, 
      status: 'Perfect Match', 
      color: '#059669', 
      message: 'Meets or exceeds requirements' 
    };
    if (gap >= -2) return { 
      gap, 
      status: 'Close Match', 
      color: '#f59e0b', 
      message: 'Slightly below requirements' 
    };
    return { 
      gap, 
      status: 'Experience Gap', 
      color: '#dc2626', 
      message: 'Significantly below requirements' 
    };
  };

  const experienceGap = getExperienceGap();
  const confidenceScore = (experienceMatch.confidence || 0.7) * 100;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
        👨‍💼 Experience Analysis
      </h3>
      
      {/* Experience Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderRadius: '12px',
          border: '1px solid #93c5fd',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '0.5rem', 
            right: '0.5rem', 
            fontSize: '24px' 
          }}>
            {getLevelIcon(experienceMatch.resume_level_final)}
          </div>
          <div style={{ fontSize: '14px', color: '#1e40af', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Your Experience
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.5rem' }}>
            {experienceMatch.resume_years} years
          </div>
          <div style={{ fontSize: '16px', color: '#1e40af', fontWeight: '600' }}>
            {formatLevel(experienceMatch.resume_level_final)} Level
          </div>
          {experienceMatch.leadership_keywords > 0 && (
            <div style={{ 
              marginTop: '0.75rem',
              fontSize: '12px',
              color: '#1e40af',
              backgroundColor: 'rgba(30, 64, 175, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              👑 {experienceMatch.leadership_keywords} leadership indicators
            </div>
          )}
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '12px',
          border: '1px solid #86efac',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '0.5rem', 
            right: '0.5rem', 
            fontSize: '24px' 
          }}>
            {getLevelIcon(experienceMatch.job_level)}
          </div>
          <div style={{ fontSize: '14px', color: '#166534', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Job Requirements
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#14532d', marginBottom: '0.5rem' }}>
            {experienceMatch.job_years}+ years
          </div>
          <div style={{ fontSize: '16px', color: '#166534', fontWeight: '600' }}>
            {formatLevel(experienceMatch.job_level)} Level
          </div>
        </div>
      </div>

      {/* Experience Gap Analysis */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>
              Experience Assessment
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '0.25rem' }}>
              {experienceGap.message}
            </div>
          </div>
          <div style={{
            backgroundColor: experienceGap.color,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {experienceGap.status}
          </div>
        </div>

        {/* Visual Experience Bar */}
        <div style={{ position: 'relative', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Job requirement marker */}
          <div style={{
            position: 'absolute',
            left: `${Math.min((experienceMatch.job_years / Math.max(experienceMatch.resume_years, experienceMatch.job_years, 10)) * 100, 100)}%`,
            top: '0',
            height: '100%',
            width: '3px',
            backgroundColor: '#dc2626',
            zIndex: 2
          }} />
          
          {/* Your experience bar */}
          <div style={{
            height: '100%',
            width: `${Math.min((experienceMatch.resume_years / Math.max(experienceMatch.resume_years, experienceMatch.job_years, 10)) * 100, 100)}%`,
            background: getGradientColor(experienceGap.gap >= 0 ? 85 : 45),
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1rem',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'width 1s ease-out'
          }}>
            {experienceMatch.resume_years} years
          </div>
          
          {/* Job requirement label */}
          <div style={{
            position: 'absolute',
            left: `${Math.min((experienceMatch.job_years / Math.max(experienceMatch.resume_years, experienceMatch.job_years, 10)) * 100, 100)}%`,
            top: '-1.5rem',
            fontSize: '10px',
            color: '#dc2626',
            fontWeight: 'bold',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap'
          }}>
            Required: {experienceMatch.job_years}+
          </div>
        </div>
      </div>

      {/* Technical Depth & Confidence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {experienceMatch.technical_depth !== undefined && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '18px' }}>🏗️</span>
              <span style={{ fontSize: '14px', color: '#92400e', fontWeight: 'bold' }}>
                Technical Depth
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e' }}>
              {Math.round(experienceMatch.technical_depth * 100)}%
            </div>
            <div style={{ fontSize: '12px', color: '#92400e', marginTop: '0.25rem' }}>
              Architecture & system design experience
            </div>
          </div>
        )}

        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e0f2fe', 
          borderRadius: '8px',
          border: '1px solid #b3e5fc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <span style={{ fontSize: '14px', color: '#0277bd', fontWeight: 'bold' }}>
              Analysis Confidence
            </span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0277bd' }}>
            {Math.round(confidenceScore)}%
          </div>
          <div style={{ fontSize: '12px', color: '#0277bd', marginTop: '0.25rem' }}>
            Data extraction reliability
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Semantic Analysis Component
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
  const getMethodInfo = (method: string): { icon: string; description: string; color: string } => {
    if (method.includes('semantic')) {
      return {
        icon: '🧠',
        description: 'AI Semantic Understanding',
        color: '#7c3aed'
      };
    }
    if (method.includes('hybrid')) {
      return {
        icon: '⚡',
        description: 'Hybrid Analysis (AI + Statistical)',
        color: '#f59e0b'
      };
    }
    return {
      icon: '📊',
      description: 'Statistical Analysis (TF-IDF)',
      color: '#6b7280'
    };
  };

  const methodInfo = getMethodInfo(method);
  const similarityScore = semanticSimilarity * 100;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
        🔍 Semantic Analysis
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Similarity Score */}
        <div style={{
          padding: '1.5rem',
          background: `linear-gradient(135deg, ${methodInfo.color}20, ${methodInfo.color}10)`,
          borderRadius: '12px',
          border: `1px solid ${methodInfo.color}40`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>{methodInfo.icon}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: methodInfo.color, marginBottom: '0.5rem' }}>
            {Math.round(similarityScore)}%
          </div>
          <div style={{ fontSize: '14px', color: methodInfo.color, fontWeight: '600' }}>
            Semantic Match
          </div>
        </div>

        {/* Analysis Method */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', color: '#374151', fontWeight: 'bold', marginBottom: '1rem' }}>
            Analysis Method
          </div>
          <div style={{ fontSize: '16px', color: methodInfo.color, fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {methodInfo.description}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '1rem' }}>
            Method: {method}
          </div>
          <div style={{
            backgroundColor: confidence >= 0.7 ? '#dcfce7' : confidence >= 0.4 ? '#fef3c7' : '#fecaca',
            color: confidence >= 0.7 ? '#166534' : confidence >= 0.4 ? '#92400e' : '#991b1b',
            padding: '0.5rem',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Confidence: {Math.round(confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        border: '1px solid #cbd5e1'
      }}>
        <div style={{ fontSize: '14px', color: '#475569', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          📋 Analysis Details
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
          {explanation}
        </div>
      </div>
    </div>
  );
};

// AI Insights Component
interface AIInsightsProps {
  results: ScoringResponse;
}

export const AIInsightsComponent: React.FC<AIInsightsProps> = ({ results }) => {
  const generateInsights = (): AnalysisInsight[] => {
    const insights: AnalysisInsight[] = [];
    
    // Skills insights
    let totalSkillsFound = 0;
    let totalSkillsRequired = 0;
    let weakestCategory = '';
    let weakestScore = 100;
    
    Object.entries(results.skills_breakdown).forEach(([category, data]) => {
      const skillData = data as any;
      totalSkillsFound += skillData.resume_skills;
      totalSkillsRequired += skillData.job_requirements;
      
      if (skillData.score < weakestScore) {
        weakestScore = skillData.score;
        weakestCategory = category.replace(/_/g, ' ');
      }
    });

    // Generate insights based on analysis
    if (results.final_score >= 80) {
      insights.push({
        type: 'strength',
        title: 'Excellent Match! 🎉',
        description: 'Your profile is a strong match for this position. You exceed most requirements.',
        impact: 'high'
      });
    } else if (results.final_score >= 60) {
      insights.push({
        type: 'suggestion',
        title: 'Good Foundation 👍',
        description: 'Solid match with room for improvement in specific areas.',
        impact: 'medium'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Skills Gap Identified ⚠️',
        description: 'Significant gaps exist. Focus on developing key missing skills.',
        impact: 'high'
      });
    }

    // Weakest category insight
    if (weakestScore < 60) {
      insights.push({
        type: 'weakness',
        title: `Improve ${weakestCategory.charAt(0).toUpperCase() + weakestCategory.slice(1)}`,
        description: `Your ${weakestCategory} skills scored ${Math.round(weakestScore)}%. This is a key area for development.`,
        impact: 'high'
      });
    }

    // Experience insights
    const expGap = results.experience_match.resume_years - results.experience_match.job_years;
    if (expGap < -2) {
      insights.push({
        type: 'suggestion',
        title: 'Experience Enhancement',
        description: `Consider highlighting transferable skills to bridge the ${Math.abs(expGap)}-year experience gap.`,
        impact: 'medium'
      });
    }

    // Leadership insights
    if (results.experience_match.leadership_keywords > 0) {
      insights.push({
        type: 'strength',
        title: 'Leadership Experience Detected 👑',
        description: `Found ${results.experience_match.leadership_keywords} leadership indicators. This is valuable for senior roles.`,
        impact: 'medium'
      });
    }

    // Company-specific insights
    if (results.company_modifier < 0) {
      insights.push({
        type: 'suggestion',
        title: 'Competitive Environment',
        description: `This company has high hiring standards. Ensure your application highlights exceptional achievements.`,
        impact: 'medium'
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const insights = generateInsights();

  const getInsightIcon = (type: AnalysisInsight['type']): string => {
    const icons = {
      strength: '💪',
      weakness: '🔍',
      suggestion: '💡',
      warning: '⚠️'
    };
    return icons[type];
  };

  const getInsightColor = (type: AnalysisInsight['type']): string => {
    const colors = {
      strength: '#059669',
      weakness: '#dc2626',
      suggestion: '#0ea5e9',
      warning: '#f59e0b'
    };
    return colors[type];
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
        🤖 AI-Powered Insights
      </h3>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {insights.map((insight, index) => (
          <div key={index} style={{
            padding: '1.25rem',
            backgroundColor: `${getInsightColor(insight.type)}08`,
            border: `1px solid ${getInsightColor(insight.type)}20`,
            borderRadius: '12px',
            borderLeft: `4px solid ${getInsightColor(insight.type)}`
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '20px', marginTop: '0.125rem' }}>
                {getInsightIcon(insight.type)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: getInsightColor(insight.type), 
                  marginBottom: '0.5rem',
                  fontSize: '15px'
                }}>
                  {insight.title}
                </div>
                <div style={{ 
                  color: '#374151', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {insight.description}
                </div>
              </div>
              <div style={{
                backgroundColor: getInsightColor(insight.type),
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
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

// Enhanced Main Results Component
interface ResultsDisplayProps {
  results: ScoringResponse;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes slideDown {
            from { max-height: 0; opacity: 0; }
            to { max-height: 500px; opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Hero Score Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '24px', opacity: 0.9 }}>
            Resume Match Analysis Complete! 🎯
          </h2>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {Math.round(results.final_score)}%
          </div>
          <div style={{ fontSize: '18px', opacity: 0.9, marginBottom: '1rem' }}>
            Final Match Score
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
            {results.explanation}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <ScoreDisplay 
          score={results.overall_score} 
          label="Base Score" 
          subtitle="Before adjustments"
          showProgress={true}
        />
        <ScoreDisplay 
          score={results.semantic_similarity * 100} 
          label="Semantic Match" 
          subtitle="AI understanding"
          showProgress={true}
        />
        <ScoreDisplay 
          score={results.company_modifier + 50} 
          label="Company Factor" 
          subtitle={results.company_modifier >= 0 ? 'Bonus applied' : 'Standards applied'}
          color={results.company_modifier >= 0 ? '#10b981' : '#f59e0b'}
          showProgress={true}
        />
        <ScoreDisplay 
          score={(results.breakdown?.confidence || 0.7) * 100} 
          label="Confidence" 
          subtitle="Analysis reliability"
          showProgress={true}
        />
      </div>

      {/* Detailed Analysis Grid */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        <SkillsBreakdownComponent 
          skillsBreakdown={results.skills_breakdown} 
          overallScore={results.overall_score}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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

// Enhanced Loading Component
export const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem',
    flexDirection: 'column',
    gap: '1.5rem'
  }}>
    <div style={{ position: 'relative' }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '20px'
      }}>
        🧠
      </div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#374151', fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        AI Analysis in Progress...
      </div>
      <div style={{ color: '#6b7280', fontSize: '14px' }}>
        Analyzing semantic similarity, skills match, and experience alignment
      </div>
    </div>
  </div>
);

// Enhanced Error Component
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div style={{
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '1rem 0'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <span style={{ fontSize: '24px' }}>🚨</span>
      <div>
        <strong style={{ color: '#dc2626', fontSize: '16px' }}>Analysis Failed</strong>
        <div style={{ color: '#7f1d1d', fontSize: '14px', marginTop: '0.25rem' }}>
          {error}
        </div>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
      >
        🔄 Try Again
      </button>
    )}
  </div>
);