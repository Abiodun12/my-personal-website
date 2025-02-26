'use client'
import React from 'react'

interface ErrorHandlerProps {
  error: any;
  reset: () => void;
}

export default function ErrorHandler({ error, reset }: ErrorHandlerProps) {
  console.error('Application error:', error);
  
  const errorMessage = 
    error?.message && typeof error.message === 'string' 
      ? error.message
      : 'An unknown error occurred';
  
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <div className="error-details">
        {errorMessage}
      </div>
      <button onClick={reset} className="retry-button">
        Try Again
      </button>
      <style jsx>{`
        .error-container {
          padding: 1rem;
          border: 1px solid var(--text-color);
          border-radius: 4px;
          margin: 1rem 0;
          background: rgba(0, 0, 0, 0.7);
        }
        .error-details {
          margin: 1rem 0;
          color: #ff6b6b;
          word-break: break-word;
        }
        .retry-button {
          background: var(--text-color);
          color: var(--background-color);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
} 