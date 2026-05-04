import { useRecoilState, useSetRecoilState } from "recoil"
import { tasksAtom, usersAtom, statsAtom, loadingAtom, selectedTaskIdAtom } from "./atoms"
import type { Task, User, Stats } from "../../shared/types"

function setLoading(
  setLoadingState: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void,
  key: string,
  value: boolean
) {
  setLoadingState((prev) => ({ ...prev, [key]: value }))
}

export function useTasks() {
  const [tasks, setTasks] = useRecoilState(tasksAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const loadTasks = async (filters?: {
    status?: string
    priority?: string
    assigneeId?: string
    search?: string
  }) => {
    setLoading(setLoadingState, "tasks", true)
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.set("status", filters.status)
      if (filters?.priority) params.set("priority", filters.priority)
      if (filters?.assigneeId) params.set("assigneeId", filters.assigneeId)
      if (filters?.search) params.set("search", filters.search)

      const qs = params.toString()
      const res = await fetch(`/api/tasks${qs ? `?${qs}` : ""}`)
      const json = await res.json()
      if (json.success) {
        setTasks(json.data as Task[])
      }
    } finally {
      setLoading(setLoadingState, "tasks", false)
    }
  }

  return { tasks, loadTasks }
}

export function useUsers() {
  const [users, setUsers] = useRecoilState(usersAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const loadUsers = async () => {
    setLoading(setLoadingState, "users", true)
    try {
      const res = await fetch("/api/users")
      const json = await res.json()
      if (json.success) {
        setUsers(json.data as User[])
      }
    } finally {
      setLoading(setLoadingState, "users", false)
    }
  }

  return { users, loadUsers }
}

export function useCreateTask() {
  const setTasks = useSetRecoilState(tasksAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const createTask = async (input: {
    title: string
    description: string
    status: string
    priority: string
    assigneeId: string | null
    dueDate: string | null
    tags: string[]
  }): Promise<Task | null> => {
    setLoading(setLoadingState, "create", true)
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (json.success) {
        setTasks((prev) => [...prev, json.data as Task])
        return json.data as Task
      }
      return null
    } finally {
      setLoading(setLoadingState, "create", false)
    }
  }

  return { createTask }
}

export function useUpdateTask() {
  const setTasks = useSetRecoilState(tasksAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const updateTask = async (
    id: string,
    patch: Partial<Omit<Task, "id" | "createdAt">>
  ): Promise<Task | null> => {
    setLoading(setLoadingState, `update-${id}`, true)
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const json = await res.json()
      if (json.success) {
        const updated = json.data as Task
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
        return updated
      }
      return null
    } finally {
      setLoading(setLoadingState, `update-${id}`, false)
    }
  }

  return { updateTask }
}

export function useDeleteTask() {
  const setTasks = useSetRecoilState(tasksAtom)
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const deleteTask = async (id: string): Promise<boolean> => {
    setLoading(setLoadingState, `delete-${id}`, true)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id))
        setSelectedTaskId(null)
        return true
      }
      return false
    } finally {
      setLoading(setLoadingState, `delete-${id}`, false)
    }
  }

  return { deleteTask }
}

export function useStats() {
  const [stats, setStats] = useRecoilState(statsAtom)
  const setLoadingState = useSetRecoilState(loadingAtom)

  const loadStats = async () => {
    setLoading(setLoadingState, "stats", true)
    try {
      const res = await fetch("/api/stats")
      const json = await res.json()
      if (json.success) {
        setStats(json.data as Stats)
      }
    } finally {
      setLoading(setLoadingState, "stats", false)
    }
  }

  return { stats, loadStats }
}
