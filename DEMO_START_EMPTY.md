# InfoNest Presentation Mode

## First Run

1. Backend terminal must show:
   - `MongoDB connected`
   - `InfoNest API running ... port 5000`

2. Health check: http://127.0.0.1:5000/api/v1/health
   Expected: `{ "success": true }`

3. On the login page, select **Continue with Demo Account** to use the locally seeded presentation data. No production user record is needed for the frontend demo.

4. Demo goal and message changes persist in this browser.

## AI Features

AI chat uses `GROQ_API_KEY` in `backend/.env` and requires a running backend.

If Groq is unavailable, chat shows a friendly learning prompt and What’s Next uses the local goal progress.
