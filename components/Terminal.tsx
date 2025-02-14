'use client'
import React, { useRef, useEffect } from 'react'

interface TerminalProps {
  children: React.ReactNode;
  autoScroll?: boolean;
  maxHeight?: string;
}

export function Terminal({ 
  children, 
  autoScroll = true,
  maxHeight = '70vh' 
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

  // Add touch event handling for better mobile scrolling
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const scrollTop = terminal.scrollTop;
      
      // Prevent default only when scrolling would be ineffective
      if ((scrollTop <= 0 && touchY > touchStartY) || 
          (scrollTop >= terminal.scrollHeight - terminal.clientHeight && touchY < touchStartY)) {
        e.preventDefault();
      }
    };

    terminal.addEventListener('touchstart', handleTouchStart);
    terminal.addEventListener('touchmove', handleTouchMove);

    return () => {
      terminal.removeEventListener('touchstart', handleTouchStart);
      terminal.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div 
      className="terminal-output" 
      ref={terminalRef}
      style={{
        maxHeight,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: 'clamp(0.5rem, 2vw, 1rem)',
      }}
    >
      {children}
    </div>
  );
} 