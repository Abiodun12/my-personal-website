'use client'

import React, { useEffect, useState } from 'react'
import { Terminal } from '../../components/Terminal'
import { Cursor } from '../../components/Cursor'
import { TerminalLink } from '../../components/TerminalLink'
import { siteConfig } from '../../config'

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main>
      <Terminal>
        $ ls /projects
        <Cursor />
      </Terminal>

      {siteConfig.projects.map((project, index) => (
        <Terminal key={index}>
          {project.status === 'live' ? '🟢' : '🟡'} {' '}
          <a 
            href={project.link} 
            target={project.link.startsWith('http') ? "_blank" : undefined}
            rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}
            className="terminal-link"
          >
            {project.name}
          </a>
          {' '}- {project.description}
          <br />
          <span style={{ color: '#666' }}>Tech: {project.tech.join(', ')}</span>
        </Terminal>
      ))}

      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}
