import React, { useState } from 'react';
import { ScoringResponse, LoadingState } from './types';
import { scoreResume, ApiError } from './api';
import { 
  InputForm, 
  ResultsDisplay, 
  LoadingSpinner, 
  ErrorDisplay 
} from './components';

const App: React.FC = () => {
  // Form state
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('unknown');
  
  // Results and loading state
  const [results, setResults] = useState<ScoringResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  // Demo mode state
  const [showDemoData, setShowDemoData] = useState(false);

  // Demo data for showcasing features
  const demoResume = `Senior Software Engineer with 8 years of professional experience in full-stack development. Led cross-functional teams of 12+ developers and architected microservices systems serving 2M+ daily users.

TECHNICAL EXPERTISE:
• Programming Languages: Python (expert), JavaScript/TypeScript (advanced), Java (intermediate), Go (learning)
• Frameworks & Libraries: React, Angular, Django, Flask, FastAPI, Spring Boot, Express.js
• Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, Apache Cassandra
• Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, Terraform, Jenkins CI/CD
• Architecture: Microservices, Event-driven architecture, RESTful APIs, GraphQL

LEADERSHIP & ACHIEVEMENTS:
• Mentored 15+ junior developers and conducted technical interviews
• Designed and implemented scalable architecture supporting 10x traffic growth
• Led migration from monolith to microservices, reducing deployment time by 75%
• Established engineering best practices including code review processes and automated testing
• Managed technical roadmap for $50M revenue product line

EXPERIENCE HIGHLIGHTS:
• Built real-time analytics platform processing 1TB+ daily data
• Optimized database queries reducing response time from 2s to 200ms
• Implemented machine learning recommendation system increasing user engagement by 40%
• Developed automated deployment pipeline reducing release cycle from weeks to hours`;

  const demoJob = `We are seeking a Senior Software Engineer to join our high-growth fintech startup. You'll be responsible for building scalable backend systems and leading technical initiatives.

REQUIREMENTS:
• 5+ years of software engineering experience
• Expert-level Python and JavaScript/TypeScript skills
• Experience with React, Django/Flask, and modern web frameworks
• Strong database experience (PostgreSQL, MongoDB preferred)
• AWS cloud platform experience required
• Docker and Kubernetes containerization experience
• Previous experience with microservices architecture
• Leadership experience mentoring junior developers

RESPONSIBILITIES:
• Design and implement scalable backend APIs serving millions of users
• Lead technical architecture decisions and system design
• Mentor team members and conduct code reviews
• Collaborate with product and design teams on feature development
• Establish engineering best practices and development workflows
• Work with DevOps on CI/CD pipelines and deployment automation

PREFERRED QUALIFICATIONS:
• Experience in fintech or high-scale consumer applications
• Knowledge of machine learning and data analytics
• Open source contributions
• System design and performance optimization experience

We offer competitive salary, equity, and the opportunity to shape the technical direction of a fast-growing company.`;

  const loadDemoData = () => {
    setResumeText(demoResume);
    setJobDescription(demoJob);
    setCompanyName('apple');
    setShowDemoData(true);
  };

  const clearDemoData = () => {
    setResumeText('');
    setJobDescription('');
    setCompanyName('unknown');
    setShowDemoData(false);
    setResults(null);
    setLoadingState({ isLoading: false, error: null });
  };

  const handleSubmit = async () => {
    // Validation
    if (resumeText.length < 50) {
      setLoadingState({ isLoading: false, error: 'Resume text must be at least 50 characters long.' });
      return;
    }
    
    if (jobDescription.length < 30) {
      setLoadingState({ isLoading: false, error: 'Job description must be at least 30 characters long.' });
      return;
    }

    // Start loading
    setLoadingState({ isLoading: true, error: null });
    setResults(null);

    try {
      const response = await scoreResume({
        resume_text: resumeText,
        job_description: jobDescription,
        company_name: companyName === 'unknown' ? 'unknown' : companyName
      });

      setResults(response);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      
      if (error instanceof ApiError) {
        if (error.status === 0) {
          errorMessage = 'Cannot connect to the scoring service. Please check your connection.';
        } else if (error.status === 400) {
          errorMessage = error.message;
        } else if (error.status >= 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  };

  const handleRetry = () => {
    setLoadingState({ isLoading: false, error: null });
  };

  const clearResults = () => {
    setResults(null);
    setLoadingState({ isLoading: false, error: null });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          .apple-glass {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
          }
          
          .apple-shadow {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          }
          
          .apple-shadow-large {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
          }
          
          .apple-button {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .apple-button:hover {
            transform: translateY(-1px);
          }
          
          .apple-button:active {
            transform: translateY(0);
          }
        `}
      </style>

      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '0 max(1rem, env(safe-area-inset-left))'
      }}>
        <div style={{
          maxWidth: '980px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1D1D1F'
          }}>
            Resume Scorer
          </div>
          
          {!showDemoData ? (
            <button
              onClick={loadDemoData}
              className="apple-button"
              style={{
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Try Demo
            </button>
          ) : (
            <button
              onClick={clearDemoData}
              className="apple-button"
              style={{
                backgroundColor: '#FF3B30',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Clear Demo
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '80px 1rem 60px',
        maxWidth: '980px',
        margin: '0 auto',
        animation: 'fadeInUp 0.8s ease-out'
      }}>

        
        <p style={{
          fontSize: '21px',
          fontWeight: '400',
          color: '#86868B',
          margin: '0 auto 40px',
          maxWidth: '600px',
          lineHeight: '1.4'
        }}>

        </p>

        {/* Performance Indicators */}
       
      </section>

      {/* Main Content */}
      <main style={{
        maxWidth: '980px',
        margin: '0 auto',
        padding: '0 1rem 80px'
      }}>
        {/* Input Section */}
        <section 
          className="apple-glass apple-shadow-large"
          style={{
            borderRadius: '18px',
            padding: '40px',
            marginBottom: '40px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}
        >
          {showDemoData && (
            <div style={{
              backgroundColor: '#E3F2FD',
              border: '1px solid #BBDEFB',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#1976D2',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Demo Mode • Senior Software Engineer Profile Loaded
              </div>
            </div>
          )}
          
          <InputForm
            resumeText={resumeText}
            jobDescription={jobDescription}
            companyName={companyName}
            onResumeChange={setResumeText}
            onJobChange={setJobDescription}
            onCompanyChange={setCompanyName}
            onSubmit={handleSubmit}
            isLoading={loadingState.isLoading}
          />
        </section>

        {/* Error Display */}
        {loadingState.error && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <ErrorDisplay 
              error={loadingState.error} 
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Loading State */}
        {loadingState.isLoading && (
          <section 
            className="apple-glass apple-shadow"
            style={{
              borderRadius: '18px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.5s ease-out'
            }}
          >
            <LoadingSpinner />
          </section>
        )}

        {/* Results Section */}
        {results && !loadingState.isLoading && (
          <section 
            className="apple-glass apple-shadow-large"
            style={{
              borderRadius: '18px',
              padding: '40px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            {/* Results Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1D1D1F',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.01em'
                }}>
                  Analysis Complete
                </h2>
                <p style={{
                  fontSize: '17px',
                  color: '#86868B',
                  margin: 0,
                  fontWeight: '400'
                }}>
                  Comprehensive insights based on advanced AI analysis
                </p>
              </div>
              
              <button
                onClick={clearResults}
                className="apple-button"
                style={{
                  backgroundColor: '#F2F2F7',
                  color: '#1D1D1F',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '12px 20px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E5EA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F2F2F7';
                }}
              >
                New Analysis
              </button>
            </div>
            
            <ResultsDisplay results={results} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        padding: '40px 1rem'
      }}>
        <div style={{
          maxWidth: '980px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1D1D1F',
                margin: '0 0 8px 0'
              }}>
                Advanced AI
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#86868B',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Powered by state-of-the-art language models and semantic understanding
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1D1D1F',
                margin: '0 0 8px 0'
              }}>
                Industry Intelligence
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#86868B',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Company-specific insights and hiring standards across tech, consulting, and startups
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1D1D1F',
                margin: '0 0 8px 0'
              }}>
                Actionable Insights
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#86868B',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Detailed skill gap analysis and personalized improvement recommendations
              </p>
            </div>
          </div>
          
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            fontSize: '12px',
            color: '#86868B'
          }}>
            Built with precision and attention to detail
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;