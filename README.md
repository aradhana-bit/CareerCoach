# CareerCoach

<p align="center">
  <strong>Build your profile. Strengthen your resume. Prepare for your next opportunity.</strong>
</p>

<p align="center">
  A full-stack career preparation workspace with profile management, resume content generation, interview practice, and saved generation history.
</p>

---

## Overview

CareerCoach is a web application that helps users organize their professional information and prepare for career opportunities from one place. Users can create an account, maintain a career profile, generate resume-ready content, practise interview questions for a target role, and revisit previous generations.

The project currently includes a **demo generation adapter**. Resume summaries and interview questions are generated using deterministic templates; connect an AI provider in `backend/services/aiService.js` to enable live model-generated content.

## Features

- **Authentication:** Registration, login, logout, access tokens, refresh-token rotation, and role-based access.
- **Career profile:** Manage headline, target role, skills, education, experience, and projects.
- **Resume assistant:** Generate a professional summary and resume bullet points from the saved profile.
- **Interview practice:** Generate a starter set of questions for a selected role.
- **Generation history:** Save and revisit resume and interview outputs.
- **Admin dashboard:** View user and generation usage summaries.
- **API protection:** Protected routes, admin authorization, password hashing, generation rate limiting, and centralized error handling.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | Custom CSS, DM Sans, Manrope |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| API protection | Express Rate Limit |

## Application Structure

```text
CareerCoach/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── state/
        ├── App.jsx
        ├── api.js
        └── styles.css
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/aradhana-bit/CareerCoach.git
cd CareerCoach
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Copy the example environment file to `.env` and replace the placeholder values:

```bash
cp .env.example .env
```

Start the backend:

```bash
npm run dev
```

The API runs on port `5000` by default.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the local Vite URL shown in the terminal (normally `http://localhost:5173`).

## Environment Variables

### Backend — `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Backend port; defaults to `5000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `ACCESS_TOKEN_MINUTES` | Access-token lifetime in minutes |
| `REFRESH_TOKEN_DAYS` | Refresh-token lifetime in days |
| `CLIENT_URL` | Allowed frontend origin for CORS |

### Frontend — `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, for example `http://localhost:5000/api` |

Never commit real environment files, database credentials, JWT secrets, or provider API keys.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Refresh authentication tokens |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/profile/me` | Retrieve the current profile |
| PUT | `/api/profile/me` | Update the current profile |
| POST | `/api/generations/resume` | Generate resume content |
| POST | `/api/generations/interview` | Generate interview questions |
| GET | `/api/generations` | Retrieve generation history |
| GET | `/api/admin/usage` | Retrieve admin usage report |
| GET | `/api/health` | Check API health |

Authenticated endpoints require a bearer access token. The admin usage endpoint additionally requires the admin role.

## AI Integration Status

The current `backend/services/aiService.js` contains a demo adapter so the application can be explored without an external AI API key. To enable real AI generation, replace the adapter with a server-side provider integration. Keep provider credentials on the backend and validate generated content before using it in a real application.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Refresh tokens are stored as hashes in the database.
- Protected routes validate access tokens.
- Admin endpoints enforce role-based authorization.
- Generation endpoints are rate-limited.
- Keep secrets in local environment files or a deployment secrets manager.

## Project Status

CareerCoach is an actively improvable project. The current baseline provides the core career-profile and preparation workflow; live AI provider integration, expanded interview practice, richer resume export, and additional automated tests are potential next improvements.

---

<p align="center">Made to help turn career preparation into a more focused process.</p>
