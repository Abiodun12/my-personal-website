'use client'

import React, { useState, useEffect } from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'
import { blogPosts } from '../../config/blog'
import { trackPageView } from '../../lib/db'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal autoScroll={false}>
        $ ls blog/
        <Cursor />
      </Terminal>

      <Terminal autoScroll={false} maxHeight="none">
        {filteredPosts.map((post, index) => (
          <React.Fragment key={post.slug}>
            <div style={{ marginBottom: '1rem' }}>
              <TerminalLink href={`/blog/${post.slug}`}>{post.title}</TerminalLink>
              <br />
              <span style={{ color: '#666' }}>Published: {post.date}</span>
              <br />
              {post.description}
            </div>
            {index < filteredPosts.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Terminal>

      <Terminal autoScroll={false}>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 