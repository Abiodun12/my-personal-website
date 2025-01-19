# Smart Pet Plus

AI-powered pet recognition and story generation app built with Next.js, Python, Azure Computer Vision, and DeepSeek AI.

## Features
- Upload pet images
- Automatic pet recognition using Azure Computer Vision
- AI-generated stories about your pets
- Responsive design

## Tech Stack
- Frontend: Next.js, TypeScript
- Backend: Python, Vercel Serverless Functions
- APIs: Azure Computer Vision, DeepSeek AI

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   pip install -r api/requirements.txt
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys
4. Run development servers:
   ```bash
   npm run dev
   ```

## Environment Variables
Required environment variables:
- `AZURE_COMPUTER_VISION_API_KEY`
- `AZURE_COMPUTER_VISION_ENDPOINT`
- `DEEPSEEK_API_KEY`

## Deployment
This project is configured for Vercel deployment. Add environment variables in your Vercel project settings. 