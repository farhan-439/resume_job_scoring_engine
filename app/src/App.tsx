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
          errorMessage = 'Cannot connect to the scoring service. Please ensure the API server is running on the correct port.';
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
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 0.5rem 0'
          }}>
            Resume Job Scorer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            margin: 0
          }}>
            Get AI-powered insights on how well your resume matches job requirements
          </p>
        </header>

        {/* Main Content */}
        <main>
          {/* Input Form */}
          <section style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
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
            <ErrorDisplay 
              error={loadingState.error} 
              onRetry={handleRetry}
            />
          )}

          {/* Loading Spinner */}
          {loadingState.isLoading && (
            <section style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <LoadingSpinner />
            </section>
          )}

          {/* Results Display */}
          {results && !loadingState.isLoading && (
            <section style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: 0 
                }}>
                  Scoring Results
                </h2>
                <button
                  onClick={clearResults}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
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
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            Powered by advanced NLP and machine learning algorithms
          </p>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            💡 Tip: For best results, include specific skills and quantifiable achievements in your resume
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;