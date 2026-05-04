import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../backend/lib/db"
import { successResponse, errorResponse } from "../../../backend/lib/api"
import type { ApiResponse, Task } from "../../../shared/types"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task> | ApiResponse<{ id: string }> | ApiResponse<null>>
) {
  const { id } = req.query
  if (typeof id !== "string") {
    const { status, body } = errorResponse("Invalid id", 400)
    return res.status(status).json(body)
  }

  if (req.method === "GET") {
    const task = db.getTask(id)
    if (!task) {
      const { status, body } = errorResponse("Task not found", 404)
      return res.status(status).json(body)
    }
    const { status, body } = successResponse(task)
    return res.status(status).json(body)
  }

  if (req.method === "PUT") {
    const task = db.getTask(id)
    if (!task) {
      const { status, body } = errorResponse("Task not found", 404)
      return res.status(status).json(body)
    }
    const { title, description, status: taskStatus, priority, assigneeId, dueDate, tags } =
      req.body

    const updated = db.updateTask(id, {
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof description === "string" ? { description } : {}),
      ...(taskStatus !== undefined ? { status: taskStatus } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(assigneeId !== undefined ? { assigneeId } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
      ...(Array.isArray(tags) ? { tags } : {}),
    })

    if (!updated) {
      const { status, body } = errorResponse("Task not found", 404)
      return res.status(status).json(body)
    }

    const { status, body } = successResponse(updated, "Task updated")
    return res.status(status).json(body)
  }

  if (req.method === "DELETE") {
    const deleted = db.deleteTask(id)
    if (!deleted) {
      const { status, body } = errorResponse("Task not found", 404)
      return res.status(status).json(body)
    }
    const { status, body } = successResponse(deleted, "Task deleted")
    return res.status(status).json(body)
  }

  const { status, body } = errorResponse("Method not allowed", 405)
  return res.status(status).json(body)
}
