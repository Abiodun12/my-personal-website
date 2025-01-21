export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

// This will be populated at build time
export const blogPosts: BlogPost[] = [
  {
    slug: 'embracing-change-and-ai',
    title: 'Embracing Change and AI',
    date: '2025-01-20',
    description: 'Reflecting on changes, both personal and technological, as we move forward into an exciting future.',
    content: `# Embracing Change and AI

Published on: January 20, 2025

Wow, what a day! Today marked the inauguration of Donald Trump back into office. The next four years are sure to be interesting, and I can only hope that the changes ahead help me reach—and even exceed—my goals. This next year is especially critical for me, and I'm excited to see all the amazing things I'll achieve.

On another note, I've been learning so much while building this website. Thanks to AI, I've added a bunch of new features today. It's incredible how this technology has transformed my life. Growing up, I was always fascinated by AI, especially in movies. Now, seeing it become a reality is mind-blowing!

I'm so excited for what the future holds—for myself, for technology, and for the world. Here's to continued growth and endless possibilities!`
  },
  {
    slug: 'welcome-to-my-corner',
    title: 'Welcome to My Corner of the Internet',
    date: '2025-01-18',
    description: 'Life is a journey filled with opportunities to learn, grow, and create.',
    content: `# Welcome to My Corner of the Internet

Published on: January 18, 2025

Life is a journey filled with opportunities to learn, grow, and create. Here's to embracing every moment with curiosity and optimism.

Tech has always been a passion of mine—its endless possibilities and power to change the world inspire me daily. Through this blog, I hope to share my journey, insights, and love for the world of technology.

Life is beautiful when we lean into our passions and open ourselves to growth. Here's to celebrating the little wins, the challenges that shape us, and the adventures that await.

Welcome to my corner of the internet.`
  }
] 