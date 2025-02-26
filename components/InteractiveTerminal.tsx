'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Cursor } from './Cursor'
import { TerminalLink } from './TerminalLink'
import { CommandMenu } from './CommandMenu'
import { ParticleEffects } from './ParticleEffects'
import { usePreferences } from './UserPreferencesProvider'

// More aggressive desktop detection with performance defaults
const isDesktop = typeof window !== 'undefined' && (
  window.innerWidth >= 1024 || 
  navigator.userAgent.includes('Windows') || 
  navigator.userAgent.includes('Mac')
);
const defaultPerformanceMode = isDesktop ? 
  (process.env.NEXT_PUBLIC_DESKTOP_PERFORMANCE_DEFAULT === 'max' ? 'max' : 'high') : 
  'standard';

interface Command {
  command: string;
  output: React.ReactNode;
}

interface InteractiveTerminalProps {
  initialOutput?: React.ReactNode;
  prompt?: string;
}

type CommandFunction = (args?: string) => React.ReactNode;

interface CommandMap {
  [key: string]: CommandFunction;
}

export function InteractiveTerminal({ 
  initialOutput,
  prompt = "$"
}: InteractiveTerminalProps) {
  const { preferences, savePreferences, loading } = usePreferences();
  
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [triggerParticles, setTriggerParticles] = useState(false);
  
  // Use preferences from context once loaded
  const [effectsEnabled, setEffectsEnabled] = useState(!isDesktop);
  const [particlesEnabled, setParticlesEnabled] = useState(!isDesktop);
  const [performanceMode, setPerformanceMode] = useState(isDesktop);
  
  // Sync state with preferences once loaded
  useEffect(() => {
    if (!loading) {
      setEffectsEnabled(preferences.effectsEnabled);
      setParticlesEnabled(preferences.particlesEnabled);
      setPerformanceMode(preferences.performanceMode);
    }
  }, [preferences, loading]);
  
  // Save changes to preferences
  const updatePreferences = useCallback((
    effects?: boolean, 
    particles?: boolean, 
    performance?: boolean
  ) => {
    const updatedPrefs: any = {};
    
    if (effects !== undefined) {
      setEffectsEnabled(effects);
      updatedPrefs.effectsEnabled = effects;
    }
    
    if (particles !== undefined) {
      setParticlesEnabled(particles);
      updatedPrefs.particlesEnabled = particles;
    }
    
    if (performance !== undefined) {
      setPerformanceMode(performance);
      updatedPrefs.performanceMode = performance;
    }
    
    savePreferences(updatedPrefs);
  }, [savePreferences]);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const commands: CommandMap = {
    help: () => (
      <div className="terminal-help">
        Available Commands:<br/><br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleNavigation('/about')}
        >ABOUT</span>    : Learn more about me<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleNavigation('/projects')}
        >PROJECTS</span> : View my portfolio<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleNavigation('/blog')}
        >BLOG</span>     : Read my thoughts<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => {
            setHistory([]);
            setInput('');
          }}
        >CLEAR</span>    : Clear terminal<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleCommand('contact')}
        >CONTACT</span>  : How to reach me<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleCommand('effects ' + (effectsEnabled ? 'off' : 'on'))}
        >EFFECTS {effectsEnabled ? 'OFF' : 'ON'}</span> : Toggle visual effects<br/>
        {'>'}  <span 
          className="terminal-link"
          onClick={() => handleCommand('performance standard')}
        >PERFORMANCE</span> : Adjust performance (standard|high|max)
      </div>
    ),
    about: () => {
      window.location.href = '/about';
      return 'Redirecting to about page...';
    },
    projects: () => {
      window.location.href = '/projects';
      return 'Redirecting to projects page...';
    },
    blog: () => {
      window.location.href = '/blog';
      return 'Redirecting to blog page...';
    },
    clear: () => {
      setHistory([]);
      return null;
    },
    effects: (args = '') => {
      if (args.trim().toLowerCase() === 'off') {
        updatePreferences(false);
        return 'Visual effects disabled';
      } else if (args.trim().toLowerCase() === 'on') {
        updatePreferences(true);
        return 'Visual effects enabled';
      }
      return `Usage: effects on|off (currently ${effectsEnabled ? 'on' : 'off'})`;
    },
    contact: () => (
      <div className="terminal-contact">
        CONNECT WITH ME:<br/><br/>
        <TerminalLink href="https://www.linkedin.com/in/abiodun-ab-soneye-1b7a80290/" target="_blank">
          LINKEDIN
        </TerminalLink><br/>
        <TerminalLink href="https://github.com/Abiodun12" target="_blank">
          GITHUB
        </TerminalLink><br/>
        <TerminalLink href="https://docs.google.com/document/d/1kh85MMIonwwWGMQ3kyEpyTTHlMxjWuiW46uZf1jMBJs/edit?usp=sharing" target="_blank">
          RESUME
        </TerminalLink><br/>
        <TerminalLink href="mailto:Soneyebiodun@gmail.com">
          EMAIL
        </TerminalLink>
      </div>
    ),
    performance: (args = '') => {
      if (args.trim().toLowerCase() === 'high') {
        updatePreferences(undefined, undefined, true);
        return 'Performance mode enabled - reduces visual effects for better performance';
      } else if (args.trim().toLowerCase() === 'max') {
        updatePreferences(false, false, true);
        return 'Maximum performance mode enabled - most visual effects disabled';
      } else if (args.trim().toLowerCase() === 'standard') {
        updatePreferences(true, true, false);
        return 'Standard mode enabled - full visual effects';
      }
      return `Usage: performance standard|high|max (currently ${
        !effectsEnabled ? 'max' : performanceMode ? 'high' : 'standard'
      })`;
    },
    particles: (args = '') => {
      if (args.trim().toLowerCase() === 'off') {
        updatePreferences(undefined, false);
        return 'Particles disabled';
      } else if (args.trim().toLowerCase() === 'on') {
        updatePreferences(undefined, true);
        return 'Particles enabled';
      }
      return `Usage: particles on|off (currently ${particlesEnabled ? 'on' : 'off'})`;
    }
  };

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    let output: React.ReactNode = '';

    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd]);
      
      if (effectsEnabled && (!performanceMode || command === 'performance')) {
        setTriggerParticles(prev => !prev);
      }
    }

    if (command in commands) {
      if (command === 'effects' || command === 'performance' || command === 'particles') {
        output = commands[command](args);
      } else {
        const result = commands[command]();
        output = result !== undefined ? result : `Executed: ${command}`;
      }
    } else if (cmd.trim()) {
      output = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    if (cmd.trim()) {
      setHistory(prev => [...prev, { command: cmd, output }]);
    }
    setInput('');
    setHistoryIndex(-1);
  }, [effectsEnabled, performanceMode, commands]);

  const menuCommands = [
    { 
      key: 'ABOUT', 
      description: 'Learn more about me', 
      action: () => handleNavigation('/about')
    },
    { 
      key: 'PROJECTS', 
      description: 'View my portfolio', 
      action: () => handleNavigation('/projects')
    },
    { 
      key: 'BLOG', 
      description: 'Read my thoughts', 
      action: () => handleNavigation('/blog')
    },
    { 
      key: 'CONTACT', 
      description: 'How to reach me', 
      action: () => handleCommand('contact')
    },
    { 
      key: 'CLEAR', 
      description: 'Clear terminal', 
      action: () => handleCommand('clear')
    },
    { 
      key: 'EFFECTS ' + (effectsEnabled ? 'OFF' : 'ON'), 
      description: 'Toggle visual effects', 
      action: () => handleCommand('effects ' + (effectsEnabled ? 'off' : 'on'))
    },
    { 
      key: 'PERFORMANCE MODE', 
      description: performanceMode ? 'Switch to standard mode' : 'Enable high performance mode',
      action: () => handleCommand(`performance ${performanceMode ? 'standard' : 'high'}`)
    },
    { 
      key: 'PARTICLES ' + (particlesEnabled ? 'OFF' : 'ON'), 
      description: 'Toggle particles', 
      action: () => handleCommand('particles ' + (particlesEnabled ? 'off' : 'on'))
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex >= 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandHistory, historyIndex]);

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div 
      className={`interactive-terminal ${performanceMode ? 'performance-mode' : ''}`}
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      <CommandMenu commands={menuCommands} />
      
      <ParticleEffects 
        enabled={effectsEnabled && particlesEnabled} 
        trigger={triggerParticles} 
        lowPerformanceMode={performanceMode}
        {...{maxParticles: isDesktop ? 3 : 15} as any}
      />
      
      <div 
        className="performance-toggle"
        onClick={() => updatePreferences(undefined, undefined, !performanceMode)}
        role="button"
        tabIndex={0}
        aria-label={`${performanceMode ? 'Disable' : 'Enable'} performance mode`}
      >
        {performanceMode ? '🚀 Performance Mode' : '✨ Standard Mode'}
      </div>
      
      <div 
        className="particles-toggle"
        onClick={() => updatePreferences(undefined, !particlesEnabled)}
        style={{ 
          position: 'fixed', 
          bottom: '40px', 
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'var(--text-color)',
          padding: '5px 10px',
          fontSize: '12px',
          zIndex: 1000,
          cursor: 'pointer',
          border: '1px solid var(--text-color)',
          opacity: 0.6,
          transition: 'opacity 0.2s'
        }}
      >
        {particlesEnabled ? '✨ Particles On' : '🚫 Particles Off'}
      </div>
      
      {initialOutput && <div className="terminal-initial">{initialOutput}</div>}
      
      {history.map((entry, i) => (
        <div key={i} className="terminal-entry">
          <div className="terminal-command">
            {prompt} {entry.command}
          </div>
          {entry.output && (
            <div className="terminal-response">{entry.output}</div>
          )}
        </div>
      ))}
      
      <div className="terminal-input-line">
        {prompt}{' '}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(input);
            }
          }}
          className="terminal-input"
          autoFocus
          spellCheck="false"
          aria-label="Terminal input"
        />
        <Cursor animated={effectsEnabled} />
      </div>
    </div>
  );
} 