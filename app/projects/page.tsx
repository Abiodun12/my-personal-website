import type { Metadata } from 'next'
import { Terminal } from '../../components/Terminal'
import { Cursor } from '../../components/Cursor'
import { TerminalLink } from '../../components/TerminalLink'
import { siteConfig } from '../../config'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Abiodun (AB) Soneye.',
}

export default function ProjectsPage() {
  return (
    <main>
      <Terminal maxHeight="none">
        <h1 className="sr-only">Projects</h1>
        ls /projects
        <Cursor />
      </Terminal>

      {siteConfig.projects.map((project, index) => {
        const external = /^https?:\/\//.test(project.link)
        return (
          <Terminal key={index} autoScroll={false} maxHeight="none">
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: project.status === 'live' ? '#00ff00' : '#ffbd2e' }}>
                <span aria-hidden="true">{project.status === 'live' ? '🟢' : '🟡'}</span>
                <span className="sr-only">{project.status === 'live' ? 'Live' : 'In progress'}</span>
              </span>{' '}
              {external ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
                >
                  {project.name}
                </a>
              ) : (
                <TerminalLink href={project.link}>{project.name}</TerminalLink>
              )}
              <br />
              <span style={{ marginLeft: '20px' }}>{project.description}</span>
              <br />
              <span className="dim" style={{ marginLeft: '20px' }}>
                Tech Stack: {project.tech?.join(', ')}
              </span>
            </div>
          </Terminal>
        )
      })}

      <Terminal maxHeight="none">
        <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}
