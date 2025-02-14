import { blogPosts } from './blog'

export const siteConfig = {
  title: "LIFE OF AB",
  description: "Personal website of Abiodun (AB) Soneye",
  author: "Abiodun Soneye",
  email: "Soneyebiodun@gmail.com",
  socialLinks: {
    github: "https://github.com/Abiodun12",
    linkedin: "https://www.linkedin.com/in/abiodun-ab-soneye-1b7a80290/"
  },
  about: {
    name: "Abiodun (AB) Soneye",
    role: "Tech Enthusiast & Lifelong Learner",
    bio: "Tech enthusiast, lifelong learner, and adventurer navigating the exciting intersections of technology, creativity, and life.",
    interests: [
      "Venture Capital",
      "Startups",
      "AI",
      "Technology for Small Businesses",
      "Community Impact"
    ],
    hobbies: [
      "Music",
      "Concerts",
      "Hanging out with friends",
      "Planning next big moves"
    ]
  },
  projects: [
    {
      name: "Smart Pet Plus",
      description: "AI-powered pet recognition and story generation app",
      link: "/smart-pet-plus",
      status: "live",
      tech: ["Python", "Flask", "Azure CV", "DeepSeek AI", "HTML/CSS"]
    },
    {
      name: "Personal Website",
      description: "A terminal-style portfolio website built with Next.js",
      link: "https://github.com/Abiodun12/my-personal-website",
      status: "live",
      tech: ["Next.js", "TypeScript", "React"]
    },
    {
      name: "Coming Soon",
      description: "More exciting projects in development",
      link: "/coming-soon",
      status: "in-progress",
      tech: ["TBA"]
    }
  ],
  blogPosts,
} 