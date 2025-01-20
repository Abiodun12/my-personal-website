'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { blogPosts } from '../../config/blog'

export default function BlogPage() {
  return (
    <div className="main-container">
      <Terminal>
        $ ls blog/
        <Cursor />
      </Terminal>
      <Terminal>
        {blogPosts.map((post, index) => (
          <React.Fragment key={post.slug}>
            <div className="blog-entry">
              <TerminalLink href={post.url}>{post.title}</TerminalLink>
              <br />
              <span style={{ color: '#666' }}>{post.date}</span>
              <br />
              {post.description}
            </div>
            {index < blogPosts.length - 1 && <br /><br />}
          </React.Fragment>
        ))}
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </div>
  )
} 