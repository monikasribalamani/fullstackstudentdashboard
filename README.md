# Student Dashboard

A production-ready full-stack application for managing student records — built with **React 19 + TypeScript** on the frontend and **FastAPI + SQLAlchemy** on the backend, backed by **Supabase PostgreSQL**.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Supabase Setup](#supabase-setup)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Without Docker](#running-without-docker)
- [Running With Docker](#running-with-docker)
- [Docker Commands](#docker-commands)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Seed Sample Data](#seed-sample-data)
- [Deployment to Render](#deployment-to-render)
- [Troubleshooting](#troubleshooting)

## Tech Stack

| Layer      | Technology                                                                 |
|------------|-----------------------------------------------------------------------------|
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS, React Router DOM, TanStack Query, Axios, React Hook Form, Zod, Lucide React |
| Backend    | Python 3.12, FastAPI, SQLAlchemy, Pydantic, Alembic, Uvicorn                |
| Database   | Supabase PostgreSQL                                                        |
| Container  | Docker, Docker Compose                                                     |
| Deployment | Render                                                                     |

## Project Structure

```
student-dashboard/
├── frontend/                     # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/           # Reusable UI + feature components
│   │   │   └── ui/                # Design-system primitives (Button, Input, Modal, ...)
│   │   ├── layouts/               # DashboardLayout, Sidebar, Header
│   │   ├── pages/                 # Dashboard, Students, AddStudent, EditStudent, StudentDetails, NotFound
│   │   ├── hooks/                 # useStudents (React Query), useDebounce
│   │   ├── services/              # Axios instance + studentService API functions
│   │   ├── context/                # ThemeContext (dark mode), ToastContext
│   │   ├── types/                  # Student & API TypeScript types
│   │   ├── utils/                  # cn, format, validation (Zod schemas)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                       # FastAPI + SQLAlchemy + Supabase
│   ├── app/
│   │   ├── api/                    # deps.py — shared FastAPI dependencies
│   │   ├── core/                   # config, logging, exceptions
│   │   ├── crud/                   # Repository layer (raw DB queries)
│   │   ├── database/                # SQLAlchemy engine/session/base
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── routers/                 # FastAPI route handlers
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── services/                  # Business logic layer
│   │   └── main.py
│   ├── alembic/                     # Database migrations
│   ├── scripts/seed.py               # Sample data seeder
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── render.yaml
├── README.md
├── .env.example
└── .gitignore
```

## Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.12+
- **Docker** and **Docker Compose** (only if running via containers)
- A free **Supabase** account

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once provisioned, open **Project Settings → Database → Connection string** and copy the **URI** (make sure "Use connection pooling" is off for migrations, or use the direct connection string).
3. It will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```
4. Paste this into `DATABASE_URL` in your `.env` file (see below).
5. The application does **not** use local SQLite — all environments (local, Docker, Render) connect directly to Supabase PostgreSQL.

## Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable        | Location | Description                                            |
|-----------------|----------|----------------------------------------------------------|
| `DATABASE_URL`  | Backend  | Supabase PostgreSQL connection string                    |
| `PORT`          | Backend  | Port the FastAPI server listens on (default `8000`)       |
| `CORS_ORIGINS`  | Backend  | Comma-separated list of allowed frontend origins           |
| `LOG_LEVEL`     | Backend  | `DEBUG` \| `INFO` \| `WARNING` \| `ERROR` \| `CRITICAL`      |
| `ENVIRONMENT`   | Backend  | `development` \| `production`                                |
| `VITE_API_URL`  | Frontend | Base URL of the backend API, e.g. `http://localhost:8000`     |

For local development without Docker, the backend also reads `backend/.env` (create it with the same backend variables), and the frontend reads `frontend/.env` (with `VITE_API_URL`).

## Installation

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Running Without Docker

1. **Apply database migrations** (creates the `students` table on Supabase):
   ```bash
   cd backend
   alembic upgrade head
   ```
2. **(Optional) Seed sample data:**
   ```bash
   python -m scripts.seed
   ```
3. **Start the backend:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
4. **Start the frontend** (in a separate terminal):
   ```bash
   cd frontend
   npm run dev
   ```
5. Visit the app at **http://localhost:5173** and the API docs at **http://localhost:8000/api/docs**.

## Running With Docker

Everything starts with a single command from the project root:

```bash
docker compose up --build
```

This builds and starts:
- **backend** → http://localhost:8000
- **frontend** → http://localhost:5173

Both containers share a Docker bridge network (`student-dashboard-network`). Make sure your root `.env` file contains a valid `DATABASE_URL` before starting — the backend container runs `alembic upgrade head` automatically on startup, so your Supabase schema is created/updated on every boot.

## Docker Commands

```bash
# Start everything (rebuilds images if code changed)
docker compose up --build

# Start in the background
docker compose up -d --build

# View logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Stop everything
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild a single service
docker compose build backend

# Run the seed script inside the running backend container
docker compose exec backend python -m scripts.seed

# Open a shell inside a container
docker compose exec backend sh
docker compose exec frontend sh
```

## API Documentation

Once the backend is running, interactive API docs are available at:

- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc
- **OpenAPI schema:** http://localhost:8000/api/openapi.json

## API Endpoints

| Method | Endpoint                | Description                        |
|--------|--------------------------|-------------------------------------|
| GET    | `/api/health`             | Health check (app + database status) |
| GET    | `/api/students`           | List students (search, filter, sort, paginate) |
| GET    | `/api/students/stats`     | Dashboard aggregate statistics       |
| GET    | `/api/students/{student_id}` | Get a single student by `student_id` |
| POST   | `/api/students`           | Create a new student                 |
| PUT    | `/api/students/{student_id}` | Update an existing student          |
| DELETE | `/api/students/{student_id}` | Delete a single student             |
| DELETE | `/api/students/all`       | Delete **all** students               |

All endpoints return meaningful HTTP status codes (`200`, `201`, `404`, `409`, `422`, `500`) and a consistent JSON error envelope (`{ "success": false, "message": "...", "details": ... }`) via centralized exception handling.

## Seed Sample Data

To populate the database with 10 realistic sample students:

```bash
# Without Docker
cd backend
python -m scripts.seed

# With Docker
docker compose exec backend python -m scripts.seed
```

The script is idempotent — re-running it skips students that already exist (matched by `student_id`).

## Deployment to Render

This repository includes a ready-to-use [`render.yaml`](./render.yaml) Blueprint that provisions **two services**:

1. **`student-dashboard-backend`** — a Python web service running FastAPI/Uvicorn, with `alembic upgrade head` run automatically as part of the build.
2. **`student-dashboard-frontend`** — a static site built with `npm run build` and served from `frontend/dist`.

### Steps

1. Push this repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New → Blueprint** and select your repository. Render will detect `render.yaml` automatically.
3. When prompted, set the **`DATABASE_URL`** secret for the backend service to your Supabase connection string (it is marked `sync: false` in `render.yaml`, so Render will ask for it during setup).
4. Click **Apply** — Render will build and deploy both services.
5. The backend's health check is configured at `/api/health`, so Render will only route traffic once the database connection is confirmed.
6. The frontend's `VITE_API_URL` and the backend's `CORS_ORIGINS` are pre-wired to each other's default Render hostnames (`https://student-dashboard-backend.onrender.com` and `https://student-dashboard-frontend.onrender.com`). If you rename the services in `render.yaml`, update these two values to match your new hostnames.

No source code changes are required after deployment — everything is driven by environment variables.

## Troubleshooting

**`sqlalchemy.exc.OperationalError: could not connect to server`**
Double-check `DATABASE_URL` — make sure the Supabase project is not paused (free-tier projects pause after inactivity) and that `sslmode=require` is present.

**CORS errors in the browser console**
Ensure `CORS_ORIGINS` on the backend includes the exact origin the frontend is served from (protocol + host + port, no trailing slash).

**`alembic upgrade head` fails with "relation already exists"**
The table may have been created outside of Alembic. Either drop it manually in Supabase and re-run, or stamp the current revision with `alembic stamp head`.

**Frontend shows "Network Error" for every request**
Verify `VITE_API_URL` in `frontend/.env` (or the Docker Compose environment) points to a reachable backend URL, and that the backend container/process is actually running.

**Docker Compose: frontend container exits immediately**
Run `docker compose logs frontend` — this is almost always a missing `node_modules` (delete any stale bind-mounted `node_modules` folder) or a syntax error caught by Vite at startup.

**Port already in use**
Another process is bound to `5173` or `8000`. Stop it, or change the port mapping in `docker-compose.yml`.
