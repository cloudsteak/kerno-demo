import { useEffect, useCallback } from "react"
import Head from "next/head"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  filteredTasksSelector,
  selectedTaskIdAtom,
  activeViewAtom,
  loadingAtom,
  showCreateModalAtom,
  searchQueryAtom,
} from "../frontend/store/atoms"
import { useTasks, useUsers, useStats } from "../frontend/store/hooks"
import Sidebar from "../frontend/components/Sidebar"
import StatsBar from "../frontend/components/StatsBar"
import TaskCard from "../frontend/components/TaskCard"
import TaskDetailPanel from "../frontend/components/TaskDetailPanel"
import CreateTaskModal from "../frontend/components/CreateTaskModal"
import UsersPage from "../frontend/components/UsersPage"

export default function Home() {
  const { loadTasks } = useTasks()
  const { loadUsers } = useUsers()
  const { loadStats } = useStats()

  const filteredTasks = useRecoilValue(filteredTasksSelector)
  const selectedTaskId = useRecoilValue(selectedTaskIdAtom)
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdAtom)
  const activeView = useRecoilValue(activeViewAtom)
  const loading = useRecoilValue(loadingAtom)
  const setShowCreateModal = useSetRecoilState(showCreateModalAtom)
  const searchQuery = useRecoilValue(searchQueryAtom)
  const setSearchQuery = useSetRecoilState(searchQueryAtom)

  const isLoadingTasks = loading["tasks"]

  useEffect(() => {
    void loadTasks()
    void loadUsers()
    void loadStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"

      if (e.key === "Escape") {
        setSelectedTaskId(null)
        setShowCreateModal(false)
      }

      if (!isInput && e.key === "n") {
        setShowCreateModal(true)
      }
    },
    [setSelectedTaskId, setShowCreateModal]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <Head>
        <title>TaskForge</title>
        <meta name="description" content="Multi-layer task manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="app-shell">
        <StatsBar />

        <div className="app-body">
          <Sidebar />

          <main className="app-main">
            {activeView === "tasks" ? (
              <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <div className="content-area" style={{ flex: 1 }}>
                  <div className="content-header">
                    <span className="content-header__title">Tasks</span>
                    <span className="content-header__count">
                      {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="search-bar">
                    <svg
                      className="search-bar__icon"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="6" cy="6" r="4.5" />
                      <path d="M9.5 9.5l3 3" strokeLinecap="round" />
                    </svg>
                    <input
                      className="search-bar__input"
                      placeholder="Search tasks by title, description or tag…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-3)",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        aria-label="Clear search"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {isLoadingTasks ? (
                    <div className="empty-state">
                      <div className="spinner" style={{ width: 24, height: 24 }} />
                      <span className="empty-state__title">Loading tasks…</span>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">📋</div>
                      <div className="empty-state__title">No tasks found</div>
                      <div className="empty-state__desc">
                        {searchQuery
                          ? "Try a different search term."
                          : "Create a new task with the button in the sidebar."}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          selected={task.id === selectedTaskId}
                          onClick={() =>
                            setSelectedTaskId(
                              task.id === selectedTaskId ? null : task.id
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <TaskDetailPanel />
              </div>
            ) : (
              <UsersPage />
            )}
          </main>
        </div>
      </div>

      <CreateTaskModal />
    </>
  )
}
