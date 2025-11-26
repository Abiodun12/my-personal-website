# Codebase Structure & Architecture

## Overview
**Total Lines of Code**: ~7,439 lines  
**Total Files**: 47 files (excluding node_modules, venv, .next)

---

## Architecture Layers

### 1. Frontend (Next.js 14 - App Router)
**Location**: `/app`, `/components`, `/lib`, `/utils`, `/config`  
**Total Lines**: ~2,639 lines  
**Technology**: TypeScript, React, Next.js

#### App Directory (`/app`) - 1,261 lines
Next.js App Router structure with Server and Client Components:

```
app/
├── layout.tsx (43 lines)          # Root layout with providers
├── page.tsx (37 lines)             # Home page with terminal UI
├── KeepAliveClient.tsx             # Keep-alive functionality
│
├── api/                            # API Routes (Next.js Route Handlers)
│   ├── analyze/route.ts (89 lines)
│   ├── blog/likes/route.ts (159 lines)
│   ├── preferences/route.ts (105 lines)
│   ├── setup/route.ts
│   ├── smart-pet-plus/
│   │   ├── route.ts (145 lines)    # Main API proxy
│   │   └── route.local.ts
│   ├── stats/route.ts
│   ├── test-db/route.ts
│   └── voice/
│       ├── transcribe/
│       └── ws/
│
├── about/
│   ├── layout.tsx
│   └── page.tsx
│
├── blog/
│   ├── page.tsx                    # Blog listing
│   └── [slug]/page.tsx (81 lines)  # Dynamic blog post pages
│
├── projects/page.tsx
├── smart-pet-plus/page.tsx (125 lines)
├── smartpetplus/page.tsx (143 lines)
└── coming-soon/page.tsx
```

**Key Features**:
- Server Components by default (no 'use client')
- Client Components where needed (interactivity)
- API routes for backend communication
- Dynamic routing with `[slug]`

#### Components (`/components`) - 1,027 lines
Reusable React components:

```
components/
├── InteractiveTerminal.tsx (267 lines)  # Main terminal interface
├── ParticleEffects.tsx (202 lines)      # Visual effects
├── CommandMenu.tsx (109 lines)          # Command navigation
├── BlogLikeButton.tsx (98 lines)        # Blog interaction
├── BlogLikeFAB.tsx                      # Floating action button
├── UserPreferencesProvider.tsx (79 lines) # Context provider
├── Terminal.tsx                         # Terminal component
├── Cursor.tsx                           # Terminal cursor
├── ClientPortal.tsx                     # Client-side portal
├── ErrorHandler.tsx                     # Error handling
├── ImageCompressor.tsx                  # Image optimization
├── ScrollToTop.tsx                      # Scroll functionality
└── TerminalLink.tsx                     # Terminal-style links
```

#### Libraries (`/lib`) - 127 lines
Core utilities and services:

```
lib/
├── db.ts                              # Database connection (Vercel Postgres)
└── security.ts (92 lines)             # Security utilities
    - Rate limiting
    - Origin validation
    - IP extraction
```

#### Utils (`/utils`) - 40 lines
Helper functions:

```
utils/
└── blog.ts (40 lines)                 # Blog utilities
    - Markdown parsing
    - Blog post processing
```

#### Config (`/config`) - 184 lines
Configuration and shared content:

```
config/
├── blog.ts (124 lines)                # Blog configuration
├── index.ts                            # General config
└── shared-content.ts                   # Shared content
```

---

### 2. Backend (Python Flask)
**Location**: `/api/python`  
**Total Lines**: ~337 lines  
**Technology**: Python 3.9, Flask, DashScope, DeepSeek AI

```
api/python/
├── smart_pet.py (271 lines)           # Main Flask API
│   - Image analysis endpoint
│   - Story generation
│   - AI integration (DashScope + DeepSeek)
│
├── test_api.py                        # API testing
├── gunicorn_config.py                 # Production server config
├── keep_alive.py                      # Keep-alive service
└── requirements.txt                   # Python dependencies
```

**Key Features**:
- RESTful API endpoints
- CORS enabled
- AI-powered image analysis
- Story generation
- Shared secret authentication

---

### 3. Voice Backend (FastAPI)
**Location**: `/api/voice-backend`  
**Technology**: Python 3.10, FastAPI, WebSockets

```
api/voice-backend/
└── (Voice-related services)
```

---

## Data Flow Architecture

### Smart Pet Plus Flow
```
User Upload → Next.js API Route → Flask Backend → AI Services
                ↓                      ↓              ↓
            Rate Limit          DashScope API    DeepSeek API
            Origin Check        (Image Analysis) (Story Generation)
            File Validation
```

### Blog System Flow
```
Markdown Files → Blog Utils → Next.js Pages → Database (Likes)
(content/blog/)   (utils/)      (app/blog/)     (Vercel Postgres)
```

### Terminal UI Flow
```
User Input → CommandMenu → InteractiveTerminal → Navigation
                ↓                ↓                    ↓
         Command Parsing    State Management    Page Routing
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5.3.3
- **UI Library**: React 18.2.0
- **Styling**: CSS Modules, Global CSS
- **Database**: Vercel Postgres (@vercel/postgres)
- **Analytics**: Vercel Analytics
- **Rate Limiting**: Upstash Ratelimit

### Backend
- **API Framework**: Flask (Python 3.9)
- **AI Services**: 
  - DashScope (Image Analysis)
  - DeepSeek (Story Generation)
- **Server**: Gunicorn (production)
- **CORS**: flask-cors

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Configuration**: `vercel.json`, `render.yaml`

---

## File Size Breakdown

### Largest Files (Top 10)
1. **InteractiveTerminal.tsx** - 267 lines
2. **smart_pet.py** - 271 lines
3. **ParticleEffects.tsx** - 202 lines
4. **blog/likes/route.ts** - 159 lines
5. **smart-pet-plus/route.ts** - 145 lines
6. **smartpetplus/page.tsx** - 143 lines
7. **blog.ts** (config) - 124 lines
8. **smart-pet-plus/page.tsx** - 125 lines
9. **CommandMenu.tsx** - 109 lines
10. **preferences/route.ts** - 105 lines

### Directory Line Counts
- **app/**: 1,261 lines
- **components/**: 1,027 lines
- **api/python/**: 337 lines
- **config/**: 184 lines
- **lib/**: 127 lines
- **utils/**: 40 lines

---

## Key Architectural Patterns

### 1. Server/Client Component Separation
- Server Components for data fetching and static content
- Client Components (`'use client'`) for interactivity
- API Routes for backend communication

### 2. Security Layers
- Rate limiting (Upstash)
- Origin validation
- Shared secret authentication
- File size/type validation

### 3. State Management
- React Context (UserPreferencesProvider)
- Local state for UI components
- Server state via API routes

### 4. Content Management
- Markdown files for blog posts
- Configuration files for shared content
- Database for dynamic data (likes, preferences)

---

## API Endpoints

### Next.js API Routes
- `POST /api/smart-pet-plus` - Image analysis proxy
- `POST /api/blog/likes` - Blog like functionality
- `GET/POST /api/preferences` - User preferences
- `GET /api/stats` - Statistics
- `GET /api/analyze` - Analysis endpoint

### Flask API Routes
- `POST /api/analyze` - Image analysis and story generation
- `GET /` - Health check

---

## Environment Variables

### Frontend (.env)
- `SMART_PET_API_URL` - Backend API URL
- `SMART_PET_SHARED_SECRET` - Authentication secret
- `MAX_IMAGE_BYTES` - Max upload size
- Database connection strings

### Backend (.env)
- `DASHSCOPE_API_KEY` - Image analysis API
- `DEEPSEEK_API_KEY` - Story generation API
- `SMART_PET_SHARED_SECRET` - Authentication secret
- `FLASK_DEBUG` - Debug mode

---

## Development Workflow

1. **Frontend**: `npm run dev` → http://localhost:3000
2. **Backend**: `python smart_pet.py` → http://localhost:8081
3. **Build**: `npm run build` → Production build
4. **Start**: `npm start` → Production server

---

## Project Statistics

- **Total Lines**: ~7,439
- **TypeScript/TSX Files**: 20 files
- **Python Files**: 4 main files
- **Components**: 13 reusable components
- **API Routes**: 8+ endpoints
- **Pages**: 7+ pages
- **Blog Posts**: 5 markdown files

---

## Code Organization Principles

1. **Separation of Concerns**: Clear split between UI, logic, and data
2. **Reusability**: Shared components and utilities
3. **Type Safety**: Full TypeScript implementation
4. **Security First**: Multiple layers of validation and protection
5. **Scalability**: Modular structure for easy expansion


