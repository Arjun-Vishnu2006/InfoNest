# InfoNest – Knowledge Sharing & Learning Platform

InfoNest is a full-stack knowledge sharing and learning platform with AI-powered features, built with React (TypeScript), Node.js/Express, and MongoDB.

## Features

- **AI Learning Assistant (Cosmos AI)** — Powered by Groq when configured, with friendly offline fallback
- **Goal Management** — Create and track learning goals with study progress logging
- **What Next? Navigator** — Goal-based recommendations with a deterministic offline fallback
- **Content Sharing** — Share articles, guides, and learning materials
- **Creator Profiles** — Content creators can publish and manage educational content
- **Personalized Feed** — Content recommendations based on your skills and interests
- **Profile Improvement Suggestions** — AI analyzes your profile and suggests improvements
- **Presentation Mode** — Fictional seed content for courses, creators, goals, messages, and Orbit sessions
- **Real-time Notifications** — System notifications stored in MongoDB
- **Search** — Global search across users, content, and courses

## Architecture

```
React Frontend (Vite + TypeScript)
         ↕
Node.js / Express Backend
         ↕
   MongoDB Atlas        Groq API (optional)
```

- All data flows through the backend REST API
- AI API key is stored only on the backend (never exposed to the frontend)
- JWT-based authentication with refresh token rotation
- Email OTP verification for registration

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account (or local MongoDB)
- Groq API key (optional; chat enhancement) — create one in the Groq console
- Gmail account with App Password (for email OTP)

### Backend

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your `.env` with real values:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
   PORT=5000
   NODE_ENV=development

   EMAIL_USER=your_email@gmail.com
   EMAIL_APP_PASSWORD=your_16_char_app_password

   JWT_SECRET=<long_random_string>
   JWT_REFRESH_SECRET=<another_long_random_string>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   GROQ_API_KEY=<your_groq_api_key>
   GROQ_MODEL=llama-3.3-70b-versatile

   CLIENT_URL=http://localhost:5173
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```

6. Verify: Terminal should show:
   ```
   MongoDB connected: <host>
   InfoNest API running in development mode on port 5000
   ```

7. Health check: http://127.0.0.1:5000/api/v1/health

### Frontend

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create `.env` from the example:
   ```bash
   cp .env.example .env
   ```
   Default API URL is `http://127.0.0.1:5000/api/v1` — change only if your backend runs on a different port.

4. Start the frontend:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `PORT` | ❌ | Server port (default: 5000) |
| `NODE_ENV` | ❌ | `development` or `production` |
| `EMAIL_USER` | ✅ | Gmail address for sending OTP emails |
| `EMAIL_APP_PASSWORD` | ✅ | Gmail App Password (not normal password) |
| `JWT_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | ❌ | Access token expiry (default: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | Refresh token expiry (default: 7d) |
| `GROQ_API_KEY` | ❌ | Groq API key; AI chat is optional |
| `GROQ_MODEL` | ❌ | Groq model (default: llama-3.3-70b-versatile) |
| `CLIENT_URL` | ❌ | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ❌ | Backend API base URL (default: http://127.0.0.1:5000/api/v1) |

---

## Production Deployment

### Backend

1. Create a Render Web Service with `backend` as the root directory.
2. Set build command `npm install` and start command `npm start`.
3. Set `NODE_ENV=production`, `MONGO_URI`, JWT secrets, and `CLIENT_URL` (the deployed frontend origin). Add `GROQ_API_KEY` optionally.
4. Deploy and verify `/api/v1/health` returns success.

### Frontend

1. Build the production bundle:
   ```bash
   cd frontend
   # PowerShell
   $env:VITE_API_URL="https://<render-backend>.onrender.com/api/v1"
   npm run build
   ```
2. In Render, create a **Static Site** from this repository with root directory `frontend`, build command `npm install && npm run build`, and publish directory `dist`.
3. Set `VITE_API_URL=https://<render-backend>.onrender.com/api/v1` on the Static Site, then deploy. Add the deployed static-site origin to the backend `CLIENT_URL` and redeploy the backend.

### Security Checklist

- [ ] `.env` files are NOT committed to git
- [ ] API keys are set via environment variables, not in code
- [ ] `NODE_ENV=production` on production server
- [ ] CORS is configured for your production domain via `CLIENT_URL`
- [ ] MongoDB uses a strong password
- [ ] JWT secrets are long random strings

---

## AI Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/ai/chat` | POST | Chat with Cosmos AI (Groq text completion) |
| `/api/v1/ai/recommendations` | GET | Personalized What Next, content, and creator recommendations |
| `/api/v1/ai/profile-suggestions` | GET | AI analysis of your profile with improvement suggestions |

All AI endpoints require authentication and have rate limiting (30 requests / 15 min).

---

## Important

- Never commit or share `.env` files
- Demo mode is enabled by default; set `VITE_DEMO_MODE=false` to hide demo sign-in and demo seeds.
- Demo messages and goal changes are stored in the browser; real accounts continue to use the backend.
- AI chat requires a running backend and `GROQ_API_KEY`; the UI remains usable if Groq is unavailable.
