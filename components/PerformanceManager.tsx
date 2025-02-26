'use client'
import { useEffect } from 'react'
import { usePreferences } from './UserPreferencesProvider'

export function PerformanceManager() {
  const { preferences, loading } = usePreferences();
  
  useEffect(() => {
    if (loading) return;
    
    const isDesktop = window.innerWidth >= 1024 || 
      navigator.userAgent.includes('Windows') || 
      navigator.userAgent.includes('Mac');
    
    if (isDesktop && preferences.performanceMode) {
      document.body.classList.add('desktop-mode');
      
      // Disable CSS animations for better performance
      const style = document.createElement('style');
      style.innerHTML = `
        @media (min-width: 1024px) {
          .desktop-mode * {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
          
          .desktop-mode .particles-container {
            display: ${preferences.particlesEnabled ? 'block' : 'none'} !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Reduce DOM operations
      if (preferences.performanceMode) {
        const reduceDOMOperations = () => {
          // Throttle scroll events
          let scrollTimeout: number | undefined;
          const originalScroll = window.addEventListener;
          window.addEventListener = function(type, listener, options) {
            if (type === 'scroll') {
              return originalScroll.call(this, type, (e) => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                  listener(e);
                }, 100);
              }, options);
            }
            return originalScroll.call(this, type, listener, options);
          };
          
          // Reduce animation frames
          const originalRAF = window.requestAnimationFrame;
          let lastRAFTime = 0;
          window.requestAnimationFrame = function(callback) {
            const now = Date.now();
            if (now - lastRAFTime < 50) { // Only allow 20fps max
              return setTimeout(() => callback(now), 50);
            }
            lastRAFTime = now;
            return originalRAF(callback);
          };
        };
        
        reduceDOMOperations();
      }
    }
  }, [loading, preferences]);
  
  return null;
} 