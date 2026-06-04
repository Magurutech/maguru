/**
 * Client-Side Logger untuk Browser
 * Simple logger yang pasti berfungsi di browser console
 */

// Warna untuk console (browser support)
const COLORS = {
  error: 'color: #ef4444; font-weight: bold',
  warn: 'color: #f59e0b; font-weight: bold',
  info: 'color: #3b82f6; font-weight: bold',
  debug: 'color: #10b981; font-weight: bold',
  reset: 'color: inherit',
}

// Format timestamp
const getTimestamp = (): string => {
  const now = new Date()
  return now.toISOString().split('T')[1].split('.')[0] // HH:MM:SS
}

// Interface untuk logger
interface ClientLogger {
  debug(functionName: string, message: string, data?: Record<string, unknown>): void
  info(functionName: string, message: string, data?: Record<string, unknown>): void
  warn(functionName: string, message: string, data?: Record<string, unknown>): void
  error(functionName: string, message: string, error?: Error | Record<string, unknown>): void
}

/**
 * Buat child logger dengan context tertentu
 * @param context - Context name (e.g., 'LessonEditorPanel', 'useUnsavedChanges')
 */
export function createClientLogger(context: string): ClientLogger {
  const prefix = `[${context}]`

  return {
    debug(functionName: string, message: string, data?: Record<string, unknown>): void {
      const timestamp = getTimestamp()
      const label = `${timestamp} 🐛 ${prefix}[${functionName}]`

      if (data && Object.keys(data).length > 0) {
        console.log(`%c${label}%c ${message}`, COLORS.debug, COLORS.reset, data)
      } else {
        console.log(`%c${label}%c ${message}`, COLORS.debug, COLORS.reset)
      }
    },

    info(functionName: string, message: string, data?: Record<string, unknown>): void {
      const timestamp = getTimestamp()
      const label = `${timestamp} ℹ️ ${prefix}[${functionName}]`

      if (data && Object.keys(data).length > 0) {
        console.log(`%c${label}%c ${message}`, COLORS.info, COLORS.reset, data)
      } else {
        console.log(`%c${label}%c ${message}`, COLORS.info, COLORS.reset)
      }
    },

    warn(functionName: string, message: string, data?: Record<string, unknown>): void {
      const timestamp = getTimestamp()
      const label = `${timestamp} ⚠️ ${prefix}[${functionName}]`

      if (data && Object.keys(data).length > 0) {
        console.warn(`%c${label}%c ${message}`, COLORS.warn, COLORS.reset, data)
      } else {
        console.warn(`%c${label}%c ${message}`, COLORS.warn, COLORS.reset)
      }
    },

    error(functionName: string, message: string, error?: Error | Record<string, unknown>): void {
      const timestamp = getTimestamp()
      const label = `${timestamp} ❌ ${prefix}[${functionName}]`

      if (error instanceof Error) {
        console.error(`%c${label}%c ${message}`, COLORS.error, COLORS.reset, {
          name: error.name,
          message: error.message,
          stack: error.stack,
        })
      } else if (error) {
        console.error(`%c${label}%c ${message}`, COLORS.error, COLORS.reset, error)
      } else {
        console.error(`%c${label}%c ${message}`, COLORS.error, COLORS.reset)
      }
    },
  }
}

/**
 * Helper untuk log state values dengan format yang rapi
 */
export function logState(context: string, functionName: string, state: Record<string, unknown>) {
  const timestamp = getTimestamp()
  const label = `${timestamp} 📊 [${context}][${functionName}] State:`

  console.group(`%c${label}`, COLORS.debug)
  Object.entries(state).forEach(([key, value]) => {
    console.log(`  ${key}:`, value)
  })
  console.groupEnd()
}
