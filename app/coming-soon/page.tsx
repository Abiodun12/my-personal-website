import type { Metadata } from 'next'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'More projects are on the way.',
}

export default function ComingSoonPage() {
  return (
    <main>
      <Terminal maxHeight="none">
        <h1 className="sr-only">Coming soon</h1>
        cat coming-soon.txt
        <Cursor />
      </Terminal>
      <Terminal maxHeight="none">
        🚧 Under Construction 🚧
        <br /><br />
        Exciting features in development:
        <br />
        - Blog posts about tech and personal growth
        <br />
        - Project showcases and demos
        <br />
        - Interactive terminal features
        <br />
        - And much more!
      </Terminal>
      <Terminal maxHeight="none">
        <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 