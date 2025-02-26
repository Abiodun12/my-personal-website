'use client'
import React, { useEffect, useState } from 'react'

interface CursorProps {
  animated?: boolean;
}

export function Cursor({ animated = true }: CursorProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!mounted) {
    return null;
  }

  // Simplified cursor for reduced motion preference
  if (prefersReducedMotion || !animated) {
    return <span className="cursor" style={{ 
      animation: 'none',
      opacity: 1,
      boxShadow: 'none'
    }}>_</span>;
  }

  // Enhanced animated cursor
  return <span className="cursor" aria-hidden="true" />;
} 