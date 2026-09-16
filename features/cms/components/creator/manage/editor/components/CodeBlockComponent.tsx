'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import { Check, Copy, Code2 } from 'lucide-react'

export function CodeBlockComponent({ node, updateAttributes }: NodeViewProps) {
  const [copied, setCopied] = useState(false)
  const language = node.attrs.language || 'python'

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

  return (
    <NodeViewWrapper className="relative my-4 rounded-xl border border-zinc-800 bg-[#1e1e2e] text-[#cdd6f4] shadow-md overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#181825] border-b border-zinc-800 select-none text-[11px] text-[#a6adc8]">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-[#89b4fa]" />
          <select
            contentEditable={false}
            value={language}
            onChange={handleLanguageChange}
            aria-label="Pilih bahasa pemrograman"
            className="bg-transparent border-none text-[11px] font-semibold uppercase text-[#89b4fa] focus:outline-none cursor-pointer tracking-wider"
          >
            <option value="python" className="bg-[#181825] text-[#cdd6f4]">PYTHON</option>
            <option value="javascript" className="bg-[#181825] text-[#cdd6f4]">JAVASCRIPT</option>
            <option value="typescript" className="bg-[#181825] text-[#cdd6f4]">TYPESCRIPT</option>
            <option value="html" className="bg-[#181825] text-[#cdd6f4]">HTML</option>
            <option value="css" className="bg-[#181825] text-[#cdd6f4]">CSS</option>
            <option value="sql" className="bg-[#181825] text-[#cdd6f4]">SQL</option>
            <option value="bash" className="bg-[#181825] text-[#cdd6f4]">BASH/SHELL</option>
            <option value="json" className="bg-[#181825] text-[#cdd6f4]">JSON</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          contentEditable={false}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-[#a6adc8] hover:text-[#cdd6f4] transition-all cursor-pointer text-[10px] font-medium"
          title="Salin Kode"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#a6e3a1]" />
              <span className="text-[#a6e3a1]">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  )
}
