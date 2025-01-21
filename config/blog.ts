import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
}

const blogDirectory = path.join(process.cwd(), 'content/blog')

export function getBlogPosts() {
  const posts = fs.readdirSync(blogDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '')
      const fullPath = path.join(blogDirectory, file)
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Extract metadata from content
      const title = content.match(/# (.*)\n/)?.[1] || ''
      const date = content.match(/Published on: (.*)\n/)?.[1] || ''
      const firstParagraph = content.split('\n\n')[2] || ''

      return {
        slug,
        title,
        date,
        description: firstParagraph,
        content
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export const blogPosts = getBlogPosts() 