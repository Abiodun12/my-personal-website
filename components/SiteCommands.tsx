import Link from 'next/link'

export const SITE_COMMANDS = [
  { href: '/about', command: 'ABOUT', description: 'Learn more about me' },
  { href: '/projects', command: 'PROJECTS', description: 'View my portfolio' },
  { href: '/blog', command: 'BLOG', description: 'Read my thoughts' },
  { href: '/contact', command: 'CONTACT', description: 'How to reach me' },
] as const

export function SiteCommands() {
  return (
    <nav className="terminal-help" aria-label="Available commands">
      Available Commands:
      <ul>
        {SITE_COMMANDS.map((item) => (
          <li key={item.href}>
            <span aria-hidden="true">{'>'}</span>{'  '}
            <Link href={item.href} className="command-link">{item.command}</Link>
            {' '}: {item.description}
          </li>
        ))}
      </ul>
    </nav>
  )
}
