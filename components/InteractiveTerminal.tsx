'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Cursor } from './Cursor'
import { TerminalLink } from './TerminalLink'
import { CommandMenu } from './CommandMenu'
import { ParticleEffects } from './ParticleEffects'

const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

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
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [triggerParticles, setTriggerParticles] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(isDesktop);

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
        setEffectsEnabled(false);
        return 'Visual effects disabled';
      } else if (args.trim().toLowerCase() === 'on') {
        setEffectsEnabled(true);
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
        setPerformanceMode(true);
        return 'Performance mode enabled - reduces visual effects for better performance';
      } else if (args.trim().toLowerCase() === 'max') {
        setPerformanceMode(true);
        setEffectsEnabled(false);
        return 'Maximum performance mode enabled - most visual effects disabled';
      } else if (args.trim().toLowerCase() === 'standard') {
        setPerformanceMode(false);
        setEffectsEnabled(true);
        return 'Standard mode enabled - full visual effects';
      }
      return `Usage: performance standard|high|max (currently ${
        !effectsEnabled ? 'max' : performanceMode ? 'high' : 'standard'
      })`;
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
      if (command === 'effects' || command === 'performance') {
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
        enabled={effectsEnabled} 
        trigger={triggerParticles} 
        lowPerformanceMode={performanceMode}
      />
      
      <div 
        className="performance-toggle"
        onClick={() => setPerformanceMode(prev => !prev)}
        role="button"
        tabIndex={0}
        aria-label={`${performanceMode ? 'Disable' : 'Enable'} performance mode`}
      >
        {performanceMode ? '🚀 Performance Mode' : '✨ Standard Mode'}
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