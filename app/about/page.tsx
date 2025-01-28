'use client'
import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'

export default function AboutPage() {
  return (
    <main>
      <Terminal>
        $ cat about_me.txt
        <Cursor />
      </Terminal>
      <Terminal>
        <h1>About Me</h1>
        <br />
        Hi, I'm Abiodun (AB) Soneye—a tech enthusiast, lifelong learner, and adventurer navigating the exciting intersections of technology, creativity, and life.
        <br /><br />
        Beyond academics and work, I'm passionate about venture capital, startups, AI, and leveraging technology to empower small businesses while giving back to people and my community.
        <br /><br />
        This blog is where I'll share my thoughts, adventures, and love for tech. When I'm not coding or brainstorming, you can find me enjoying music, concerts, hanging out with friends, or planning my next big move.
        <br /><br />
        Welcome to my world—I'm glad you're here. Let's build something amazing together.
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 