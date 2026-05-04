import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../server/lib/db"
import { successResponse, errorResponse } from "../../../server/lib/api"
import type { ApiResponse, Task } from "../../../shared/types"

const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "blocked", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
})

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
    const parsed = UpdateTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      const { status, body } = errorResponse(parsed.error.errors[0]?.message ?? "Invalid body", 400)
      return res.status(status).json(body)
    }
    const updated = db.updateTask(id, parsed.data)
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
