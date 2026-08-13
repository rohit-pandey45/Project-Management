# TaskForge

> A multi-workspace project & task management app — think a lightweight Jira/Linear — built with React, Express, Prisma, and Clerk.


## ✨ Features

- **Workspaces** — organizations (via Clerk) with admin/member roles, each with their own projects, teams, and settings
- **Projects** — create, update, and track projects with status, priority, progress, timelines, and team leads
- **Tasks** — kanban-style tasks with type (bug/feature/task/improvement/other), priority, status, assignees, and due dates
- **Comments** — task-level discussion threads
- **Notifications** — automatic email on task assignment plus a due-date reminder, sent via background jobs
- **Analytics & Calendar** — per-project charts (status/type/priority breakdowns) and a due-date calendar view
- **Dashboard** — workspace-wide stats, recent activity, and a personal "My Tasks" summary
- **Dark mode** — persisted theme toggle
- **Auth** — full authentication and organization management handled by Clerk (sign-in, org creation, invites, roles)

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit (state management, incl. async thunks)
- React Router
- Clerk React SDK (auth & organizations)
- Tailwind CSS
- Recharts (analytics charts)
- date-fns (date formatting/manipulation)
- Axios
- react-hot-toast (notifications)
- lucide-react (icons)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL (via [Neon](https://neon.tech) serverless driver)
- Clerk (auth middleware + webhooks for user/org sync)
- Inngest (background jobs: task-assignment emails, due-date reminders)
- Nodemailer (via Brevo SMTP) for transactional email

## 📁 Project Structure

```
.
├── backend/
│   ├── config/
│   │   ├── prisma.js          # Prisma client (Neon adapter)
│   │   └── nodemailer.js      # Email transporter + sendEmail helper
│   ├── controllers/
│   │   ├── workspaceController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── commentController.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # Clerk auth guard (protect)
│   ├── routes/
│   │   ├── workspaceRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── commentRoutes.js
│   ├── inngest/
│   │   └── index.js           # Clerk sync + task email functions
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.js / server.js   # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI (dialogs, cards, sidebars, charts…)
    │   ├── pages/              # Route-level views (Dashboard, Projects, TaskDetails…)
    │   ├── features/           # Redux slices (workspaceSlice, themeSlice)
    │   ├── configs/
    │   │   └── api.js          # Axios instance
    │   └── assets/
    └── index.html
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [PostgreSQL](https://www.postgresql.org/) database (this project is configured for [Neon](https://neon.tech), but any Postgres instance works with minor changes to `config/prisma.js`)
- A [Clerk](https://clerk.com) account (for auth + organizations)
- A [Brevo](https://www.brevo.com) (formerly Sendinblue) account for transactional email, or another SMTP provider
- An [Inngest](https://www.inngest.com) account (or the Inngest dev server) for background jobs

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd taskflow
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
# Database
DATABASE_URL="postgresql://..."      # Neon pooled connection string
DIRECT_URL="postgresql://..."        # Neon direct connection string (for migrations)

# Clerk
CLERK_SECRET_KEY="sk_..."
CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Email (Brevo SMTP)
SMTP_USER="your-brevo-smtp-user"
SMTP_PASS="your-brevo-smtp-key"
SENDER_EMAIL="notifications@yourdomain.com"

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# Misc
NODE_ENV="development"
PORT=5000
```

Run migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_BASEURL="http://localhost:5000"
VITE_CLERK_PUBLISHABLE_KEY="pk_..."
```

Start the frontend:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (or whatever port Vite assigns), talking to the API at `http://localhost:5000`.

### 4. Clerk webhooks & Inngest

- Point your Clerk webhook (user/organization created/updated/deleted, invitation accepted) at your backend's webhook endpoint so the `syncUser*` / `syncWorkspace*` Inngest functions stay in sync with Clerk.
- Run `npx inngest-cli@latest dev` locally to test background functions (task-assignment emails, due-date reminders) without deploying.

## 📡 API Overview

All routes below are prefixed with `/api` and require a valid Clerk session token (`Authorization: Bearer <token>`).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workspaces` | List all workspaces the current user belongs to |
| `POST` | `/workspaces/add-member` | Add a member to a workspace (admin only) |
| `POST` | `/projects` | Create a project (workspace admin only) |
| `PUT` | `/projects` | Update a project (workspace admin or project lead) |
| `POST` | `/projects/:projectId/addMember` | Add a member to a project (project lead only) |
| `POST` | `/tasks` | Create a task (project lead only) |
| `PUT` | `/tasks/:id` | Update a task (project lead only) |
| `POST` | `/tasks/delete` | Bulk-delete tasks by ID (project lead only) |
| `POST` | `/comments` | Add a comment to a task (project members only) |
| `GET` | `/comments/:taskId` | List comments for a task |

## 🗄️ Data Model

Core entities (see `schema.prisma` for the full definitions):

- **User** — synced from Clerk
- **Workspace** — maps to a Clerk organization; has an owner and members (`ADMIN`/`MEMBER`)
- **Project** — belongs to a workspace, has a team lead and members
- **Task** — belongs to a project, has an assignee, status, type, and priority
- **Comment** — belongs to a task and a user

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Run/lint locally and make sure existing flows (auth, project/task CRUD) still work
4. Open a pull request describing what changed and why

