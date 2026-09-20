'use client'

import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import {
  User,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Code2,
  Play,
  Loader2,
  Terminal,
  X,
} from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/features/langserve/types'
import { cn } from '@/lib/utils'
import { executeCode, isExecutableLanguage, type ExecutionResult } from '@/lib/code-runner/runner'
import 'katex/dist/katex.min.css'

export interface ChatMessageProps {
  message: ChatMessageType
  className?: string
  onRetry?: () => void | Promise<void>
}

/**
 * Maguru Atelier Zero Skeuomorphic CodeBlock Component
 * Matches default lesson editor/viewer with brand traffic lights and in-browser execution
 */
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  const lang = language || 'python'
  const canExecute = isExecutableLanguage(lang)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [code])

  const handleRunCode = async () => {
    if (!code || !code.trim()) return

    setIsRunning(true)
    setIsTerminalOpen(true)

    try {
      const res = await executeCode(code, lang)
      setResult(res)
    } catch (err: unknown) {
      setResult({
        stdout: '',
        stderr: err instanceof Error ? err.message : String(err),
        executionTime: 0,
        status: 'error',
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="relative my-3 rounded-xl border border-[#ddd2b6] dark:border-[#37353e] bg-[#f7f1de] dark:bg-[#1e1c24] text-[#2a2620] dark:text-[#efe7d2] shadow-xs overflow-hidden font-mono text-xs not-prose">
      {/* Header bar: Maguru Atelier Zero style with brand traffic lights */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#ede4ce] dark:bg-[#28252f] border-b border-[#ddd2b6] dark:border-[#37353e] select-none text-[11px] text-[#4a3a34] dark:text-[#aba595]">
        <div className="flex items-center gap-2">
          {/* Traffic lights indicator with Maguru brand colors: Coral, Mustard, Olive */}
          <div className="flex items-center gap-1.5 mr-0.5">
            <div className="w-2 h-2 rounded-full bg-[#b34d3d]" title="Coral" />
            <div className="w-2 h-2 rounded-full bg-[#cfa04a]" title="Mustard" />
            <div className="w-2 h-2 rounded-full bg-[#4e533b]" title="Olive" />
          </div>

          <Code2 className="w-3.5 h-3.5 text-[#b34d3d] dark:text-[#c76554]" />
          <span className="font-bold uppercase tracking-wider text-[#2a2620] dark:text-[#efe7d2] text-[10px]">
            {lang}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Run Code Button if executable */}
          {canExecute && (
            <button
              type="button"
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#b34d3d] hover:bg-[#9d3f30] text-white transition-all cursor-pointer text-[10.5px] font-semibold shadow-2xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Jalankan kode langsung di browser"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                  <span>Menjalankan...</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>Jalankan</span>
                </>
              )}
            </button>
          )}

          {/* Toggle Terminal Output if result exists */}
          {result && !isTerminalOpen && (
            <button
              type="button"
              onClick={() => setIsTerminalOpen(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#dfd5be] hover:bg-[#d5c9af] dark:bg-[#37353e] dark:hover:bg-[#474450] text-[#2d4a6b] dark:text-[#89b4fa] transition-all cursor-pointer text-[10.5px] font-medium"
              title="Tampilkan Output Terminal"
            >
              <Terminal className="w-3 h-3" />
              <span>Output</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#dfd5be] hover:bg-[#d5c9af] dark:bg-[#37353e] dark:hover:bg-[#474450] text-[#4a3a34] dark:text-[#ddd2b6] hover:text-[#2a2620] dark:hover:text-[#efe7d2] transition-all cursor-pointer text-[10.5px] font-medium"
            title="Salin Kode"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 opacity-80" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <pre className="p-3 overflow-x-auto text-[12px] font-mono leading-relaxed !text-[#2a2620] dark:!text-[#efe7d2] !bg-transparent !border-0 !m-0 outline-none select-text">
        <code>{code}</code>
      </pre>

      {/* Integrated Terminal Output Drawer */}
      {isTerminalOpen && (
        <div className="border-t border-[#ddd2b6] dark:border-[#37353e] bg-[#ebe2ca] dark:bg-[#1a191e] p-2.5 text-xs font-mono transition-all">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#ddd2b6]/70 dark:border-[#37353e]/70 text-[10px] text-[#5a5448] dark:text-zinc-400 select-none">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#2d4a6b] dark:text-[#89b4fa]" />
              <span className="font-bold text-[#4a3a34] dark:text-[#efe7d2]">Terminal Output</span>
              {result && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                    result.status === 'success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50'
                      : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/50'
                  }`}
                >
                  {result.status === 'success' ? `Selesai (${result.executionTime}ms)` : 'Error'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="p-1 hover:bg-[#dfd5be] dark:hover:bg-zinc-800 rounded text-[#5a5448] hover:text-[#2a2620] dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Bersihkan Output"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsTerminalOpen(false)}
                className="p-1 hover:bg-[#dfd5be] dark:hover:bg-zinc-800 rounded text-[#5a5448] hover:text-[#2a2620] dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Tutup Terminal"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {isRunning ? (
            <div className="flex items-center gap-2 text-[#5a5448] dark:text-zinc-400 py-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-[#b34d3d] dark:text-emerald-400" />
              <span className="font-sans text-[10.5px] font-medium">Mengeksekusi kode di browser sandbox...</span>
            </div>
          ) : result ? (
            <div className="p-2 rounded-lg bg-[#f7f1de] dark:bg-[#151419] border border-[#ddd2b6] dark:border-[#302e38] max-h-40 overflow-y-auto space-y-1">
              {result.stdout && (
                <div className="font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap select-text !text-emerald-800 dark:!text-emerald-400 font-semibold selection:bg-emerald-200">
                  {result.stdout}
                </div>
              )}
              {result.stderr && (
                <div className="font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap select-text !text-red-700 dark:!text-red-400 font-medium selection:bg-red-200">
                  {result.stderr}
                </div>
              )}
              {!result.stdout && !result.stderr && (
                <div className="text-[#8b8676] dark:text-[#777367] italic text-[10.5px]">
                  (Program selesai dijalankan tanpa output stdout)
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function ChatMessage({ message, className, onRetry }: ChatMessageProps) {
  const [messageCopied, setMessageCopied] = useState(false)

  // 1. System Divider Message (TSK-03)
  if (message.role === 'system') {
    return (
      <div className="flex items-center justify-center my-3 px-4 animate-in fade-in zoom-in-95 duration-300">
        <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 border border-border/20 rounded-full px-3.5 py-1 shadow-2xs text-center">
          {message.content}
        </span>
      </div>
    )
  }

  const isAi = message.role === 'ai'
  const isError = message.isError

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setMessageCopied(true)
      setTimeout(() => setMessageCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div
      className={cn(
        'group flex gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAi ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-xs text-xs select-none',
          isAi
            ? isError
              ? 'bg-destructive text-white'
              : 'bg-gradient-to-br from-[#b34d3d] to-[#cfa04a] text-white shadow-xs'
            : 'bg-gradient-to-br from-[#b34d3d] to-[#8d3a2e] text-white font-bold'
        )}
      >
        {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={cn(
          'relative flex-1 max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs',
          isAi
            ? isError
              ? 'bg-destructive/10 border border-destructive/25 text-foreground rounded-tl-xs'
              : 'bg-card border border-border/20 text-foreground rounded-tl-xs paper-texture'
            : 'bg-gradient-to-r from-[#b34d3d] to-[#c76554] text-white rounded-tr-xs shadow-xs'
        )}
      >
        {isAi ? (
          <div className="prose prose-xs max-w-none text-xs text-foreground leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-[#2a2620] dark:text-[#efe7d2]">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 text-[#2a2620] dark:text-[#efe7d2]">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 text-[#2a2620] dark:text-[#efe7d2]">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const codeString = String(children).replace(/\n$/, '')
                  if (match) {
                    return <CodeBlock language={match[1]} code={codeString} />
                  }
                  return (
                    <code
                      className="bg-[#f7f1de] dark:bg-[#2d2a33] text-[#b34d3d] dark:text-[#c76554] border border-[#ddd2b6] dark:border-[#37353e] font-mono px-1.5 py-0.5 rounded text-[11.5px]"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => <div className="not-prose">{children}</div>,
                h1: ({ children }) => <h1 className="text-sm font-bold mt-2 mb-1.5 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xs font-bold mt-2 mb-1 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-semibold mt-1.5 mb-0.5 text-foreground">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-[#b34d3d]/60 pl-2.5 my-1.5 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {/* Retry Button on Error (TSK-07) */}
            {isError && onRetry && (
              <div className="mt-2.5 pt-2 border-t border-destructive/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive/15 hover:bg-destructive/25 text-destructive font-medium text-[11px] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words leading-relaxed text-white font-sans">{message.content}</p>
        )}

        {/* Bubble Footer Bar (Timestamp & Copy Message Action) */}
        <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-muted-foreground select-none">
          <span>
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>

          {isAi && !isError && message.content && (
            <button
              type="button"
              onClick={handleCopyMessage}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-all cursor-pointer px-1 py-0.5 rounded"
              title="Salin seluruh teks pesan"
            >
              {messageCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 opacity-80" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
