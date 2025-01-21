'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { getBlogPosts } from '../../utils/blog'

export default async function BlogPage() {
  const posts = getBlogPosts()

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>
        $ ls blog/
        <Cursor />
      </Terminal>

      <Terminal>
        {posts.map((post, index) => (
          <React.Fragment key={post.slug}>
            <div style={{ marginBottom: '1rem' }}>
              <TerminalLink href={`/blog/${post.slug}`}>{post.title}</TerminalLink>
              <br />
              <span style={{ color: '#666' }}>Published: {post.date}</span>
              <br />
              {post.description}
            </div>
            {index < posts.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Terminal>

      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 