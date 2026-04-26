import { toast } from 'sonner'

/**
 * Show an error toast from an unknown caught error.
 * Extracts message from Error instances, falls back to provided fallback string.
 */
export function toastError(err: unknown, fallback: string): void {
  toast.error(err instanceof Error ? err.message : fallback)
}

/**
 * Parse API error response JSON and return the error message.
 * Falls back to the provided fallback string if parsing fails.
 */
export async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return data.error || fallback
  } catch {
    return fallback
  }
}
