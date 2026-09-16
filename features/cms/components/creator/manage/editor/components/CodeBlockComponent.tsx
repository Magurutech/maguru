'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import { Check, Copy, Code2, Play, Loader2, Terminal, RotateCcw, X } from 'lucide-react'
import { executeCode, isExecutableLanguage, type ExecutionResult } from '@/lib/code-runner/runner'

export function CodeBlockComponent({ node, updateAttributes }: NodeViewProps) {
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  const language = node.attrs.language || 'python'
  const canExecute = isExecutableLanguage(language)

  const handleCopy = () => {
    const text = node.textContent
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({ language: e.target.value })
  }

  const handleRunCode = async () => {
    const code = node.textContent
    if (!code || !code.trim()) return

    setIsRunning(true)
    setIsTerminalOpen(true)

    try {
      const res = await executeCode(code, language)
      setResult(res)
    } catch (err: any) {
      setResult({
        stdout: '',
        stderr: err?.message || String(err),
        executionTime: 0,
        status: 'error',
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <NodeViewWrapper className="relative my-4 rounded-xl border border-[#ddd2b6] dark:border-[#37353e] bg-[#f7f1de] dark:bg-[#1e1c24] text-[#2a2620] dark:text-[#efe7d2] shadow-sm overflow-hidden font-mono text-xs">
      {/* Header bar: Light mode Atelier Zero style with language picker and action buttons */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#ede4ce] dark:bg-[#28252f] border-b border-[#ddd2b6] dark:border-[#37353e] select-none text-[11px] text-[#4a3a34] dark:text-[#aba595]">
        <div className="flex items-center gap-2">
          {/* Traffic lights indicator with Maguru brand colors */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#b34d3d]" title="Coral" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#cfa04a]" title="Mustard" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4e533b]" title="Olive" />
          </div>

          <Code2 className="w-3.5 h-3.5 text-[#b34d3d] dark:text-[#c76554]" />
          <select
            contentEditable={false}
            value={language}
            onChange={handleLanguageChange}
            aria-label="Pilih bahasa pemrograman"
            className="bg-transparent border-none text-[11px] font-bold uppercase text-[#2a2620] dark:text-[#efe7d2] focus:outline-none cursor-pointer tracking-wider"
          >
            <option value="python" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">PYTHON</option>
            <option value="javascript" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">JAVASCRIPT</option>
            <option value="typescript" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">TYPESCRIPT</option>
            <option value="html" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">HTML</option>
            <option value="css" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">CSS</option>
            <option value="sql" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">SQL</option>
            <option value="bash" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">BASH/SHELL</option>
            <option value="json" className="bg-[#ede4ce] text-[#2a2620] dark:bg-[#28252f] dark:text-[#efe7d2]">JSON</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Run Code Button */}
          {canExecute && (
            <button
              type="button"
              contentEditable={false}
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#b34d3d] hover:bg-[#9d3f30] text-white transition-all cursor-pointer text-[11px] font-semibold shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Jalankan kode langsung di browser"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                  <span>Menjalankan...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-white" />
                  <span>Jalankan</span>
                </>
              )}
            </button>
          )}

          {/* Toggle Terminal Output button if result exists */}
          {result && !isTerminalOpen && (
            <button
              type="button"
              contentEditable={false}
              onClick={() => setIsTerminalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#dfd5be] hover:bg-[#d5c9af] dark:bg-[#37353e] dark:hover:bg-[#474450] text-[#2d4a6b] dark:text-[#89b4fa] transition-all cursor-pointer text-[11px] font-medium"
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
            contentEditable={false}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#dfd5be] hover:bg-[#d5c9af] dark:bg-[#37353e] dark:hover:bg-[#474450] text-[#4a3a34] dark:text-[#ddd2b6] hover:text-[#2a2620] dark:hover:text-[#efe7d2] transition-all cursor-pointer text-[11px] font-medium"
            title="Salin Kode"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content Area: light mode bone background with high-contrast walnut ink text */}
      <pre className="p-4 overflow-x-auto text-[13.5px] leading-relaxed font-mono !text-[#2a2620] dark:!text-[#efe7d2] !bg-[#f7f1de] dark:!bg-[#1e1c24] m-0 border-0">
        <NodeViewContent<'code'> as="code" className="font-mono !text-[#2a2620] dark:!text-[#efe7d2] !bg-transparent block select-text" />
      </pre>

      {/* Integrated Terminal Output Drawer: Light mode parchment card */}
      {isTerminalOpen && (
        <div className="border-t border-[#ddd2b6] dark:border-[#37353e] bg-[#ebe2ca] dark:bg-[#1a191e] p-3.5 text-xs font-mono transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#ddd2b6]/70 dark:border-[#37353e]/70 text-[11px] text-[#5a5448] dark:text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#2d4a6b] dark:text-[#89b4fa]" />
              <span className="font-bold text-[#4a3a34] dark:text-[#efe7d2]">Terminal Output</span>
              {result && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    result.status === 'success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50'
                      : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/50'
                  }`}
                >
                  {result.status === 'success' ? `Selesai (${result.executionTime}ms)` : 'Error'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                contentEditable={false}
                onClick={() => setResult(null)}
                className="p-1 hover:bg-[#dfd5be] dark:hover:bg-zinc-800 rounded text-[#5a5448] hover:text-[#2a2620] dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Bersihkan Output"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                type="button"
                contentEditable={false}
                onClick={() => setIsTerminalOpen(false)}
                className="p-1 hover:bg-[#dfd5be] dark:hover:bg-zinc-800 rounded text-[#5a5448] hover:text-[#2a2620] dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Tutup Terminal"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {isRunning ? (
            <div className="flex items-center gap-2 text-[#5a5448] dark:text-zinc-400 py-3">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b34d3d] dark:text-emerald-400" />
              <span className="font-sans text-[11px] font-medium">Mengeksekusi kode di browser sandbox...</span>
            </div>
          ) : result ? (
            <div className="p-3 rounded-lg bg-[#f7f1de] dark:bg-[#151419] border border-[#ddd2b6] dark:border-[#302e38] max-h-60 overflow-y-auto space-y-1.5">
              {result.stdout && (
                <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap select-text !text-emerald-800 dark:!text-emerald-400 font-semibold selection:bg-emerald-200">
                  {result.stdout}
                </div>
              )}
              {result.stderr && (
                <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap select-text !text-red-700 dark:!text-red-400 font-medium selection:bg-red-200">
                  {result.stderr}
                </div>
              )}
              {!result.stdout && !result.stderr && (
                <div className="text-[#8b8676] dark:text-[#777367] italic text-[11px]">
                  (Program selesai dijalankan tanpa output stdout)
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </NodeViewWrapper>
  )
}
