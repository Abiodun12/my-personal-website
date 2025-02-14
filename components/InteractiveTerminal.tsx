'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Cursor } from './Cursor'
import { TerminalLink } from './TerminalLink'

interface Command {
  command: string;
  output: React.ReactNode;
}

interface InteractiveTerminalProps {
  initialOutput?: React.ReactNode;
  prompt?: string;
}

type CommandFunction = () => React.ReactNode | void;

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
        >CONTACT</span>  : How to reach me
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
    )
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = '';

    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, cmd]);
    }

    if (trimmedCmd in commands) {
      const result = commands[trimmedCmd]();
      output = result || `Executed: ${trimmedCmd}`;
    } else if (trimmedCmd) {
      output = `Command not found: ${trimmedCmd}. Type 'help' for available commands.`;
    }

    if (trimmedCmd) {
      setHistory(prev => [...prev, { command: cmd, output }]);
    }
    setInput('');
    setHistoryIndex(-1);
  };

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
      className="interactive-terminal"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
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
        <Cursor />
      </div>
    </div>
  );
} 