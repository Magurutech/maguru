'use client'

import React from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Heading1, Heading2, Heading3, Quote, List, ListOrdered,
  CheckSquare, Minus, Table, Columns, ChevronsUpDown,
} from 'lucide-react'

interface BrowseModalProps {
  isOpen: boolean
  onClose: () => void
  editor: any
}

const TOOLS = [
  // ── Formatting ─────────────────────────────────────────────────────────────
  {
    title: 'Heading 1',
    description: 'Large section heading',
    shortcut: '⌃⌥1',
    category: 'Formatting',
    icon: Heading1,
    command: (chain: any) => chain.setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    shortcut: '⌃⌥2',
    category: 'Formatting',
    icon: Heading2,
    command: (chain: any) => chain.setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    shortcut: '⌃⌥3',
    category: 'Formatting',
    icon: Heading3,
    command: (chain: any) => chain.setNode('heading', { level: 3 }).run(),
  },
  {
    title: 'Blockquote',
    description: 'Insert a quoted block',
    shortcut: '⌃⇧B',
    category: 'Formatting',
    icon: Quote,
    command: (chain: any) => chain.toggleBlockquote().run(),
  },
  {
    title: 'Divider',
    description: 'Insert a horizontal rule',
    shortcut: '',
    category: 'Formatting',
    icon: Minus,
    command: (chain: any) => chain.setHorizontalRule().run(),
  },
  // ── Lists ───────────────────────────────────────────────────────────────────
  {
    title: 'Bulleted List',
    description: 'Unordered bullet list',
    shortcut: '⌃⇧8',
    category: 'Lists',
    icon: List,
    command: (chain: any) => chain.toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered numbered list',
    shortcut: '⌃⇧7',
    category: 'Lists',
    icon: ListOrdered,
    command: (chain: any) => chain.toggleOrderedList().run(),
  },
  {
    title: 'Task List',
    description: 'Checklist with checkboxes',
    shortcut: '⌃⇧9',
    category: 'Lists',
    icon: CheckSquare,
    command: (chain: any) => chain.toggleTaskList().run(),
  },
  // ── Layouts & Blocks ────────────────────────────────────────────────────────
  {
    title: 'Table',
    description: 'Insert a 3×3 table',
    shortcut: '⇧⌥T',
    category: 'Layouts & Blocks',
    icon: Table,
    command: (chain: any) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Column Layout',
    description: 'Two-column side-by-side layout',
    shortcut: '',
    category: 'Layouts & Blocks',
    icon: Columns,
    command: (chain: any) => chain.insertColumns(2).run(),
  },
  {
    title: 'Expand Block',
    description: 'Collapsible details block',
    shortcut: '',
    category: 'Layouts & Blocks',
    icon: ChevronsUpDown,
    command: (chain: any) => chain.insertContent(
      `<details class="details-block"><summary>Summary</summary><p>Write detail content here...</p></details>`
    ).run(),
  },
]

const FORMATTING = TOOLS.filter(t => t.category === 'Formatting')
const LISTS      = TOOLS.filter(t => t.category === 'Lists')
const LAYOUTS    = TOOLS.filter(t => t.category === 'Layouts & Blocks')

export const BrowseModal: React.FC<BrowseModalProps> = ({ isOpen, onClose, editor }) => {
  const handleSelect = (tool: typeof TOOLS[0]) => {
    if (!editor) return
    tool.command(editor.chain().focus())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden p-0 max-w-lg border border-border/10 rounded-2xl shadow-2xl bg-card font-manrope">
        {/* Accessible title — visually hidden since CommandInput acts as the label */}
        <VisuallyHidden>
          <DialogTitle>Browse editor tools</DialogTitle>
        </VisuallyHidden>

        <Command className="rounded-2xl paper-texture [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-text-faint/60 [&_[cmdk-input]]:h-11 [&_[cmdk-item]]:rounded-xl [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item][data-selected=true]]:bg-accent-coral/10 [&_[cmdk-item][data-selected=true]]:text-text-primary">
          <CommandInput
            placeholder="Search blocks and tools..."
            className="font-manrope text-sm text-text-primary placeholder:text-text-faint/50 border-b border-border/10"
          />

          <CommandList className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent p-2">
            <CommandEmpty className="py-10 text-center text-sm text-text-faint">
              No tools found.
            </CommandEmpty>

            {/* ── Formatting ── */}
            <CommandGroup heading="Formatting">
              {FORMATTING.map(tool => (
                <CommandItem
                  key={tool.title}
                  value={`${tool.title} ${tool.description}`}
                  onSelect={() => handleSelect(tool)}
                  className="flex items-center gap-3 cursor-pointer text-text-secondary transition-colors"
                >
                  <span className="p-1.5 rounded-lg bg-bg-bone/60 border border-border/5 text-text-muted shrink-0">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary">{tool.title}</span>
                    <span className="text-[10px] text-text-faint/80 leading-normal">{tool.description}</span>
                  </div>
                  {tool.shortcut && (
                    <CommandShortcut className="text-[10px] text-text-faint/50 font-mono ml-auto shrink-0">
                      {tool.shortcut}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1 bg-border/10" />

            {/* ── Lists ── */}
            <CommandGroup heading="Lists">
              {LISTS.map(tool => (
                <CommandItem
                  key={tool.title}
                  value={`${tool.title} ${tool.description}`}
                  onSelect={() => handleSelect(tool)}
                  className="flex items-center gap-3 cursor-pointer text-text-secondary transition-colors"
                >
                  <span className="p-1.5 rounded-lg bg-bg-bone/60 border border-border/5 text-text-muted shrink-0">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary">{tool.title}</span>
                    <span className="text-[10px] text-text-faint/80 leading-normal">{tool.description}</span>
                  </div>
                  {tool.shortcut && (
                    <CommandShortcut className="text-[10px] text-text-faint/50 font-mono ml-auto shrink-0">
                      {tool.shortcut}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1 bg-border/10" />

            {/* ── Layouts & Blocks ── */}
            <CommandGroup heading="Layouts &amp; Blocks">
              {LAYOUTS.map(tool => (
                <CommandItem
                  key={tool.title}
                  value={`${tool.title} ${tool.description}`}
                  onSelect={() => handleSelect(tool)}
                  className="flex items-center gap-3 cursor-pointer text-text-secondary transition-colors"
                >
                  <span className="p-1.5 rounded-lg bg-bg-bone/60 border border-border/5 text-text-muted shrink-0">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary">{tool.title}</span>
                    <span className="text-[10px] text-text-faint/80 leading-normal">{tool.description}</span>
                  </div>
                  {tool.shortcut && (
                    <CommandShortcut className="text-[10px] text-text-faint/50 font-mono ml-auto shrink-0">
                      {tool.shortcut}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
