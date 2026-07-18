"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Bot, Send } from "lucide-react"

export interface ChatInputBarProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (val: string) => void
}

export function ChatInputBar({ placeholder, value, onChange, onSubmit }: ChatInputBarProps) {
  const [inputValue, setInputValue] = React.useState(value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (onChange) onChange(e)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleSend = () => {
    if (onSubmit && inputValue.trim()) {
      onSubmit(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-bg-bone relative border border-text-faint/12 shadow-sm text-left">
      <div className="flex items-center gap-3 relative z-10">
        {/* Bot Icon Indicator */}
        <div className="w-10 h-10 rounded-xl bg-bg-surface-accent flex items-center justify-center border border-text-faint/10 text-accent-coral shrink-0">
          <Bot className="w-5 h-5" />
        </div>

        {/* Chat Input Text */}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || "Tanyakan materi..."}
          className="flex-1 bg-transparent border-none outline-none text-body-md text-text-primary placeholder:text-text-muted px-2"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-xl btn-primary btn-deckle btn-interactive flex items-center justify-center shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
