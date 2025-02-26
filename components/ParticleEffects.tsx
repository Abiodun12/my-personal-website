'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'

interface ParticleEffectsProps {
  enabled?: boolean;
  trigger?: boolean;
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

export function ParticleEffects({ enabled = true, trigger = false }: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Create particles on trigger or command
  const createParticles = useCallback((x?: number, y?: number) => {
    if (!enabled || prefersReducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Default to center if no position provided
    const centerX = x ?? container.clientWidth / 2;
    const centerY = y ?? container.clientHeight / 2;
    
    const newParticles: Particle[] = [];
    const particleCount = Math.min(15, window.innerWidth > 768 ? 15 : 8);
    
    for (let i = 0; i < particleCount; i++) {
      const direction = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const maxLife = 30 + Math.random() * 30;
      
      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        size: 1 + Math.random() * 3,
        speed,
        life: 0,
        maxLife,
        direction
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, [enabled, prefersReducedMotion]);
  
  // Handle mouse/touch events to create particles
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const handleClick = (e: MouseEvent | TouchEvent) => {
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
  
  // Create particles on trigger prop change
  useEffect(() => {
    if (trigger) {
      createParticles();
    }
  }, [trigger, createParticles]);
  
  // Animate particles
  useEffect(() => {
    if (!enabled || prefersReducedMotion || particles.length === 0) return;
    
    const animate = () => {
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
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, enabled, prefersReducedMotion]);
  
  if (!enabled || prefersReducedMotion) {
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
              filter: `blur(${particle.size / 3}px)`
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
} 