import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../server/lib/db"
import { successResponse, errorResponse } from "../../../server/lib/api"
import type { ApiResponse, User } from "../../../shared/types"

const GetQuerySchema = z.object({
  role: z.enum(["engineer", "lead", "manager"]).optional(),
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[]> | ApiResponse<null>>
) {
  if (req.method !== "GET") {
    const { status, body } = errorResponse("Method not allowed", 405)
    return res.status(status).json(body)
  }

  const parsed = GetQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    const { status, body } = errorResponse(parsed.error.errors[0]?.message ?? "Invalid query", 400)
    return res.status(status).json(body)
  }

  const users = db.getUsers(parsed.data)
  const { status, body } = successResponse(users)
  return res.status(status).json(body)
}
