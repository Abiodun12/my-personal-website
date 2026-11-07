import type { Metadata } from 'next'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { SOCIAL_LINKS } from '../../config/shared-content'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach Abiodun (AB) Soneye.',
}

const LINKS = [
  { href: SOCIAL_LINKS.LINKEDIN, label: 'LINKEDIN' },
  { href: SOCIAL_LINKS.GITHUB, label: 'GITHUB' },
  { href: SOCIAL_LINKS.RESUME, label: 'RESUME' },
  { href: SOCIAL_LINKS.EMAIL, label: 'EMAIL' },
]

export default function ContactPage() {
  return (
    <main>
      <Terminal maxHeight="none">
        cat contact.txt
        <Cursor />
      </Terminal>
      <Terminal autoScroll={false} maxHeight="none">
        <h1>Connect with me</h1>
        <div className="terminal-contact">
          {LINKS.map((link) => (
            <TerminalLink
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            >
              {link.label}
            </TerminalLink>
          ))}
        </div>
      </Terminal>
      <Terminal maxHeight="none">
        <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}
