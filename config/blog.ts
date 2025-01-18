export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  url: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'welcome-to-my-corner',
    title: 'Welcome to My Corner of the Internet',
    date: '2024-01-18',
    description: 'Life is a journey filled with opportunities to learn, grow, and create.',
    url: '/blog/welcome-to-my-corner'
  }
  // Add more blog posts here as needed
] 