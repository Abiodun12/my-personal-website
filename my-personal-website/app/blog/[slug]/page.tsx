'use client'

import React from 'react'
import { Terminal } from '../../../components/Terminal'
import { TerminalLink } from '../../../components/TerminalLink'
import { blogPosts } from '../../../config/blog'
import { notFound, useParams } from 'next/navigation'

const blogContent: { [key: string]: string } = {
  'welcome-to-my-corner': `
# Welcome to My Corner of the Internet

Published on: January 17, 2025

Life is a journey filled with opportunities to learn, grow, and create. Here's to embracing every moment with curiosity and optimism.

Tech has always been a passion of mine—its endless possibilities and power to change the world inspire me daily. Through this blog, I hope to share my journey, insights, and love for the world of technology.

Life is beautiful when we lean into our passions and open ourselves to growth. Here's to celebrating the little wins, the challenges that shape us, and the adventures that await.

Welcome to my corner of the internet.
  `
}

export default function BlogPost() {
  const params = useParams()
  const slug = params?.slug as string

  const post = blogPosts.find((p) => p.slug === slug)
  const content = blogContent[slug]

  if (!slug || !post || !content) {
    return notFound()
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>$ cat {post.title}.md</Terminal>
      <Terminal>
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }} 
        />
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/blog">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}

function formatContent(content: string) {
  return content
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^\- (.*$)/gm, '• $1<br>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/`{3}(\w+)?\n([\s\S]*?)\n`{3}/g, (_, lang, code) => 
      `<pre><code>${code}</code></pre>`
    )
} 