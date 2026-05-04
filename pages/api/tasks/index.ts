import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../server/lib/db"
import { successResponse, errorResponse } from "../../../server/lib/api"
import type { ApiResponse, Task } from "../../../shared/types"

const GetQuerySchema = z.object({
  status: z.enum(["todo", "in_progress", "blocked", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  assigneeId: z.string().optional(),
  search: z.string().optional(),
})

const CreateTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional().default(""),
  status: z.enum(["todo", "in_progress", "blocked", "done"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),
  assigneeId: z.string().nullable().optional().default(null),
  dueDate: z.string().nullable().optional().default(null),
  tags: z.array(z.string()).optional().default([]),
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task[]> | ApiResponse<Task> | ApiResponse<null>>
) {
  if (req.method === "GET") {
    const parsed = GetQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      const { status, body } = errorResponse(parsed.error.errors[0]?.message ?? "Invalid query", 400)
      return res.status(status).json(body)
    }
    const tasks = db.getTasks(parsed.data)
    const { status, body } = successResponse(tasks)
    return res.status(status).json(body)
  }

  if (req.method === "POST") {
    const parsed = CreateTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      const { status, body } = errorResponse(parsed.error.errors[0]?.message ?? "Invalid body", 400)
      return res.status(status).json(body)
    }
    const task = db.createTask({ ...parsed.data, title: parsed.data.title.trim() })
    const { status, body } = successResponse(task, "Task created", 201)
    return res.status(status).json(body)
  }

  const { status, body } = errorResponse("Method not allowed", 405)
  return res.status(status).json(body)
}
