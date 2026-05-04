import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../backend/lib/db"
import { successResponse, errorResponse } from "../../../backend/lib/api"
import type { ApiResponse, User } from "../../../shared/types"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[]> | ApiResponse<null>>
) {
  if (req.method !== "GET") {
    const { status, body } = errorResponse("Method not allowed", 405)
    return res.status(status).json(body)
  }

  const { role } = req.query
  const users = db.getUsers({
    role: typeof role === "string" ? role : undefined,
  })
  const { status, body } = successResponse(users)
  return res.status(status).json(body)
}
