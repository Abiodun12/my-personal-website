import { blogPosts } from './blog'

export const siteConfig = {
  name: 'AB',
  title: 'LIFE OF ABIODUN',
  bio: `I'm a software developer passionate about creating elegant solutions to complex problems.
  I specialize in web development and enjoy working with modern technologies like React and Node.js.
  In my free time, I contribute to open-source projects and explore new programming paradigms.`,

  projects: [
    {
      name: 'Project 1',
      description: 'A brief description of Project 1',
      link: '/projects/project1',
    },
    {
      name: 'Project 2',
      description: 'A brief description of Project 2',
      link: '/projects/project2',
    },
    {
      name: 'Project 3',
      description: 'A brief description of Project 3',
      link: '/projects/project3',
    },
  ],

  socialLinks: {
    linkedin: 'https://linkedin.com/in/ab',
    github: 'https://github.com/ab',
    twitter: 'https://twitter.com/ab',
  },

  email: 'ab@example.com',

  blogPosts,
} 