'use client'
import React, { useState, useEffect, useRef } from 'react'

interface Command {
  key: string;
  description: string;
  action: () => void;
}

interface CommandMenuProps {
  commands: Command[];
}

export function CommandMenu({ commands }: CommandMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  
  const toggleMenu = () => {
    setIsVisible(prev => !prev);
  };
  
  const handleCommand = (action: () => void) => {
    action();
    setIsVisible(false);
  };
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current && 
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button 
        ref={toggleRef}
        className="command-menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle command menu"
        aria-expanded={isVisible}
        aria-controls="command-menu"
      >
        $&gt;
      </button>
      
      <div 
        id="command-menu"
        ref={menuRef}
        className={`command-menu ${isVisible ? 'visible' : ''}`}
        role="menu"
        aria-hidden={!isVisible}
      >
        <div className="command-menu-header">
          <span>Available Commands</span>
          <span 
            className="command-menu-close" 
            onClick={() => setIsVisible(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          >
            ×
          </span>
        </div>
        
        {commands.map((cmd, index) => (
          <div 
            key={index} 
            className="command-item"
            onClick={() => handleCommand(cmd.action)}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCommand(cmd.action);
              }
            }}
          >
            <span className="command-key">{cmd.key}</span>
            <span className="command-desc">{cmd.description}</span>
          </div>
        ))}
      </div>
    </>
  );
} 