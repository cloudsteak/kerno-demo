import { useRecoilValue } from "recoil"
import { usersAtom, tasksAtom, loadingAtom } from "../store/atoms"

export default function UsersPage() {
  const users = useRecoilValue(usersAtom)
  const tasks = useRecoilValue(tasksAtom)
  const loading = useRecoilValue(loadingAtom)
  const isLoading = loading["users"]

  function taskCount(userId: string): number {
    return tasks.filter((t) => t.assigneeId === userId).length
  }

  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ width: 24, height: 24 }} />
        <span className="empty-state__title">Loading team…</span>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">👥</div>
        <div className="empty-state__title">No team members</div>
      </div>
    )
  }

  return (
    <div className="content-area">
      <div className="content-header">
        <span className="content-header__title">Team</span>
        <span className="content-header__count">{users.length} members</span>
      </div>

      <div className="users-grid">
        {users.map((user) => {
          const count = taskCount(user.id)
          return (
            <div key={user.id} className="user-card">
              <div className="user-card__top">
                <div className="avatar avatar--lg">{user.avatarInitials}</div>
                <div className="user-card__info">
                  <div className="user-card__name">{user.name}</div>
                  <div className="user-card__email">{user.email}</div>
                </div>
              </div>
              <div className="user-card__footer">
                <span className={`role-badge role-badge--${user.role}`}>
                  {user.role}
                </span>
                <span className="user-card__task-count">
                  {count} task{count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
