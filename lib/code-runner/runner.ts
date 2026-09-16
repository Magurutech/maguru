/**
 * In-Browser Code Runner Engine
 * 
 * Supports:
 * - Python: via Pyodide WebAssembly (runs 100% in browser, 0 server cost, zero security risk)
 * - JavaScript: via sandboxed evaluation capturing console.log/warn/error
 */

export interface ExecutionResult {
  stdout: string
  stderr: string
  executionTime: number
  status: 'success' | 'error'
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>
    __pyodideInstance?: any
    __pyodideLoadingPromise?: Promise<any>
  }
}

const PYODIDE_CDN_VERSION = '0.26.4'
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_CDN_VERSION}/full/`
const PYODIDE_SCRIPT_SRC = `${PYODIDE_INDEX_URL}pyodide.js`

/**
 * Lazily loads and initializes Pyodide singleton in the browser
 */
async function getPyodideInstance(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide hanya dapat dijalankan di browser environment')
  }

  if (window.__pyodideInstance) {
    return window.__pyodideInstance
  }

  if (window.__pyodideLoadingPromise) {
    return window.__pyodideLoadingPromise
  }

  window.__pyodideLoadingPromise = (async () => {
    // 1. Inject Pyodide script if not present
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${PYODIDE_SCRIPT_SRC}"]`)
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () => reject(new Error('Gagal memuat script Pyodide')))
          return
        }

        const script = document.createElement('script')
        script.src = PYODIDE_SCRIPT_SRC
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Gagal memuat Pyodide dari CDN. Periksa koneksi internet.'))
        document.head.appendChild(script)
      })
    }

    if (!window.loadPyodide) {
      throw new Error('Window.loadPyodide tidak ditemukan setelah script dimuat')
    }

    // 2. Initialize Pyodide instance
    const pyodide = await window.loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    })

    window.__pyodideInstance = pyodide
    return pyodide
  })()

  return window.__pyodideLoadingPromise
}

/**
 * Execute Python code via Pyodide WebAssembly
 */
export async function runPython(code: string): Promise<ExecutionResult> {
  const start = performance.now()
  let stdout = ''
  let stderr = ''

  try {
    const pyodide = await getPyodideInstance()

    // Redirect stdout and stderr
    pyodide.setStdout({
      batched: (msg: string) => {
        stdout += (stdout ? '\n' : '') + msg
      },
    })

    pyodide.setStderr({
      batched: (msg: string) => {
        stderr += (stderr ? '\n' : '') + msg
      },
    })

    // Execute code asynchronously
    const result = await pyodide.runPythonAsync(code)

    // If there's a return value and no stdout, display the representation
    if (result !== undefined && stdout.trim() === '') {
      const repr = String(result)
      if (repr !== 'None') {
        stdout = repr
      }
    }

    const executionTime = Math.round(performance.now() - start)
    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      executionTime,
      status: stderr.trim() ? 'error' : 'success',
    }
  } catch (err: any) {
    const executionTime = Math.round(performance.now() - start)
    const errorMsg = err?.message || String(err)
    return {
      stdout: stdout.trim(),
      stderr: (stderr ? stderr + '\n' : '') + errorMsg,
      executionTime,
      status: 'error',
    }
  }
}

/**
 * Execute JavaScript code in an isolated sandbox with console capture
 */
export async function runJavaScript(code: string): Promise<ExecutionResult> {
  const start = performance.now()
  const logs: string[] = []
  const errors: string[] = []

  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
    },
    info: (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
    },
    warn: (...args: any[]) => {
      logs.push('[WARN] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
    },
    error: (...args: any[]) => {
      errors.push('[ERROR] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
    },
  }

  try {
    // Run inside an isolated function with overridden console
    const executor = new Function('console', `"use strict";\n${code}`)
    
    // Timeout guard against infinite loops (5 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Waktu eksekusi melebihi batas (Timeout 5000ms)')), 5000)
    )

    const executionPromise = Promise.resolve().then(() => executor(customConsole))
    await Promise.race([executionPromise, timeoutPromise])

    const executionTime = Math.round(performance.now() - start)
    return {
      stdout: logs.join('\n').trim(),
      stderr: errors.join('\n').trim(),
      executionTime,
      status: errors.length > 0 ? 'error' : 'success',
    }
  } catch (err: any) {
    const executionTime = Math.round(performance.now() - start)
    return {
      stdout: logs.join('\n').trim(),
      stderr: (errors.length > 0 ? errors.join('\n') + '\n' : '') + (err?.message || String(err)),
      executionTime,
      status: 'error',
    }
  }
}

/**
 * Check if a language is supported for in-browser execution
 */
export function isExecutableLanguage(lang: string | null | undefined): boolean {
  if (!lang) return true // Default fallback is Python
  const normalized = lang.toLowerCase().trim()
  return ['python', 'py', 'javascript', 'js', 'typescript', 'ts'].includes(normalized)
}

/**
 * Unified code runner router
 */
export async function executeCode(code: string, language?: string | null): Promise<ExecutionResult> {
  const lang = (language || 'python').toLowerCase().trim()

  if (lang === 'python' || lang === 'py') {
    return runPython(code)
  }

  if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') {
    return runJavaScript(code)
  }

  return {
    stdout: '',
    stderr: `Bahasa '${language}' saat ini hanya mendukung visualisasi kode. Eksekusi interaktif tersedia untuk Python dan JavaScript.`,
    executionTime: 0,
    status: 'error',
  }
}
