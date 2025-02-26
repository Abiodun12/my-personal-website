'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ErrorHandler from '../../components/ErrorHandler';

export default function SmartPetPlus() {
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      console.log('Submitting image URL:', imageUrl);
      
      // For mobile, use a more robust validation pattern
      if (isMobile) {
        // Simple URL validation
        if (!imageUrl.match(/^https?:\/\/.+\..+/)) {
          throw new Error('Please enter a valid image URL starting with http:// or https://');
        }
      }
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }
      
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return (
    <div className="container">
      <h1>Smart Pet Plus</h1>
      <p>Enter an image URL of a pet to analyze it:</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/pet-image.jpg"
          className="image-input"
          required
        />
        <button type="submit" disabled={loading} className="analyze-button">
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      
      {error && (
        <ErrorHandler 
          error={{ message: error }} 
          reset={resetError} 
        />
      )}
      
      {analysis && (
        <div className="results">
          <h2>Analysis Results:</h2>
          <div className="image-container">
            <img 
              src={imageUrl} 
              alt="Pet" 
              style={{ maxWidth: '100%', maxHeight: '300px' }} 
            />
          </div>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
      
      <style jsx>{`
        .container {
          padding: 1rem;
        }
        .image-input {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid var(--text-color);
          background: rgba(0, 0, 0, 0.5);
          color: var(--text-color);
        }
        .analyze-button {
          background: var(--text-color);
          color: var(--background-color);
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        .results {
          margin-top: 2rem;
        }
        .image-container {
          margin: 1rem 0;
        }
        pre {
          background: rgba(0, 0, 0, 0.5);
          padding: 1rem;
          overflow-x: auto;
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
} 