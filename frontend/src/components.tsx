import React from 'react';
import { ScoringResponse, SkillsBreakdown, ExperienceMatch, Company } from './types';

// Utility function for score color
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

// Popular companies data
export const POPULAR_COMPANIES: Company[] = [
  { name: 'Google', category: 'big_tech' },
  { name: 'Meta', category: 'big_tech' },
  { name: 'Amazon', category: 'big_tech' },
  { name: 'Apple', category: 'big_tech' },
  { name: 'Microsoft', category: 'big_tech' },
  { name: 'Netflix', category: 'big_tech' },
  { name: 'Uber', category: 'unicorn' },
  { name: 'Airbnb', category: 'unicorn' },
  { name: 'Stripe', category: 'unicorn' },
  { name: 'Startup', category: 'startup' },
  { name: 'Early-stage', category: 'startup' },
  { name: 'McKinsey', category: 'consulting' },
  { name: 'BCG', category: 'consulting' },
  { name: 'Bain', category: 'consulting' },
  { name: 'Deloitte', category: 'consulting' },
  { name: 'Accenture', category: 'consulting' },
];

// Input Form Component
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
  const canSubmit = resumeText.length >= 50 && jobDescription.length >= 30 && !isLoading;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => onResumeChange(e.target.value)}
            placeholder="Paste your resume content here..."
            style={{
              width: '100%',
              height: '300px',
              padding: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <div style={{ fontSize: '12px', color: resumeText.length >= 50 ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
            {resumeText.length}/50 characters minimum
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobChange(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: '100%',
              height: '300px',
              padding: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <div style={{ fontSize: '12px', color: jobDescription.length >= 30 ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
            {jobDescription.length}/30 characters minimum
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
            Company Name
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
            }}
          >
            <option value="unknown">Select Company (Optional)</option>
            {POPULAR_COMPANIES.map((company) => (
              <option key={company.name} value={company.name.toLowerCase()}>
                {company.name} ({company.category.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: canSubmit ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            minWidth: '120px',
          }}
          onMouseEnter={(e) => {
            if (canSubmit) e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            if (canSubmit) e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          {isLoading ? 'Analyzing...' : 'Score Resume'}
        </button>
      </div>
    </div>
  );
};

// Score Display Component
interface ScoreDisplayProps {
  score: number;
  label: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  label, 
  color, 
  size = 'medium' 
}) => {
  const displayColor = color || getScoreColor(score);
  const sizes = {
    small: { font: '18px', padding: '0.75rem' },
    medium: { font: '24px', padding: '1rem' },
    large: { font: '36px', padding: '1.5rem' }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: sizes[size].padding,
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        fontSize: sizes[size].font,
        fontWeight: 'bold',
        color: displayColor,
        marginBottom: '0.5rem'
      }}>
        {Math.round(score)}%
      </div>
      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  );
};

// Skills Breakdown Component
interface SkillsBreakdownProps {
  skillsBreakdown: SkillsBreakdown;
}

export const SkillsBreakdownComponent: React.FC<SkillsBreakdownProps> = ({ skillsBreakdown }) => {
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

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '18px' }}>Skills Breakdown</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Object.entries(skillsBreakdown).map(([category, data]) => {
          // Type assertion to ensure data has the correct structure
          const skillData = data as {
            resume_skills: number;
            job_requirements: number;
            score: number;
            weight: number;
          };
          
          return (
          <div key={category} style={{
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '20px' }}>{getCategoryIcon(category)}</span>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>
                  {formatCategoryName(category)}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  backgroundColor: '#e5e7eb', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  color: '#6b7280'
                }}>
                  Weight: {Math.round(skillData.weight * 100)}%
                </span>
              </div>
              <span style={{ 
                fontWeight: 'bold', 
                color: getScoreColor(skillData.score),
                fontSize: '16px'
              }}>
                {Math.round(skillData.score)}%
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: `${Math.min(skillData.score, 100)}%`,
                height: '100%',
                backgroundColor: getScoreColor(skillData.score),
                transition: 'width 0.5s ease',
                borderRadius: '4px'
              }} />
            </div>
            
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Resume: {skillData.resume_skills} skills | Required: {skillData.job_requirements} skills
            </div>
          </div>
        );
        }
        )};
      </div>
    </div>
  );
};

// Experience Match Component
interface ExperienceMatchProps {
  experienceMatch: ExperienceMatch;
}

export const ExperienceMatchComponent: React.FC<ExperienceMatchProps> = ({ experienceMatch }) => {
  const formatLevel = (level: string): string => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '18px' }}>Experience Analysis</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #e0f2fe'
        }}>
          <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Your Experience
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '0.25rem' }}>
            {experienceMatch.resume_years} years
          </div>
          <div style={{ fontSize: '14px', color: '#0369a1' }}>
            Level: {formatLevel(experienceMatch.resume_level_final)}
          </div>
        </div>

        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0fdf4', 
          borderRadius: '8px',
          border: '1px solid #dcfce7'
        }}>
          <div style={{ fontSize: '14px', color: '#166534', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Job Requirements
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#14532d', marginBottom: '0.25rem' }}>
            {experienceMatch.job_years} years
          </div>
          <div style={{ fontSize: '14px', color: '#166534' }}>
            Level: {formatLevel(experienceMatch.job_level)}
          </div>
        </div>
      </div>

      {experienceMatch.leadership_keywords > 0 && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '18px' }}>👑</span>
          <span style={{ fontSize: '14px', color: '#92400e' }}>
            <strong>Leadership Experience:</strong> {experienceMatch.leadership_keywords} indicators found
          </span>
        </div>
      )}
    </div>
  );
};

// Main Results Component
interface ResultsDisplayProps {
  results: ScoringResponse;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      {/* Main Scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <ScoreDisplay 
          score={results.final_score} 
          label="Final Score" 
          size="large"
        />
        <ScoreDisplay 
          score={results.overall_score} 
          label="Base Score" 
          size="medium"
        />
        <ScoreDisplay 
          score={results.semantic_similarity * 100} 
          label="Semantic Match" 
          size="medium"
        />
        <ScoreDisplay 
          score={results.company_modifier} 
          label="Company Adjustment" 
          size="medium"
          color={results.company_modifier >= 0 ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Explanation */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          <strong>Analysis:</strong> {results.explanation}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <SkillsBreakdownComponent skillsBreakdown={results.skills_breakdown} />
        <ExperienceMatchComponent experienceMatch={results.experience_match} />
      </div>
    </div>
  );
};

// Loading Component
export const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    <div style={{ color: '#6b7280', fontSize: '16px' }}>
      Analyzing resume and job match...
    </div>
  </div>
);

// Error Component
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div style={{
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '20px' }}>⚠️</span>
      <strong style={{ color: '#dc2626' }}>Error</strong>
    </div>
    <div style={{ color: '#7f1d1d', marginBottom: onRetry ? '1rem' : 0 }}>
      {error}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Try Again
      </button>
    )}
  </div>
);