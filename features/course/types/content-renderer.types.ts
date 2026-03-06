import type { Components } from 'react-markdown'
import type { Element } from 'hast'
import type { PluggableList } from 'unified'

// Enhanced Content Renderer Props
export interface EnhancedContentRendererProps {
  content: string
  contentType: 'markdown' | 'video' | 'quiz' | 'exercise'
  className?: string
  enableMath?: boolean
  enableGFM?: boolean
  codeTheme?: 'dark' | 'light'
}

// Code Block Component Props
export interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  node?: Element
}

// Custom Link Component Props
export interface CustomLinkProps {
  href?: string
  children: React.ReactNode
  node?: Element
}

// Table Wrapper Component Props
export interface TableWrapperProps {
  children: React.ReactNode
  node?: Element
}

// Enhanced Components type with our custom components
export type MarkdownComponents = Components & {
  code: React.ComponentType<CodeBlockProps>
  a: React.ComponentType<CustomLinkProps>
  table: React.ComponentType<TableWrapperProps>
}

// Plugin Configuration Types
export interface MarkdownPluginConfig {
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  remarkRehypeOptions?: Record<string, unknown>
}

// Syntax Highlighting Theme Types
export interface CodeTheme {
  name: string
  style: Record<string, unknown>
}