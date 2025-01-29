'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Cursor } from './Cursor'
import { TerminalLink } from './TerminalLink'
import { useRouter } from 'next/navigation'

interface Command {
  command: string;
  output: React.ReactNode;
}

interface InteractiveTerminalProps {
  initialOutput?: React.ReactNode;
  prompt?: string;
}

type CommandHandler = () => React.ReactNode;

export function InteractiveTerminal({ 
  initialOutput,
  prompt = "$"
}: InteractiveTerminalProps) {
  const router = useRouter();
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const commands = useMemo(() => {
    return {
      help: () => (
        <div className="terminal-help">
          Available commands:<br/>
          - help: Show this help<br/>
          - about: About me<br/>
          - projects: My projects<br/>
          - blog: Read my blog<br/>
          - clear: Clear terminal<br/>
          - contact: Contact info<br/>
          - weather: Show weather status
        </div>
      ),
      about: () => {
        router.push('/about');
        return 'Redirecting to about page...';
      },
      projects: () => {
        router.push('/projects');
        return 'Redirecting to projects page...';
      },
      blog: () => {
        router.push('/blog');
        return 'Redirecting to blog page...';
      },
      clear: () => {
        setHistory([]);
        return null;
      },
      contact: () => (
        <div className="terminal-contact">
          CONNECT WITH ME:<br/><br/>
          <TerminalLink href="https://linkedin.com/in/abiodun-ab-soneye" target="_blank">
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
      weather: () => 'Current weather: Sunny 25°C'
    } as { [key: string]: CommandHandler };
  }, [router]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = '';

    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, cmd]);
    }

    if (trimmedCmd in commands) {
      output = commands[trimmedCmd]();
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