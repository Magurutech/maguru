import * as React from "react"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  sender: 'ai' | 'user'
  senderName: string
  avatarContent?: React.ReactNode
}

export function ChatBubble({ className, sender, senderName, avatarContent, children, ...props }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3",
        sender === 'user' && "justify-end",
        className
      )}
      {...props}
    >
      {/* Avatar (Left for AI) */}
      {sender === 'ai' && (
        <div className="w-10 h-10 rounded-xl coral-skeuo flex items-center justify-center shrink-0 shadow-sm">
          {avatarContent || <Sparkles className="w-5 h-5 text-white" />}
        </div>
      )}

      {/* Bubble Box */}
      <div
        className={cn(
          "p-4 text-body-md shadow-sm border border-text-faint/10 max-w-[85%]",
          sender === 'ai' ? "chat-bubble-ai text-left" : "chat-bubble-user text-right"
        )}
      >
        <div
          className={cn(
            "font-semibold text-caption mb-1 flex items-center gap-1",
            sender === 'ai' ? "text-accent-coral" : "text-text-muted",
            sender === 'user' && "justify-end"
          )}
        >
          {senderName}
          {sender === 'ai' && <Sparkles className="w-3 h-3 fill-accent-coral/20" />}
        </div>
        {children}
      </div>

      {/* Avatar (Right for User) */}
      {sender === 'user' && (
        <div className="w-10 h-10 rounded-xl bg-bg-surface-accent flex items-center justify-center shrink-0 border border-text-faint/15 shadow-sm font-cinzel font-bold text-text-primary text-sm">
          {avatarContent || (senderName[0] || 'U')}
        </div>
      )}
    </div>
  )
}
