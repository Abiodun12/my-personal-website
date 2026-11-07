'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cursor } from './Cursor'
import { CommandMenu } from './CommandMenu'
import { ParticleEffects } from './ParticleEffects'
import { SiteCommands } from './SiteCommands'

interface CommandEntry {
  command: string
  output: React.ReactNode
}

interface InteractiveTerminalProps {
  initialOutput?: React.ReactNode
  prompt?: string
}

const ROUTES: Record<string, string> = {
  about: '/about',
  projects: '/projects',
  blog: '/blog',
  contact: '/contact',
}

export function InteractiveTerminal({
  initialOutput,
  prompt = '$',
}: InteractiveTerminalProps) {
  const router = useRouter()
  const [history, setHistory] = useState<CommandEntry[]>([])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [triggerParticles, setTriggerParticles] = useState(false)
  const [effectsEnabled, setEffectsEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEffectsEnabled(!reduce && !coarse && !narrow)
    if (finePointer && !narrow) {
      inputRef.current?.focus()
    }
  }, [])

  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    const command = cmd.split(/\s+/)[0].toLowerCase()
    setCommandHistory((prev) => [...prev, cmd])
    if (effectsEnabled) setTriggerParticles((prev) => !prev)

    if (command === 'clear') {
      setHistory([])
      setInput('')
      setHistoryIndex(-1)
      return
    }

    if (ROUTES[command]) {
      router.push(ROUTES[command])
      return
    }

    const output = command === 'help'
      ? <SiteCommands />
      : `Command not found: ${command}. Type 'help' for available commands.`

    setHistory((prev) => [...prev, { command: cmd, output }])
    setInput('')
    setHistoryIndex(-1)
  }

  useEffect(() => {
    if (history.length === 0) return
    inputRef.current?.scrollIntoView({ block: 'nearest' })
  }, [history])

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      runCommand(input)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.length === 0) return
      const newIndex = historyIndex < 0
        ? commandHistory.length - 1
        : Math.max(historyIndex - 1, 0)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex < 0) return
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
    }
  }

  const menuCommands = [
    { key: 'ABOUT', description: 'Learn more about me', action: () => router.push('/about') },
    { key: 'PROJECTS', description: 'View my portfolio', action: () => router.push('/projects') },
    { key: 'BLOG', description: 'Read my thoughts', action: () => router.push('/blog') },
    { key: 'CONTACT', description: 'How to reach me', action: () => router.push('/contact') },
    { key: 'CLEAR', description: 'Clear terminal', action: () => runCommand('clear') },
  ]

  return (
    <div className="interactive-terminal">
      <CommandMenu commands={menuCommands} />
      <ParticleEffects
        enabled={effectsEnabled}
        trigger={triggerParticles}
        lowPerformanceMode={!effectsEnabled}
        maxParticles={15}
      />

      {initialOutput && <div className="terminal-initial">{initialOutput}</div>}

      {history.map((entry, index) => (
        <div key={`${entry.command}-${index}`} className="terminal-entry">
          <div className="terminal-command">
            {prompt} {entry.command}
          </div>
          {entry.output && <div className="terminal-response">{entry.output}</div>}
        </div>
      ))}

      <div className="terminal-input-line">
        <label htmlFor="terminal-command" className="sr-only">Terminal command</label>
        <span aria-hidden="true">{prompt} </span>
        <input
          id="terminal-command"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onInputKeyDown}
          className="terminal-input"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="go"
        />
        <Cursor animated={effectsEnabled} />
      </div>
    </div>
  )
}
