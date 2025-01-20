'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { blogPosts } from '../../config/blog'

export default function BlogPage() {
  return (
    <Terminal>
      <div className="terminal-content">
        <div className="terminal-section">
          $ ls blog/
          <Cursor />
        </div>

        <div className="terminal-section">
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
        </div>

        <div className="terminal-section">
          $ <TerminalLink href="/">cd ..</TerminalLink>
        </div>
      </div>
    </Terminal>
  )
} 