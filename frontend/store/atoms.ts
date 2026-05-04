import { atom, selector } from "recoil"
import type { Task, User, TaskStatus, Stats } from "../../shared/types"

export const tasksAtom = atom<Task[]>({
  key: "tasksAtom",
  default: [],
})

export const usersAtom = atom<User[]>({
  key: "usersAtom",
  default: [],
})

export const statsAtom = atom<Stats | null>({
  key: "statsAtom",
  default: null,
})

export const selectedTaskIdAtom = atom<string | null>({
  key: "selectedTaskIdAtom",
  default: null,
})

export const statusFilterAtom = atom<TaskStatus | "all">({
  key: "statusFilterAtom",
  default: "all",
})

export const loadingAtom = atom<Record<string, boolean>>({
  key: "loadingAtom",
  default: {},
})

export const showCreateModalAtom = atom<boolean>({
  key: "showCreateModalAtom",
  default: false,
})

export const activeViewAtom = atom<"tasks" | "users">({
  key: "activeViewAtom",
  default: "tasks",
})

export const searchQueryAtom = atom<string>({
  key: "searchQueryAtom",
  default: "",
})

export const filteredTasksSelector = selector<Task[]>({
  key: "filteredTasksSelector",
  get: ({ get }) => {
    const tasks = get(tasksAtom)
    const statusFilter = get(statusFilterAtom)
    const searchQuery = get(searchQueryAtom)

    let result = tasks

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    return result
  },
})
