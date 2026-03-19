/**
 * Centralized API Error Response Utilities
 *
 * Provides consistent error response format across all API routes:
 * { error: string, code: string, details?: object }
 *
 * Requirements: 10.1-10.6
 */

import { NextResponse } from 'next/server'

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'

export interface ApiErrorBody {
  error: string
  code: ApiErrorCode
  details?: Record<string, unknown>
}

/**
 * Create a standardized error response
 */
export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error: message, code }
  if (details) body.details = details
  return NextResponse.json(body, { status })
}

// Convenience helpers

/** 400 Bad Request — validation failed */
export const validationError = (message: string, details?: Record<string, unknown>) =>
  apiError(400, 'VALIDATION_ERROR', message, details)

/** 401 Unauthorized — not authenticated */
export const unauthorizedError = (message = 'Unauthorized: Authentication required') =>
  apiError(401, 'UNAUTHORIZED', message)

/** 403 Forbidden — authenticated but not allowed */
export const forbiddenError = (message = 'Forbidden: You do not have permission') =>
  apiError(403, 'FORBIDDEN', message)

/** 404 Not Found */
export const notFoundError = (resource = 'Resource') =>
  apiError(404, 'NOT_FOUND', `${resource} not found`)

/** 409 Conflict */
export const conflictError = (message: string) =>
  apiError(409, 'CONFLICT', message)

/** 500 Internal Server Error — logs the original error */
export const internalError = (err: unknown, context?: string) => {
  console.error(`[API Error]${context ? ` ${context}:` : ''}`, err)
  return apiError(500, 'INTERNAL_ERROR', 'Internal server error')
}
