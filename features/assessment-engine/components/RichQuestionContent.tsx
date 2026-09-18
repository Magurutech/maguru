'use client'

import React, { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'

interface RichQuestionContentProps {
  text: string
  className?: string
}

/**
 * AssessmentCodeSnippet
 * Mirrors the signature Atelier Zero parchment CodeBlockComponent design:
 * - Brand traffic light dots (Coral, Mustard, Olive)
 * - Atelier bone parchment container & header (#f7f1de / #ede4ce)
 * - Copy button with feedback
 * - Strict non-runnable assessment mode (no execution button)
 * - Built-in Atelier syntax styling for code lines & line numbers
 */
function AssessmentCodeSnippet({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Tokenize code lines with Atelier Zero palette syntax highlighting
  const renderHighlightedLine = (line: string, lineIndex: number) => {
    // Check if line begins with line number prefix e.g. "1: " or "10: "
    const lineNumMatch = line.match(/^(\d+:\s*)(.*)$/)
    const prefix = lineNumMatch ? lineNumMatch[1] : null
    const content = lineNumMatch ? lineNumMatch[2] : line

    // Check full line comment
    if (content.trim().startsWith('#') || content.trim().startsWith('//')) {
      return (
        <span key={lineIndex} className="block leading-relaxed">
          {prefix && (
            <span className="text-[#8c8272]/60 dark:text-[#7d776a] select-none font-mono mr-1.5">
              {prefix}
            </span>
          )}
          <span className="text-[#786131] dark:text-[#9e947e] italic font-medium">
            {content}
          </span>
        </span>
      )
    }

    // Regex tokenizer for strings, comments, keywords, builtins, numbers, and identifiers
    const tokenRegex =
      /(".*?"|'.*?'|#.*$|\/\/.*$|\b(?:def|class|if|elif|else|for|while|in|is|not|and|or|return|raise|try|except|finally|with|as|import|from|lambda|yield|pass|break|continue|None|True|False|async|await|const|let|var|function)\b|\b(?:print|input|len|range|str|int|float|bool|list|dict|set|tuple|type|isinstance|ValueError|TypeError|Exception)\b|\b\d+(?:\.\d+)?\b|[a-zA-Z_][a-zA-Z0-9_]*|[^\s\w]+|\s+)/g

    const tokens: React.ReactNode[] = []
    let match: RegExpExecArray | null
    let tokenIdx = 0

    while ((match = tokenRegex.exec(content)) !== null) {
      const token = match[0]
      const key = `${lineIndex}-${tokenIdx++}`

      if (token.startsWith('#') || token.startsWith('//')) {
        tokens.push(
          <span key={key} className="text-[#786131] dark:text-[#9e947e] italic font-medium">
            {token}
          </span>
        )
      } else if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        tokens.push(
          <span key={key} className="text-[#8b4513] dark:text-[#e0af68] font-medium">
            {token}
          </span>
        )
      } else if (
        /^(?:def|class|if|elif|else|for|while|in|is|not|and|or|return|raise|try|except|finally|with|as|import|from|lambda|yield|pass|break|continue|None|True|False|async|await|const|let|var|function)$/.test(
          token
        )
      ) {
        tokens.push(
          <span key={key} className="text-[#b34d3d] dark:text-[#c76554] font-bold">
            {token}
          </span>
        )
      } else if (
        /^(?:print|input|len|range|str|int|float|bool|list|dict|set|tuple|type|isinstance|ValueError|TypeError|Exception)$/.test(
          token
        )
      ) {
        tokens.push(
          <span key={key} className="text-[#9b722b] dark:text-[#e5c07b] font-semibold">
            {token}
          </span>
        )
      } else if (/^\d+(?:\.\d+)?$/.test(token)) {
        tokens.push(
          <span key={key} className="text-[#2d6a4f] dark:text-[#73daca] font-semibold">
            {token}
          </span>
        )
      } else {
        tokens.push(<span key={key}>{token}</span>)
      }
    }

    return (
      <span key={lineIndex} className="block leading-relaxed">
        {prefix && (
          <span className="text-[#8c8272]/60 dark:text-[#7d776a] select-none font-mono mr-1.5">
            {prefix}
          </span>
        )}
        {tokens}
      </span>
    )
  }

  const lines = code.split('\n')

  return (
    <div className="relative my-4 rounded-xl border border-[#ddd2b6] dark:border-[#37353e] bg-[#f7f1de] dark:bg-[#1e1c24] text-[#2a2620] dark:text-[#efe7d2] shadow-sm overflow-hidden font-mono text-xs">
      {/* Header bar matching CodeBlockComponent */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#ede4ce] dark:bg-[#28252f] border-b border-[#ddd2b6] dark:border-[#37353e] select-none text-[11px] text-[#4a3a34] dark:text-[#aba595]">
        <div className="flex items-center gap-2">
          {/* Traffic lights indicator with Maguru brand colors */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#b34d3d]" title="Coral" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#cfa04a]" title="Mustard" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4e533b]" title="Olive" />
          </div>

          <Code2 className="w-3.5 h-3.5 text-[#b34d3d] dark:text-[#c76554]" />
          <span className="font-mono text-[11px] font-bold uppercase text-[#2a2620] dark:text-[#efe7d2] tracking-wider">
            {lang ? lang.toUpperCase() : 'PYTHON'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button (Non-runnable in quiz assessment mode) */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#dfd5be] hover:bg-[#d5c9af] dark:bg-[#37353e] dark:hover:bg-[#474450] text-[#4a3a34] dark:text-[#ddd2b6] hover:text-[#2a2620] dark:hover:text-[#efe7d2] transition-all cursor-pointer text-[11px] font-medium"
            title="Salin Kode"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Tersalin
                </span>
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

      {/* Code Area */}
      <pre className="p-4 overflow-x-auto text-[13px] sm:text-[13.5px] leading-relaxed font-mono text-[#2a2620] dark:text-[#efe7d2] bg-transparent outline-none selection:bg-[#cfa04a]/30">
        <code>{lines.map((l, i) => renderHighlightedLine(l, i))}</code>
      </pre>
    </div>
  )
}

/**
 * RichQuestionContent
 * Parses markdown code fences (```lang ... ```) in question text
 * and renders formatted Atelier Zero code blocks without code execution.
 */
export function RichQuestionContent({ text, className = '' }: RichQuestionContentProps) {
  if (!text) return null

  // If no markdown code block is found, render text preserving line breaks
  if (!text.includes('```')) {
    return <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>{text}</div>
  }

  // Parse markdown code blocks
  const parts: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = []
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\s*\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({
      type: 'code',
      lang: match[1].trim() || 'python',
      content: match[2].trim(),
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return (
    <div className={`space-y-3 leading-relaxed ${className}`}>
      {parts.map((p, i) => {
        if (p.type === 'code') {
          return <AssessmentCodeSnippet key={i} code={p.content} lang={p.lang || 'python'} />
        }
        return (
          <div key={i} className="whitespace-pre-wrap">
            {p.content}
          </div>
        )
      })}
    </div>
  )
}
