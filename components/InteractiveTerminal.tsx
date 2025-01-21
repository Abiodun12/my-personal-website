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

  const commands: CommandMap = {
    help: () => (
      <>
        Available Commands:<br/>
        - <TerminalLink href="/about">ABOUT</TerminalLink>: Learn more about me<br/>
        - <TerminalLink href="/projects">PROJECTS</TerminalLink>: View my portfolio<br/>
        - <TerminalLink href="/blog">BLOG</TerminalLink>: Read my thoughts<br/>
        - <TerminalLink href="#" onClick={() => commands.clear()}>CLEAR</TerminalLink>: Clear terminal<br/>
        - <TerminalLink href="#" onClick={() => commands.contact()}>CONTACT</TerminalLink>: How to reach me
      </>
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
      return 'Terminal cleared';
    },
    contact: () => (
      <div className="terminal-contact">
        CONNECT WITH ME:<br/><br/>
        <TerminalLink 
          href="https://linkedin.com/in/abiodun-ab-soneye" 
          target="_blank"
          rel="noopener noreferrer"
          className="terminal-contact-link"
        >
          LINKEDIN
        </TerminalLink><br/>
        <TerminalLink 
          href="https://github.com/Abiodun12" 
          target="_blank"
          rel="noopener noreferrer"
          className="terminal-contact-link"
        >
          GITHUB
        </TerminalLink><br/>
        <TerminalLink 
          href="https://bit.ly/abiodun-resume" 
          target="_blank"
          rel="noopener noreferrer"
          className="terminal-contact-link"
        >
          RESUME
        </TerminalLink><br/>
        <TerminalLink 
          href="mailto:Soneyebiodun@gmail.com"
          className="terminal-contact-link"
        >
          EMAIL
        </TerminalLink>
      </div>
    )
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = '';

    if (trimmedCmd in commands) {
      const result = commands[trimmedCmd]();
      output = result || `Executing command: ${trimmedCmd}`;
    } else if (trimmedCmd) {
      output = `Command not found: ${trimmedCmd}. Type 'help' for available commands.`;
    }

    if (trimmedCmd) {
      setHistory(prev => [...prev, { command: cmd, output }]);
    }
    setInput('');
  };

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
        />
        <Cursor />
      </div>
    </div>
  );
} 