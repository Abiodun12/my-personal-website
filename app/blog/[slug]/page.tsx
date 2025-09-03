import React from 'react'
import { Terminal } from '../../../components/Terminal'
import { TerminalLink } from '../../../components/TerminalLink'
import { notFound } from 'next/navigation'
import { blogPosts } from '../../../config/blog'
import { BlogLikeButton } from '../../../components/BlogLikeButton'
import type { Metadata } from 'next'

interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Blog - ${params.slug}`,
  }
}

export const revalidate = 3600; // Revalidate every hour

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>$ cat {post.title}.md</Terminal>
      <Terminal>
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} 
        />
      </Terminal>
      
      {/* Add the like button */}
      <Terminal>
        <BlogLikeButton postSlug={params.slug} />
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
    .replace(/^- (.*$)/gm, '• $1<br>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => 
      `<pre><code class="${lang}">${code}</code></pre>`
    )
} 