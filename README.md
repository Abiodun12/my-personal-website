# My Personal Website with Smart Pet Plus

A personal portfolio website with a terminal-like UI and Smart Pet Plus - an AI-powered pet/object recognition and story generation app built with Next.js, Python, DashScope, and DeepSeek AI.

## Project Overview

This project has two main components:
1. **Terminal-Inspired Portfolio** - An interactive terminal interface for navigating my professional information
2. **Smart Pet Plus** - An AI feature that identifies objects/animals in images and generates creative stories about them

## Features

### Personal Portfolio
- Interactive terminal-like UI
- Navigation to About, Projects, Blog, and Contact sections
- Performance settings for different devices
- Particle effects and visual customization

### Smart Pet Plus
- Upload any image (not just pets!)
- Precise object/animal identification using DashScope AI
- Creative story generation with DeepSeek AI
- Fun facts about the identified subject
- Responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, React
- **Backend**: Python, Flask API
- **AI Services**: DashScope (image analysis), DeepSeek (story generation)
- **Deployment**: Vercel (frontend), Render (backend)

## Project Structure

```
├── app/               # Next.js app directory
│   ├── api/           # API routes
│   ├── smart-pet-plus/ # Smart Pet Plus frontend
│   └── ...            # Other pages
├── components/        # Reusable React components
├── api/               # Python backend
│   └── python/        # Flask API for AI processing
└── styles/            # CSS files
```

## Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.9+)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd api/python
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys

### Running Locally

1. Start the frontend:
   ```bash
   npm run dev
   ```
2. Start the backend:
   ```bash
   cd api/python
   python smart_pet.py
   ```

## Environment Variables

Required environment variables:
- `DASHSCOPE_API_KEY` - For image analysis
- `DEEPSEEK_API_KEY` - For story generation

## Deployment

- **Frontend**: Configured for Vercel deployment
- **Backend**: Configured for Render deployment using the `render.yaml` file

Add the appropriate environment variables in your Vercel and Render project settings.