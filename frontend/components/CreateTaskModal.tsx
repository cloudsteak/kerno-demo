import { useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { usersAtom, showCreateModalAtom } from "../store/atoms"
import { useCreateTask } from "../store/hooks"
import type { TaskStatus, Priority } from "../../shared/types"

interface FormState {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string
  dueDate: string
  tags: string
}

const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeId: "",
  dueDate: "",
  tags: "",
}

export default function CreateTaskModal() {
  const showModal = useRecoilValue(showCreateModalAtom)
  const setShowModal = useSetRecoilState(showCreateModalAtom)
  const users = useRecoilValue(usersAtom)
  const { createTask } = useCreateTask()

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      setError("Title is required.")
      return
    }
    setSaving(true)
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description,
        status: form.status,
        priority: form.priority,
        assigneeId: form.assigneeId || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      setForm(DEFAULT_FORM)
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setForm(DEFAULT_FORM)
    setError(null)
    setShowModal(false)
  }

  if (!showModal) return null

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">New Task</span>
          <button
            className="detail-panel__close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "var(--radius)",
              padding: "8px 12px",
              color: "var(--danger)",
              fontSize: "12px",
              marginBottom: "12px",
            }}>
              {error}
            </div>
          )}

          <div className="field">
            <label className="field__label">Title *</label>
            <input
              className="field__input"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="field">
            <label className="field__label">Description</label>
            <textarea
              className="field__textarea"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Additional context, acceptance criteria…"
              rows={3}
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
                  {u.name} ({u.role})
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
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? <span className="spinner" /> : null}
            {saving ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  )
}
