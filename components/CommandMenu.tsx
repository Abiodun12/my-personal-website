'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Command {
  key: string
  description: string
  action: () => void
}

interface CommandMenuProps {
  commands: Command[]
}

export function CommandMenu({ commands }: CommandMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isVisible) return

    closeRef.current?.focus()

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) return
      setIsVisible(false)
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isVisible])

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="command-menu-toggle"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label="Toggle command menu"
        aria-expanded={isVisible}
        aria-controls="command-menu"
      >
        $&gt;
      </button>

      {isVisible && (
        <div
          id="command-menu"
          ref={menuRef}
          className="command-menu visible"
          role="menu"
        >
          <div className="command-menu-header">
            <span>Available Commands</span>
            <button
              ref={closeRef}
              type="button"
              className="command-menu-close"
              onClick={() => {
                setIsVisible(false)
                toggleRef.current?.focus()
              }}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {commands.map((cmd) => (
            <button
              key={cmd.key}
              type="button"
              className="command-item"
              role="menuitem"
              onClick={() => {
                cmd.action()
                setIsVisible(false)
              }}
            >
              <span className="command-key">{cmd.key}</span>
              <span className="command-desc">{cmd.description}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
