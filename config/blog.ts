export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
}

// This will be populated at build time
export const blogPosts: BlogPost[] = [] 