# Clean Production Start

This build operates entirely on real MongoDB data. There is no mock/demo data.

## First Run

1. Backend terminal must show:
   - `MongoDB connected`
   - `InfoNest API running ... port 5000`

2. Health check: http://127.0.0.1:5000/api/v1/health
   Expected: `{ "success": true }`

3. The database starts empty. Register the first user to begin.

4. All pages show proper empty states when no data exists.

## AI Features

AI features (Cosmos AI chat, What Next, recommendations) require a valid `XAI_API_KEY` in `backend/.env`.

If the AI key is missing or invalid, the UI displays a user-friendly error instead of crashing.
