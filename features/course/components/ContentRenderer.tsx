'use client'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { Components } from 'react-markdown'
import { ContentRendererProps } from '../types/course.types'
import { EnhancedContentRendererProps } from '../types/content-renderer.types'
import { CodeBlock } from './CodeBlock'
import { CustomLink } from './CustomLink'
import { TableWrapper } from './TableWrapper'

export function ContentRenderer({ content, contentType, className = '' }: ContentRendererProps) {
  // Memoize plugin configuration for performance
  const plugins = useMemo(() => ({
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex]
  }), [])

  // Memoize custom components for markdown rendering
  const components: Components = useMemo(() => ({
    // Typography with Ancient Fantasy Asia theme
    //eslint-disable-next-line 
    h1: ({ children, ...props }: any) => (
      <h1 className="text-3xl font-bold text-beige-900 mb-6 mt-8 scroll-mt-20" {...props}>
        {children}
      </h1>
    ),
    //eslint-disable-next-line
    h2: ({ children, ...props }: any) => (
      <h2 className="text-2xl font-bold text-beige-900 mb-4 mt-8 scroll-mt-20" {...props}>
        {children}
      </h2>
    ),
    //eslint-disable-next-line
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl font-semibold text-beige-900 mb-3 mt-6 scroll-mt-20" {...props}>
        {children}
      </h3>
    ),
    //eslint-disable-next-line
    h4: ({ children, ...props }: any) => (
      <h4 className="text-lg font-semibold text-beige-900 mb-3 mt-6 scroll-mt-20" {...props}>
        {children}
      </h4>
    ),
    //eslint-disable-next-line
    p: ({ children, ...props }: any) => {
      // Check if paragraph contains code blocks to avoid <p><pre> nesting error
      const hasCodeBlock = React.Children.toArray(children).some((child: any) =>
        React.isValidElement(child) &&
        (child.type === 'pre' ||
         (child.type === 'div' && child.props?.className?.includes('bg-gray-900')))
      )

      if (hasCodeBlock) {
        // Render as div to avoid invalid <p><pre> nesting
        return (
          <div className="mb-4 text-beige-700 leading-relaxed" {...props}>
            {children}
          </div>
        )
      }

      return (
        <p className="mb-4 text-beige-700 leading-relaxed" {...props}>
          {children}
        </p>
      )
    },

    // Interactive elements
    //eslint-disable-next-line
    a: CustomLink as any,

    // Code elements
    //eslint-disable-next-line
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="bg-beige-100 text-beige-800 px-2 py-1 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        )
      }
      return (
        <CodeBlock className={className} node={node} {...props}>
          {children}
        </CodeBlock>
      )
    },

    // Structural elements
    //eslint-disable-next-line
    pre: ({ children, ...props }: any) => <>{children}</>,

    //eslint-disable-next-line
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-kuning-400 pl-4 py-2 mb-4 bg-beige-50 italic text-beige-700" {...props}>
        {children}
      </blockquote>
    ),

    // Tables with responsive wrapper
    //eslint-disable-next-line
    table: TableWrapper as any,
    //eslint-disable-next-line
    thead: ({ children, ...props }: any) => (
      <thead className="bg-beige-100" {...props}>
        {children}
      </thead>
    ),
    //eslint-disable-next-line
    th: ({ children, ...props }: any) => (
      <th className="border border-beige-300 px-4 py-2 text-left font-semibold text-beige-900" {...props}>
        {children}
      </th>
    ),
    //eslint-disable-next-line
    td: ({ children, ...props }: any) => (
      <td className="border border-beige-300 px-4 py-2 text-beige-700" {...props}>
        {children}
      </td>
    ),

    // Lists
    //eslint-disable-next-line
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-beige-700" {...props}>
        {children}
      </ul>
    ),
    //eslint-disable-next-line
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-beige-700" {...props}>
        {children}
      </ol>
    ),
    //eslint-disable-next-line
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),

    // Other elements
    //eslint-disable-next-line
    hr: ({ ...props }: any) => (
      <hr className="border-0 border-t-2 border-beige-300 my-8" {...props} />
    ),
    //eslint-disable-next-line
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-beige-900 not-prose" style={{ fontWeight: '700' }} {...props}>
        {children}
      </strong>
    ),
    //eslint-disable-next-line
    em: ({ children, ...props }: any) => (
      <em className="italic text-beige-800 not-prose" style={{ fontStyle: 'italic' }} {...props}>
        {children}
      </em>
    )
  }), [])

  // Render content based on type
  const renderContent = () => {
    switch (contentType) {
      case 'markdown':
        return (
          <div className={`prose prose-lg max-w-none ${className}`}>
            <ReactMarkdown
              remarkPlugins={plugins.remarkPlugins}
              rehypePlugins={plugins.rehypePlugins}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        )

      case 'video':
        return (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Video content not yet supported</p>
          </div>
        )

      case 'quiz':
        return (
          <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
            <p className="text-beige-700">Quiz content not yet supported</p>
          </div>
        )

      case 'exercise':
        return (
          <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
            <p className="text-beige-700">Exercise content not yet supported</p>
          </div>
        )

      default:
        return (
          <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
            <p className="text-beige-700">Content type not supported</p>
          </div>
        )
    }
  }

  return renderContent()
}