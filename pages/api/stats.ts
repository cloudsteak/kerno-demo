import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../backend/lib/db"
import { successResponse, errorResponse } from "../../backend/lib/api"
import type { ApiResponse, Stats } from "../../shared/types"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Stats> | ApiResponse<null>>
) {
  if (req.method !== "GET") {
    const { status, body } = errorResponse("Method not allowed", 405)
    return res.status(status).json(body)
  }

  const stats = db.getStats()
  const { status, body } = successResponse(stats)
  return res.status(status).json(body)
}
