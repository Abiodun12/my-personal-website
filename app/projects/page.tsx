'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { Cursor } from '../../components/Cursor'
import { TerminalLink } from '../../components/TerminalLink'
import { siteConfig } from '../../config'

export default function ProjectsPage() {
  return (
    <main>
      <Terminal>
        $ ls /projects
        <Cursor />
      </Terminal>

      {siteConfig.projects.map((project, index) => (
        <Terminal key={index}>
          {project.name}
          <br />
          {project.description}
          <br />
          {project.link && (
            <>
              <TerminalLink href={project.link}>View Project</TerminalLink>
              <br />
            </>
          )}
        </Terminal>
      ))}

      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 