# Codebase Architecture - Slides Summary

## 📊 Project Overview

**Project**: Personal Website with Smart Pet Plus  
**Total Code**: ~7,439 lines across 47 files  
**Tech Stack**: Next.js 14 + Python Flask + AI Services

---

## 🏗️ Architecture Layers

### Layer 1: Frontend (Next.js)
**~2,639 lines** | TypeScript + React

```
┌─────────────────────────────────────┐
│   Next.js App Router (1,261 lines)  │
│   - Pages & Routes                  │
│   - API Routes (Next.js handlers)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   React Components (1,027 lines)    │
│   - InteractiveTerminal (267)      │
│   - ParticleEffects (202)           │
│   - CommandMenu (109)               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Utilities & Config (351 lines)    │
│   - lib/ (127) - DB & Security      │
│   - utils/ (40) - Helpers           │
│   - config/ (184) - Settings        │
└─────────────────────────────────────┘
```

### Layer 2: Backend (Python Flask)
**~337 lines** | Python 3.9

```
┌─────────────────────────────────────┐
│   Flask API (271 lines)             │
│   - Image Analysis Endpoint         │
│   - Story Generation                │
│   - AI Integration                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   AI Services                       │
│   - DashScope (Image Analysis)      │
│   - DeepSeek (Story Generation)     │
└─────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
2025-codes/
│
├── app/ (1,261 lines)              # Next.js App Router
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── api/                        # API routes
│   │   ├── smart-pet-plus/         # Main feature API
│   │   ├── blog/likes/             # Blog interactions
│   │   └── preferences/            # User settings
│   ├── blog/                       # Blog pages
│   └── smart-pet-plus/             # Feature pages
│
├── components/ (1,027 lines)        # React Components
│   ├── InteractiveTerminal.tsx     # 267 lines ⭐
│   ├── ParticleEffects.tsx         # 202 lines
│   └── CommandMenu.tsx             # 109 lines
│
├── lib/ (127 lines)                 # Core utilities
│   ├── db.ts                       # Database
│   └── security.ts                 # 92 lines
│
├── api/python/ (337 lines)         # Flask Backend
│   └── smart_pet.py                # 271 lines ⭐
│
└── config/ (184 lines)              # Configuration
    └── blog.ts                     # 124 lines
```

---

## 🔄 Data Flow

### Smart Pet Plus Feature
```
User Upload
    ↓
Next.js API Route (145 lines)
    ├─ Rate Limiting
    ├─ Origin Check
    └─ File Validation
    ↓
Flask Backend (271 lines)
    ├─ DashScope API → Image Analysis
    └─ DeepSeek API → Story Generation
    ↓
Response to User
```

### Blog System
```
Markdown Files (content/blog/)
    ↓
Blog Utils (utils/blog.ts - 40 lines)
    ↓
Next.js Pages (app/blog/)
    ↓
Database (Vercel Postgres)
    └─ Likes & Stats
```

---

## 📈 Code Statistics

### By Category
| Category | Lines | Files |
|----------|-------|-------|
| **Frontend (App)** | 1,261 | 20 |
| **Components** | 1,027 | 13 |
| **Backend (Python)** | 337 | 4 |
| **Config** | 184 | 3 |
| **Libraries** | 127 | 2 |
| **Utils** | 40 | 1 |
| **Total** | **~2,976** | **43+** |

### Top 5 Largest Files
1. **smart_pet.py** - 271 lines (Backend API)
2. **InteractiveTerminal.tsx** - 267 lines (Main UI)
3. **ParticleEffects.tsx** - 202 lines (Visual Effects)
4. **blog/likes/route.ts** - 159 lines (API Route)
5. **smart-pet-plus/route.ts** - 145 lines (API Proxy)

---

## 🛠️ Technology Stack

### Frontend Stack
- **Next.js 14.1.0** - React Framework
- **TypeScript 5.3.3** - Type Safety
- **React 18.2.0** - UI Library
- **Vercel Postgres** - Database
- **Upstash** - Rate Limiting

### Backend Stack
- **Flask** - Python Web Framework
- **DashScope** - Image Analysis AI
- **DeepSeek** - Story Generation AI
- **Gunicorn** - Production Server

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## 🔐 Security Features

1. **Rate Limiting** - Upstash integration
2. **Origin Validation** - CORS protection
3. **Shared Secret Auth** - API authentication
4. **File Validation** - Size & type checks
5. **IP-based Tracking** - Request monitoring

---

## 🎯 Key Features

### 1. Terminal UI (267 lines)
- Interactive command interface
- Navigation system
- Real-time feedback

### 2. Smart Pet Plus (416 lines total)
- Image upload & analysis
- AI-powered story generation
- Backend API integration

### 3. Blog System (283 lines total)
- Markdown-based posts
- Like functionality
- Dynamic routing

### 4. User Preferences (184 lines)
- Context-based state
- Persistent settings
- Performance optimization

---

## 📊 Component Hierarchy

```
RootLayout
├── UserPreferencesProvider
├── ScrollToTop
├── Terminal Container
│   └── InteractiveTerminal
│       ├── CommandMenu
│       ├── Terminal
│       ├── Cursor
│       └── ParticleEffects
└── Analytics
```

---

## 🚀 API Endpoints

### Next.js Routes
- `POST /api/smart-pet-plus` - Image analysis
- `POST /api/blog/likes` - Blog interactions
- `GET/POST /api/preferences` - User settings
- `GET /api/stats` - Statistics

### Flask Routes
- `POST /api/analyze` - AI processing
- `GET /` - Health check

---

## 📝 Development Commands

```bash
# Frontend
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm start        # Production server

# Backend
python smart_pet.py  # Flask server (port 8081)
```

---

## 🎨 Design Patterns

1. **Server/Client Separation** - Next.js App Router pattern
2. **Component Composition** - Reusable React components
3. **API Proxy Pattern** - Next.js routes → Flask backend
4. **Context API** - State management
5. **Modular Architecture** - Clear separation of concerns

---

## 📦 Dependencies

### Frontend (package.json)
- next: 14.1.0
- react: 18.2.0
- @vercel/postgres: 0.10.0
- @upstash/ratelimit: 2.0.5

### Backend (requirements.txt)
- flask
- flask-cors
- dashscope
- requests
- python-dotenv

---

## 🔄 Request Lifecycle

```
1. User Action
   ↓
2. Client Component (React)
   ↓
3. Next.js API Route (Validation)
   ↓
4. Flask Backend (Processing)
   ↓
5. AI Services (DashScope/DeepSeek)
   ↓
6. Response Chain (Back to User)
```

---

## 📌 Key Metrics

- **Total Lines**: ~7,439
- **Frontend**: ~2,639 lines (35%)
- **Backend**: ~337 lines (5%)
- **Components**: 13 reusable
- **API Routes**: 8+ endpoints
- **Pages**: 7+ routes
- **Blog Posts**: 5 markdown files

---

## 🎯 Architecture Highlights

✅ **Type-Safe**: Full TypeScript implementation  
✅ **Scalable**: Modular component structure  
✅ **Secure**: Multiple security layers  
✅ **Modern**: Next.js 14 App Router  
✅ **AI-Powered**: Integrated AI services  
✅ **Responsive**: Mobile-first design  


