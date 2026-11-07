'use client'

import React, { useEffect } from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { blogPosts } from '../../config/blog'
import { trackPageView } from '../../lib/db'

export default function BlogPage() {
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Compact header command on mobile/any */}
      <Terminal autoScroll={false} maxHeight="none">
        <h1 className="sr-only">Blog</h1>
        ls blog/
        <Cursor />
      </Terminal>

      <Terminal autoScroll={false} maxHeight="none">
        {blogPosts.map((post, index) => (
          <React.Fragment key={post.slug}>
            <div style={{ marginBottom: '1rem' }}>
              <TerminalLink href={`/blog/${post.slug}`}>{post.title}</TerminalLink>
              <br />
              <span className="dim">Published: {post.date}</span>
              <br />
              {post.description}
            </div>
            {index < blogPosts.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Terminal>

      {/* Compact footer nav */}
      <Terminal autoScroll={false} maxHeight="none">
        <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}
