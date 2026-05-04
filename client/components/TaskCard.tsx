import { useRecoilValue } from "recoil"
import { usersAtom } from "../store/atoms"
import type { Task } from "../../shared/types"

interface TaskCardProps {
  task: Task
  onClick: () => void
  selected: boolean
}

function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === "done") return false
  return new Date(dueDate) < new Date()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })
}

export default function TaskCard({ task, onClick, selected }: TaskCardProps) {
  const users = useRecoilValue(usersAtom)
  const assignee = users.find((u) => u.id === task.assigneeId)
  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <div
      className={`task-card${selected ? " task-card--selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="task-card__header">
        <span className={`task-card__title${task.status === "done" ? " task-card__title--done" : ""}`}>
          {task.title}
        </span>
        <span className={`badge badge--priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <div className="task-card__meta">
        <span className={`badge badge--status-${task.status}`}>
          {task.status.replace("_", " ")}
        </span>

        {assignee && (
          <div className="avatar" title={assignee.name}>
            {assignee.avatarInitials}
          </div>
        )}

        {task.dueDate && (
          <span className={`task-card__due${overdue ? " task-card__due--overdue" : ""}`}>
            {overdue ? "⚠ " : ""}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {task.tags.length > 4 && (
            <span className="tag">+{task.tags.length - 4}</span>
          )}
        </div>
      )}
    </div>
  )
}
