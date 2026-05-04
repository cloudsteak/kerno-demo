# TaskForge

A production-quality, multi-layer task management application built with Next.js 14, React 18, TypeScript, and Recoil. Created as a real-world codebase for evaluating static analysis and observability tooling (Kerno).

---

## Features

- **Task management** — create, view, edit, and delete tasks with priorities, statuses, assignees, due dates, and tags
- **Team view** — browse team members with their roles and task assignments
- **Live stats bar** — six KPI metrics: total tasks, by-status breakdown, and completion rate
- **Real-time filtering** — filter tasks by status, or search by title, description, and tags
- **Detail panel** — slide-in panel for full task editing without leaving the list
- **Keyboard shortcuts** — `N` to create, `Esc` to dismiss

---

## Tech Stack

| Layer     | Technology                             |
| --------- | -------------------------------------- |
| Framework | Next.js 14 (Pages Router)              |
| UI        | React 18                               |
| Language  | TypeScript 5 (strict mode)             |
| State     | Recoil 0.7                             |
| Styling   | Pure CSS — no Tailwind, no CSS Modules |
| Data      | In-memory store (simulated DB)         |

---

## Project Structure

The codebase is organized into four top-level tiers:

```
frontend/
├── components/        # React UI components
│   ├── Sidebar.tsx        # Navigation + status filter
│   ├── StatsBar.tsx       # KPI bar (6 metrics)
│   ├── TaskCard.tsx       # Task list item
│   ├── TaskDetailPanel.tsx  # Slide-in edit panel
│   ├── CreateTaskModal.tsx  # New task form
│   └── UsersPage.tsx      # Team grid view
├── store/
│   ├── atoms.ts       # Recoil atoms + selectors
│   └── hooks.ts       # Custom hooks for all API calls
└── styles/
    └── globals.css    # Industrial dark theme + CSS variables

backend/
└── lib/
    ├── db.ts          # In-memory data store (simulated DB)
    └── api.ts         # successResponse / errorResponse helpers

shared/
└── types/
    └── index.ts       # Shared TypeScript types (Task, User, Stats, ApiResponse)

pages/                 # Next.js routing (must stay at root)
├── api/
│   ├── tasks/
│   │   ├── index.ts   # GET (list + filter), POST (create)
│   │   └── [id].ts    # GET, PUT (partial update), DELETE
│   ├── users/
│   │   ├── index.ts   # GET (list, filter by role)
│   │   └── [id].ts    # GET (user + their tasks)
│   └── stats.ts       # GET (aggregated stats)
├── _app.tsx           # RecoilRoot wrapper
└── index.tsx          # Main SPA entry point
```

---

## Getting Started

**Requires Node.js 22.**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

All endpoints return a consistent envelope:

```typescript
// Success
{ data: T, success: true, message?: string, timestamp: string }

// Error
{ data: null, success: false, message: string, timestamp: string }
```

### Tasks

| Method   | Endpoint         | Description             |
| -------- | ---------------- | ----------------------- |
| `GET`    | `/api/tasks`     | List tasks (filterable) |
| `POST`   | `/api/tasks`     | Create a task           |
| `GET`    | `/api/tasks/:id` | Get a single task       |
| `PUT`    | `/api/tasks/:id` | Partial update          |
| `DELETE` | `/api/tasks/:id` | Delete a task           |

**GET /api/tasks — query parameters:**

| Param        | Type                                     | Description                                 |
| ------------ | ---------------------------------------- | ------------------------------------------- |
| `status`     | `todo \| in_progress \| blocked \| done` | Filter by status                            |
| `priority`   | `low \| medium \| high \| critical`      | Filter by priority                          |
| `assigneeId` | `string`                                 | Filter by user ID                           |
| `search`     | `string`                                 | Full-text search (title, description, tags) |

### Users

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| `GET`  | `/api/users`     | List users (optional `?role=` filter) |
| `GET`  | `/api/users/:id` | Get user with their tasks             |

### Stats

| Method | Endpoint     | Description                |
| ------ | ------------ | -------------------------- |
| `GET`  | `/api/stats` | Aggregated task statistics |

**HTTP status codes:** `200` success · `201` created · `400` bad request · `404` not found · `405` method not allowed

---

## Data Types

```typescript
type Priority = "low" | "medium" | "high" | "critical";
type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  dueDate: string | null;
  tags: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "engineer" | "lead" | "manager";
  avatarInitials: string;
}

interface Stats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<Priority, number>;
  completionRate: number; // 0–100
  overdueCount: number;
}
```

---

## State Management

Recoil atoms live in `frontend/store/atoms.ts`. All data fetching goes through custom hooks in `frontend/store/hooks.ts` — components never call `fetch()` directly.

| Atom                    | Type                      | Purpose                                |
| ----------------------- | ------------------------- | -------------------------------------- |
| `tasksAtom`             | `Task[]`                  | All loaded tasks                       |
| `usersAtom`             | `User[]`                  | All loaded users                       |
| `selectedTaskIdAtom`    | `string \| null`          | Currently open task                    |
| `statusFilterAtom`      | `TaskStatus \| "all"`     | Active status filter                   |
| `searchQueryAtom`       | `string`                  | Active search string                   |
| `loadingAtom`           | `Record<string, boolean>` | Loading states by key                  |
| `showCreateModalAtom`   | `boolean`                 | Create modal visibility                |
| `activeViewAtom`        | `"tasks" \| "users"`      | Current top-level view                 |
| `filteredTasksSelector` | `Task[]`                  | Derived: filtered + searched task list |

**Loading key convention:** `"tasks"`, `"users"`, `"create"`, `"update-{id}"`, `"delete-{id}"`

---

## Development

```bash
npm run dev      # Start dev server (http://localhost:3000)
npx tsc --noEmit # TypeScript check (must return 0 errors)
npm run lint     # ESLint
npm run build    # Production build check
```

### Conventions

- **No `any`**, no `@ts-ignore` — TypeScript strict mode is enforced
- **No inline styles** except for dynamic CSS variable values
- **No direct `fetch()`** in components — use hooks only
- **CSS variables** for all colors: `var(--bg)`, `var(--accent)`, `var(--danger)`, etc.
- API helpers `successResponse` / `errorResponse` from `backend/lib/api.ts` used in every endpoint

---

## Keyboard Shortcuts

| Key   | Action                                           |
| ----- | ------------------------------------------------ |
| `N`   | Open "New Task" modal (when no input is focused) |
| `Esc` | Close detail panel or modal                      |

---

## Extending the Data Layer

`backend/lib/db.ts` is the only file that touches data. It currently uses in-memory arrays. To swap in a real database, replace only this file — the API routes and everything above it stay unchanged.
