import { useRecoilValue } from "recoil"
import { statsAtom, loadingAtom } from "../store/atoms"

export default function StatsBar() {
  const stats = useRecoilValue(statsAtom)
  const loading = useRecoilValue(loadingAtom)
  const isLoading = loading["stats"]

  if (isLoading || !stats) {
    return (
      <div className="stats-bar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="stats-bar__card">
            <div className="stats-bar__label">—</div>
            <div className="stats-bar__value" style={{ color: "var(--text-3)" }}>–</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="stats-bar">
      <div className="stats-bar__card">
        <div className="stats-bar__label">Total</div>
        <div className="stats-bar__value">{stats.total}</div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">Todo</div>
        <div className="stats-bar__value" style={{ color: "var(--text-3)" }}>
          {stats.byStatus.todo}
        </div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">In Progress</div>
        <div className="stats-bar__value stats-bar__value--accent">
          {stats.byStatus.in_progress}
        </div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">Blocked</div>
        <div className="stats-bar__value stats-bar__value--danger">
          {stats.byStatus.blocked}
        </div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">Done</div>
        <div className="stats-bar__value stats-bar__value--success">
          {stats.byStatus.done}
        </div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">Completion</div>
        <div className="stats-bar__value stats-bar__value--success">
          {stats.completionRate}%
        </div>
      </div>
    </div>
  )
}
