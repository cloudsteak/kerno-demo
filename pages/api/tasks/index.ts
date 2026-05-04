import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../backend/lib/db"
import { successResponse, errorResponse } from "../../../backend/lib/api"
import type { ApiResponse, Task } from "../../../shared/types"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task[]> | ApiResponse<Task> | ApiResponse<null>>
) {
  if (req.method === "GET") {
    const { status, priority, assigneeId, search } = req.query
    const tasks = db.getTasks({
      status: typeof status === "string" ? status : undefined,
      priority: typeof priority === "string" ? priority : undefined,
      assigneeId: typeof assigneeId === "string" ? assigneeId : undefined,
      search: typeof search === "string" ? search : undefined,
    })
    const { status: httpStatus, body } = successResponse(tasks)
    return res.status(httpStatus).json(body)
  }

  if (req.method === "POST") {
    const { title, description, status, priority, assigneeId, dueDate, tags } =
      req.body

    if (!title || typeof title !== "string" || title.trim() === "") {
      const { status: httpStatus, body } = errorResponse("title is required", 400)
      return res.status(httpStatus).json(body)
    }

    const task = db.createTask({
      title: title.trim(),
      description: typeof description === "string" ? description : "",
      status: status ?? "todo",
      priority: priority ?? "medium",
      assigneeId: assigneeId ?? null,
      dueDate: dueDate ?? null,
      tags: Array.isArray(tags) ? tags : [],
    })

    const { status: httpStatus, body } = successResponse(task, "Task created", 201)
    return res.status(httpStatus).json(body)
  }

  const { status: httpStatus, body } = errorResponse("Method not allowed", 405)
  return res.status(httpStatus).json(body)
}
