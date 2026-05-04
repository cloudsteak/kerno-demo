export type Priority = "low" | "medium" | "high" | "critical"
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done"

export interface StatusFilter {
  label: string
  value: TaskStatus | "all"
  color: string
}

export const STATUS_FILTERS: StatusFilter[] = [
  { label: "All",         value: "all",         color: "var(--text-3)"  },
  { label: "Todo",        value: "todo",         color: "var(--text-3)"  },
  { label: "In Progress", value: "in_progress",  color: "var(--accent)"  },
  { label: "Blocked",     value: "blocked",      color: "var(--danger)"  },
  { label: "Done",        value: "done",         color: "var(--success)" },
]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string | null
  createdAt: string
  updatedAt: string
  dueDate: string | null
  tags: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "engineer" | "lead" | "manager"
  avatarInitials: string
}

export interface Stats {
  total: number
  byStatus: Record<TaskStatus, number>
  byPriority: Record<Priority, number>
  completionRate: number
  overdueCount: number
}

export interface ApiResponse<T> {
  data: T | null
  success: boolean
  message?: string
  timestamp: string
}
