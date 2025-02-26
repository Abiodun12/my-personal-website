'use client'
import React, { useEffect, useState, useRef, useCallback, memo } from 'react'

export interface ParticleEffectsProps {
  enabled?: boolean;
  trigger?: boolean;
  lowPerformanceMode?: boolean;
  maxParticles?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  life: number;
  maxLife: number;
  direction: number;
}

// Memoize the component to prevent unnecessary re-renders
export const ParticleEffects = memo(({ 
  enabled = true, 
  trigger = false,
  lowPerformanceMode = false,
  maxParticles = 15
}: ParticleEffectsProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const FPS_LIMIT = lowPerformanceMode ? 20 : 30; // Even lower FPS for performance mode
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Create particles on trigger or command - optimized
  const createParticles = useCallback((x?: number, y?: number) => {
    if (!enabled || prefersReducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Default to center if no position provided
    const centerX = x ?? container.clientWidth / 2;
    const centerY = y ?? container.clientHeight / 2;
    
    const newParticles: Particle[] = [];
    // Reduce particle count on lower performance mode
    const particleCount = Math.min(
      maxParticles,
      lowPerformanceMode ? 3 : (window.innerWidth > 768 ? 8 : 5)
    );
    
    for (let i = 0; i < particleCount; i++) {
      const direction = Math.random() * Math.PI * 2;
      const speed = lowPerformanceMode ? 1 + Math.random() * 2 : 1 + Math.random() * 3;
      const maxLife = lowPerformanceMode ? 15 + Math.random() * 10 : 20 + Math.random() * 20;
      
      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        size: 1 + Math.random() * 2,
        speed,
        life: 0,
        maxLife,
        direction
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, [enabled, prefersReducedMotion, lowPerformanceMode, maxParticles]);
  
  // Optimize mouse/touch events with throttling
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    let isThrottled = false;
    
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (isThrottled) return;
      
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 200);
      
      let x, y;
      
      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else {
        // Touch event
        const touch = e.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      }
      
      // Get position relative to container
      const rect = container.getBoundingClientRect();
      x = x - rect.left;
      y = y - rect.top;
      
      createParticles(x, y);
    };
    
    container.addEventListener('click', handleClick);
    
    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [enabled, prefersReducedMotion, createParticles]);
  
  // Create particles on trigger prop change - with throttling
  useEffect(() => {
    if (trigger && !isNaN(+trigger)) {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 100) { // Throttle to max 10 triggers per second
        createParticles();
        lastUpdateTimeRef.current = now;
      }
    }
  }, [trigger, createParticles]);
  
  // Animate particles with frame limiting
  useEffect(() => {
    if (!enabled || prefersReducedMotion || particles.length === 0) return;
    
    const animate = (timestamp: number) => {
      // Limit frame rate for better performance
      if (timestamp - lastUpdateTimeRef.current >= 1000 / FPS_LIMIT) {
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + Math.cos(p.direction) * p.speed,
              y: p.y + Math.sin(p.direction) * p.speed,
              life: p.life + 1
            }))
            .filter(p => p.life < p.maxLife)
        );
        
        lastUpdateTimeRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, enabled, prefersReducedMotion]);
  
  if (!enabled || prefersReducedMotion || particles.length === 0) {
    return null;
  }
  
  return (
    <div ref={containerRef} className="particles-container">
      {particles.map(particle => {
        const opacity = 1 - (particle.life / particle.maxLife);
        
        return (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity,
              transform: `scale(${1 - particle.life / particle.maxLife})`,
              filter: lowPerformanceMode ? 'none' : `blur(${particle.size / 3}px)`,
              willChange: 'transform, opacity'
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
});

ParticleEffects.displayName = 'ParticleEffects'; 