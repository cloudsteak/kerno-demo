import { useMemo } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  statusFilterAtom,
  activeViewAtom,
  showCreateModalAtom,
  tasksAtom,
} from "../store/atoms"
import { STATUS_FILTERS } from "../../shared/types"
import type { TaskStatus } from "../../shared/types"

export default function Sidebar() {
  const statusFilter = useRecoilValue(statusFilterAtom)
  const setStatusFilter = useSetRecoilState(statusFilterAtom)
  const activeView = useRecoilValue(activeViewAtom)
  const setActiveView = useSetRecoilState(activeViewAtom)
  const setShowCreateModal = useSetRecoilState(showCreateModalAtom)
  const tasks = useRecoilValue(tasksAtom)

  const countByStatus = useMemo(() => {
    const counts: Record<TaskStatus | "all", number> = {
      all: tasks.length,
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
    }
    for (const t of tasks) {
      counts[t.status]++
    }
    return counts
  }, [tasks])

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__title">TaskForge</div>
        <div className="sidebar__subtitle">multi-layer task manager</div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-label">Navigation</div>
        <button
          className={`sidebar__nav-btn${activeView === "tasks" ? " sidebar__nav-btn--active" : ""}`}
          onClick={() => setActiveView("tasks")}
        >
          <svg className="sidebar__nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="14" height="3" rx="1" />
            <rect x="1" y="7" width="14" height="3" rx="1" />
            <rect x="1" y="12" width="9" height="3" rx="1" />
          </svg>
          Tasks
        </button>
        <button
          className={`sidebar__nav-btn${activeView === "users" ? " sidebar__nav-btn--active" : ""}`}
          onClick={() => setActiveView("users")}
        >
          <svg className="sidebar__nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="5" r="2.5" />
            <path d="M1 13c0-2.5 2.2-4 5-4s5 1.5 5 4" />
            <path d="M12 7c1.1 0 2 .9 2 2s-.9 2-2 2" strokeLinecap="round" />
            <path d="M14.5 13c0-1.5-.9-2.7-2-3.2" strokeLinecap="round" />
          </svg>
          Team
        </button>
      </div>

      {activeView === "tasks" && (
        <div className="sidebar__section">
          <div className="sidebar__section-label">Filter by Status</div>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`sidebar__filter-btn${statusFilter === f.value ? " sidebar__filter-btn--active" : ""}`}
              onClick={() => setStatusFilter(f.value)}
            >
              <span className="sidebar__filter-left">
                <span
                  className="sidebar__filter-dot"
                  style={{ background: f.color }}
                />
                {f.label}
              </span>
              <span className="sidebar__badge">{countByStatus[f.value]}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {activeView === "tasks" && (
        <button
          className="sidebar__new-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 1v10M1 6h10" strokeLinecap="round" />
          </svg>
          New Task
        </button>
      )}
    </aside>
  )
}
