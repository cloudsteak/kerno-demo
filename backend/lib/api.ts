import type { ApiResponse } from "../../shared/types"

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): { body: ApiResponse<T>; status: number } {
  return {
    status,
    body: {
      data,
      success: true,
      message,
      timestamp: new Date().toISOString(),
    },
  }
}

export function errorResponse(
  message: string,
  status: number
): { body: ApiResponse<null>; status: number } {
  return {
    status,
    body: {
      data: null,
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
  }
}
