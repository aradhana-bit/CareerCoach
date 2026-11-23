# CareerCoach — AI Resume & Interview Assistant

A MERN-stack capstone starter project. It includes:
- React + Vite frontend
- Express + MongoDB backend using MVC-style folders
- Registration/login with bcrypt and JWT access + refresh tokens
- User profile CRUD
- AI resume-summary and interview-question endpoints (server-side AI adapter placeholder)
- Generation history
- Admin usage report with MongoDB aggregation
- Per-user generation rate limit
- Centralized error handling
- Postman collection and database ER diagram

## Requirements
- Node.js 18+
- MongoDB local instance or Atlas connection string
- An AI provider API key if you want real AI output (configure the adapter in `backend/services/aiService.js`)

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Set `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` in `.env`.
The AI adapter returns a clearly marked demo response until you add your provider integration.

### 2. Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (normally http://localhost:5173).

## Demo admin
New registrations are regular users. To promote an account, update its `role` to `admin` in MongoDB. Do not expose admin registration publicly.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `POST /api/generations/resume`
- `POST /api/generations/interview`
- `GET /api/generations`
- `GET /api/admin/usage` (admin only)

## Security notes
- `.env` is ignored by Git; never commit secrets.
- Access tokens are short-lived. Refresh tokens are stored hashed in the database.
- For a production deployment, use HTTPS, secure cookie-based refresh tokens, stronger validation, CSRF protections where applicable, and a managed secrets store.
- AI-generated content should be reviewed for accuracy before use in an actual resume.
