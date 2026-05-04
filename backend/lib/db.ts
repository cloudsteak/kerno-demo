import type { Task, User, Priority, TaskStatus } from "../../shared/types"

const users: User[] = [
  {
    id: "u1",
    name: "Alexandra Kovács",
    email: "a.kovacs@taskforge.io",
    role: "manager",
    avatarInitials: "AK",
  },
  {
    id: "u2",
    name: "Bence Molnár",
    email: "b.molnar@taskforge.io",
    role: "lead",
    avatarInitials: "BM",
  },
  {
    id: "u3",
    name: "Csilla Tóth",
    email: "c.toth@taskforge.io",
    role: "engineer",
    avatarInitials: "CT",
  },
  {
    id: "u4",
    name: "Dávid Szabó",
    email: "d.szabo@taskforge.io",
    role: "engineer",
    avatarInitials: "DS",
  },
]

const tasks: Task[] = [
  {
    id: "t1",
    title: "Implement authentication layer",
    description:
      "Set up JWT-based authentication with refresh token rotation. Ensure PKCE flow for OAuth providers.",
    status: "in_progress",
    priority: "critical",
    assigneeId: "u2",
    createdAt: "2026-04-20T08:00:00Z",
    updatedAt: "2026-04-28T14:30:00Z",
    dueDate: "2026-05-05T00:00:00Z",
    tags: ["auth", "security", "backend"],
  },
  {
    id: "t2",
    title: "Database schema migration v3",
    description:
      "Migrate legacy user_preferences table to JSONB column. Write rollback script.",
    status: "todo",
    priority: "high",
    assigneeId: "u3",
    createdAt: "2026-04-22T09:15:00Z",
    updatedAt: "2026-04-22T09:15:00Z",
    dueDate: "2026-05-10T00:00:00Z",
    tags: ["database", "migration"],
  },
  {
    id: "t3",
    title: "API rate limiting middleware",
    description:
      "Implement token bucket algorithm for rate limiting. Per-user and per-IP limits configurable via env.",
    status: "todo",
    priority: "high",
    assigneeId: "u4",
    createdAt: "2026-04-23T10:00:00Z",
    updatedAt: "2026-04-23T10:00:00Z",
    dueDate: "2026-05-08T00:00:00Z",
    tags: ["api", "performance", "backend"],
  },
  {
    id: "t4",
    title: "Dashboard analytics redesign",
    description:
      "Redesign the main dashboard with new chart components. Use recharts. Mobile-first approach.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "u3",
    createdAt: "2026-04-18T11:00:00Z",
    updatedAt: "2026-04-29T16:00:00Z",
    dueDate: "2026-05-15T00:00:00Z",
    tags: ["frontend", "ui", "analytics"],
  },
  {
    id: "t5",
    title: "CI/CD pipeline hardening",
    description:
      "Add SAST scanning, dependency audit, and container image signing to the pipeline.",
    status: "blocked",
    priority: "high",
    assigneeId: "u2",
    createdAt: "2026-04-15T08:30:00Z",
    updatedAt: "2026-04-27T12:00:00Z",
    dueDate: "2026-04-30T00:00:00Z",
    tags: ["devops", "security", "ci-cd"],
  },
  {
    id: "t6",
    title: "Write API documentation",
    description:
      "Generate OpenAPI 3.1 spec from code annotations. Publish to developer portal.",
    status: "done",
    priority: "medium",
    assigneeId: "u4",
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-25T17:00:00Z",
    dueDate: "2026-04-26T00:00:00Z",
    tags: ["docs", "api"],
  },
  {
    id: "t7",
    title: "Fix memory leak in websocket handler",
    description:
      "Event listeners not cleaned up on disconnect. Causes ~2MB/hr memory growth under load.",
    status: "done",
    priority: "critical",
    assigneeId: "u3",
    createdAt: "2026-04-12T14:00:00Z",
    updatedAt: "2026-04-24T11:00:00Z",
    dueDate: "2026-04-20T00:00:00Z",
    tags: ["bug", "performance", "backend"],
  },
  {
    id: "t8",
    title: "Implement dark mode toggle",
    description:
      "Add system-preference detection and manual override. Persist to localStorage.",
    status: "todo",
    priority: "low",
    assigneeId: null,
    createdAt: "2026-04-25T10:00:00Z",
    updatedAt: "2026-04-25T10:00:00Z",
    dueDate: null,
    tags: ["frontend", "ui", "accessibility"],
  },
  {
    id: "t9",
    title: "Load testing — 10k concurrent users",
    description:
      "Run k6 load test suite against staging. Target: p99 < 200ms at 10k concurrent connections.",
    status: "blocked",
    priority: "medium",
    assigneeId: "u2",
    createdAt: "2026-04-26T08:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z",
    dueDate: "2026-05-12T00:00:00Z",
    tags: ["performance", "testing", "devops"],
  },
  {
    id: "t10",
    title: "Onboarding email sequence",
    description:
      "Design and implement 5-email drip sequence triggered on signup. Integrate with SendGrid.",
    status: "todo",
    priority: "medium",
    assigneeId: "u1",
    createdAt: "2026-04-27T11:00:00Z",
    updatedAt: "2026-04-27T11:00:00Z",
    dueDate: "2026-05-20T00:00:00Z",
    tags: ["marketing", "email", "backend"],
  },
]

let taskIdCounter = tasks.length + 1

function generateId(): string {
  return `t${taskIdCounter++}`
}

export const db = {
  getTasks(filters?: {
    status?: string
    priority?: string
    assigneeId?: string
    search?: string
  }): Task[] {
    let result = [...tasks]

    if (filters?.status) {
      result = result.filter((t) => t.status === filters.status)
    }
    if (filters?.priority) {
      result = result.filter((t) => t.priority === filters.priority)
    }
    if (filters?.assigneeId) {
      result = result.filter((t) => t.assigneeId === filters.assigneeId)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    return result
  },

  getTask(id: string): Task | undefined {
    return tasks.find((t) => t.id === id)
  },

  createTask(input: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const now = new Date().toISOString()
    const task: Task = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    tasks.push(task)
    return task
  },

  updateTask(id: string, patch: Partial<Omit<Task, "id" | "createdAt">>): Task | undefined {
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    tasks[idx] = {
      ...tasks[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    return tasks[idx]
  },

  deleteTask(id: string): Task | undefined {
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    const [removed] = tasks.splice(idx, 1)
    return removed
  },

  getUsers(filters?: { role?: string }): User[] {
    let result = [...users]
    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role)
    }
    return result
  },

  getUser(id: string): User | undefined {
    return users.find((u) => u.id === id)
  },

  getStats() {
    const now = new Date()
    const byStatus: Record<TaskStatus, number> = {
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
    }
    const byPriority: Record<Priority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    let overdueCount = 0
    for (const task of tasks) {
      byStatus[task.status]++
      byPriority[task.priority]++
      if (
        task.dueDate &&
        task.status !== "done" &&
        new Date(task.dueDate) < now
      ) {
        overdueCount++
      }
    }

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      completionRate:
        tasks.length > 0
          ? Math.round((byStatus.done / tasks.length) * 100)
          : 0,
      overdueCount,
    }
  },
}
