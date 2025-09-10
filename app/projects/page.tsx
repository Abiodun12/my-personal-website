'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { Cursor } from '../../components/Cursor'
import { TerminalLink } from '../../components/TerminalLink'
import { siteConfig } from '../../config'

export default function ProjectsPage() {
  return (
    <main>
      <Terminal maxHeight="none">
        $ ls /projects
        <Cursor />
      </Terminal>

      {siteConfig.projects.map((project, index) => (
        <Terminal key={index} autoScroll={false} maxHeight="none">
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: project.status === 'live' ? '#00ff00' : '#ffbd2e' }}>
              {project.status === 'live' ? '🟢' : '🟡'}
            </span>{' '}
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-link"
            >
              {project.name}
            </a>
            <br />
            <span style={{ marginLeft: '20px' }}>{project.description}</span>
            <br />
            <span style={{ color: '#666', marginLeft: '20px' }}>
              Tech Stack: {project.tech?.join(', ')}
            </span>
          </div>
        </Terminal>
      ))}

      <Terminal maxHeight="none">
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 
