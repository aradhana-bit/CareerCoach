# CareerCoach

<p align="center">
  <strong>Build your profile. Strengthen your resume. Prepare for your next opportunity.</strong>
</p>

<p align="center">
  A full-stack career preparation workspace for building a professional profile, generating resume-ready content, practising interviews, and tracking your progress.
</p>

---

## Overview

CareerCoach brings essential career-preparation tools into one workspace. Users can create an account, maintain a structured career profile, generate resume content, practise role-specific interview questions, and revisit previous generations.

The backend uses PostgreSQL with Neon as the hosted database. The current generation service includes a deterministic demo adapter, so the core experience can be explored without an external AI API key.

## Features

- **Authentication:** Registration, login, logout, JWT access tokens, and refresh-token rotation.
- **Career profile:** Manage professional headline, target role, skills, education, experience, and projects.
- **Resume assistant:** Generate a professional summary and achievement-style bullet points from the saved profile.
- **Interview practice:** Generate a starter question set for a selected target role.
- **Generation history:** Save and revisit resume and interview outputs.
- **Admin dashboard:** Review total users, total generations, and per-user usage.
- **Security:** bcrypt password hashing, hashed refresh-token storage, protected routes, role-based admin access, and hourly generation limits.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | Custom CSS, DM Sans, Manrope |
| Backend | Node.js, Express |
| Database | PostgreSQL, Neon |
| Database client | node-postgres (pg) |
| Authentication | JWT, bcrypt |
| API protection | Express Rate Limit |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```text
CareerCoach/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── db/
│   │   └── schema.sql
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── state/
│       ├── App.jsx
│       ├── api.js
│       └── styles.css
└── render.yaml
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/aradhana-bit/CareerCoach.git
cd CareerCoach
```

### 2. Configure the database

Create a PostgreSQL database, then run the SQL in `backend/db/schema.sql` against it. This creates the `users`, `profiles`, and `generations` tables and their indexes.

### 3. Configure and run the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your own values:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_different_long_random_refresh_secret
ACCESS_TOKEN_MINUTES=15
REFRESH_TOKEN_DAYS=7
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 4. Configure and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` with the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal (normally `http://localhost:5173`).

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend port; defaults to `5000` |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Separate secret used to sign refresh tokens |
| `ACCESS_TOKEN_MINUTES` | Access-token lifetime in minutes |
| `REFRESH_TOKEN_DAYS` | Refresh-token lifetime in days |
| `CLIENT_URL` | Exact deployed frontend origin allowed by CORS |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, ending in `/api` |

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

The current generation service includes a deterministic demo adapter so the application can be explored without an external AI API key. Live AI-provider integration can be configured later using a server-side credential. Provider credentials must never be exposed in frontend code.

## Deployment

### Backend — Render

The repository includes a `render.yaml` Blueprint configuration for the backend.

1. Open the [Render Blueprint dashboard](https://dashboard.render.com/blueprints).
2. Create a Blueprint from `https://github.com/aradhana-bit/CareerCoach` and select the `main` branch.
3. Render reads `render.yaml` and configures the service with `backend` as its root directory, `npm install` as the build command, and `npm start` as the start command.
4. Supply the Neon `DATABASE_URL` and deployed frontend `CLIENT_URL` when prompted. JWT secrets are generated by Render.
5. After deployment, verify the API at `https://YOUR-RENDER-SERVICE.onrender.com/api/health`.

### Frontend — Vercel

Set the Vercel environment variable `VITE_API_URL` to the deployed Render API URL ending in `/api`, then redeploy the frontend. Set the Render `CLIENT_URL` to the exact public frontend origin.

## Project Status

The core frontend and PostgreSQL-backed API structure are in place. Deployment and end-to-end verification are the next steps.

---

<p align="center">Made to turn career preparation into a more focused process.</p>
