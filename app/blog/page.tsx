'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { blogPosts } from '../../config/blog'

export default function BlogPage() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>$ ls blog/</Terminal>
      <Terminal>
        Available posts:
        {blogPosts.map((post) => (
          <React.Fragment key={post.slug}>
            <br />
            - <TerminalLink href={post.url}>{post.title}</TerminalLink> ({post.date})
            <br />
            &nbsp;&nbsp;{post.description}
          </React.Fragment>
        ))}
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 