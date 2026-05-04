import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../backend/lib/db"
import { successResponse, errorResponse } from "../../../backend/lib/api"
import type { ApiResponse, User, Task } from "../../../shared/types"

interface UserWithTasks extends User {
  tasks: Task[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithTasks> | ApiResponse<null>>
) {
  if (req.method !== "GET") {
    const { status, body } = errorResponse("Method not allowed", 405)
    return res.status(status).json(body)
  }

  const { id } = req.query
  if (typeof id !== "string") {
    const { status, body } = errorResponse("Invalid id", 400)
    return res.status(status).json(body)
  }

  const user = db.getUser(id)
  if (!user) {
    const { status, body } = errorResponse("User not found", 404)
    return res.status(status).json(body)
  }

  const tasks = db.getTasks({ assigneeId: id })
  const { status, body } = successResponse({ ...user, tasks })
  return res.status(status).json(body)
}
