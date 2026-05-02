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
      name: "Founder of Cuppa",
      description: "Founder of Cuppa",
      link: "https://trycuppa.app/",
      status: "live",
      tech: ["Startup", "Product"]
    },
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
      name: "Matrix Bot V1 Showcase",
      description: "Live-tested CLOB execution infrastructure showcase for prediction markets",
      link: "https://github.com/Abiodun12/matrix-bot-v1-showcase",
      status: "live",
      tech: ["Go", "Prediction Markets", "CLOB"]
    },
    {
      name: "Mini Cursor Hackathon - 2nd Place",
      description: "2nd place project from the Mini Cursor Hackathon",
      link: "https://github.com/Abiodun12/mini-cursor-hackathon-2nd-place",
      status: "live",
      tech: ["HTML"]
    },
    {
      name: "MCDC Benthany House Project",
      description: "MCDC Project",
      link: "https://github.com/Abiodun12/MCDC_Benthany_House_Project",
      status: "live",
      tech: ["Python"]
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
