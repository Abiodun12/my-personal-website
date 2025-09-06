'use client'

import { useEffect } from 'react'

export default function KeepAliveClient() {
  // Keep alive ping for Render API
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://my-personal-website-t7tw.onrender.com'
    const healthUrl = base.endsWith('/health') ? base : `${base.replace(/\/$/, '')}/health`
    const pingRender = () => {
      // Make a request to your health endpoint
      fetch(healthUrl, { 
        method: 'GET',
        // Use no-cors to avoid CORS issues with the OPTIONS preflight
        mode: 'no-cors'
      }).catch(err => console.log('Ping error (expected):', err.message));
    };

    // Ping immediately
    pingRender();
    
    // Set up interval for every 5 minutes
    const interval = setInterval(pingRender, 5 * 60 * 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything
  return null;
} 
