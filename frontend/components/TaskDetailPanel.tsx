import { useState, useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { tasksAtom, usersAtom, selectedTaskIdAtom, loadingAtom } from "../store/atoms"
import { useUpdateTask, useDeleteTask } from "../store/hooks"
import type { Task, TaskStatus, Priority } from "../../shared/types"

function formatDateInput(iso: string | null): string {
  if (!iso) return ""
  return iso.slice(0, 10)
}

function formatDateDisplay(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function TaskDetailPanel() {
  const tasks = useRecoilValue(tasksAtom)
  const users = useRecoilValue(usersAtom)
  const selectedTaskId = useRecoilValue(selectedTaskIdAtom)
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdAtom)
  const loading = useRecoilValue(loadingAtom)
  const { updateTask } = useUpdateTask()
  const { deleteTask } = useDeleteTask()

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null
  const isOpen = task !== null

  const [form, setForm] = useState<{
    title: string
    description: string
    status: TaskStatus
    priority: Priority
    assigneeId: string
    dueDate: string
    tags: string
  }>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigneeId: "",
    dueDate: "",
    tags: "",
  })

  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? "",
        dueDate: formatDateInput(task.dueDate),
        tags: task.tags.join(", "),
      })
      setDirty(false)
    }
  }, [task])

  function handleChange<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  async function handleSave() {
    if (!task) return
    const patch: Partial<Omit<Task, "id" | "createdAt">> = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }
    await updateTask(task.id, patch)
    setDirty(false)
  }

  async function handleDelete() {
    if (!task) return
    if (!confirm(`Delete "${task.title}"?`)) return
    await deleteTask(task.id)
  }

  const isSaving = task ? loading[`update-${task.id}`] : false
  const isDeleting = task ? loading[`delete-${task.id}`] : false

  return (
    <aside className={`detail-panel${isOpen ? " detail-panel--open" : ""}`}>
      <div className="detail-panel__header">
        <span className="detail-panel__header-title">
          {task ? <span className="task-id">{task.id}</span> : "Task Detail"}
        </span>
        <button
          className="detail-panel__close"
          onClick={() => setSelectedTaskId(null)}
          aria-label="Close panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {task && (
        <>
          <div className="detail-panel__body">
            <div className="field">
              <label className="field__label">Title</label>
              <input
                className="field__input"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label">Description</label>
              <textarea
                className="field__textarea"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field__label">Status</label>
                <select
                  className="field__select"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="field">
                <label className="field__label">Priority</label>
                <select
                  className="field__select"
                  value={form.priority}
                  onChange={(e) => handleChange("priority", e.target.value as Priority)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field__label">Assignee</label>
              <select
                className="field__select"
                value={form.assigneeId}
                onChange={(e) => handleChange("assigneeId", e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label">Due Date</label>
              <input
                className="field__input"
                type="date"
                value={form.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label">Tags (comma-separated)</label>
              <input
                className="field__input"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="auth, backend, bug"
              />
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
              <div className="field__label" style={{ marginBottom: "8px" }}>Metadata</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-3)", fontSize: "11px" }}>Created</span>
                  <span style={{ color: "var(--text-2)", fontSize: "11px", fontFamily: "var(--mono)" }}>
                    {formatDateDisplay(task.createdAt)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-3)", fontSize: "11px" }}>Updated</span>
                  <span style={{ color: "var(--text-2)", fontSize: "11px", fontFamily: "var(--mono)" }}>
                    {formatDateDisplay(task.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-panel__footer">
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={!dirty || isSaving}
            >
              {isSaving ? <span className="spinner" /> : null}
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
            <button
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <span className="spinner" /> : null}
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
