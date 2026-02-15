'use client'

import { ContentRenderer } from '@/features/course/components/ContentRenderer'
import { readFileSync } from 'fs'
import { join } from 'path'

export default function TestContentRendererPage() {
  // Read test markdown content
  const testContent = `# Testing Enhanced ContentRenderer

## GitHub Flavored Markdown Features

### Tables
| Feature | Status | Notes |
|---------|--------|-------|
| Headers | ✅ Working | H1-H4 supported |
| Code Blocks | ✅ Working | Syntax highlighting active |
| Tables | ✅ Working | GFM enabled |
| Math | ✅ Working | KaTeX integration |

### Task Lists
- [x] Replace manual regex parsing
- [x] Implement ReactMarkdown
- [x] Add syntax highlighting
- [ ] Test with real course content
- [ ] Add tab interface

### Code Example
\`\`\`javascript
// Enhanced ContentRenderer with react-markdown
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const EnhancedRenderer = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
)
\`\`\`

### Mathematical Expressions
Inline math: $E = mc^2$

Block math:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### Links and Formatting
**Bold text** and *italic text* with [external link](https://example.com) and [internal link](#testing-enhanced-contentrenderer).

### Blockquote
> This is a blockquote with the Ancient Fantasy Asia theme styling. It should have a yellow border and beige background.

---

**Enhanced ContentRenderer v1.0 successfully implemented!**`

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-beige-900 mb-4">
            Enhanced ContentRenderer Test Page
          </h1>
          <p className="text-beige-700">
            Testing the new react-markdown based ContentRenderer with:
          </p>
          <ul className="list-disc list-inside text-beige-700 mt-2">
            <li>GitHub Flavored Markdown (tables, task lists)</li>
            <li>Syntax highlighting with 300+ languages</li>
            <li>Mathematical expressions with KaTeX</li>
            <li>Ancient Fantasy Asia theme integration</li>
            <li>Copy-to-clipboard functionality</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-beige-200">
          <ContentRenderer
            content={testContent}
            contentType="markdown"
            className="test-content"
          />
        </div>

        <div className="mt-8 p-4 bg-beige-100 rounded-lg">
          <h2 className="text-xl font-semibold text-beige-900 mb-2">
            Expected Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-beige-700">
            <div>
              <h3 className="font-semibold text-beige-800">✅ Should Work:</h3>
              <ul className="list-disc list-inside mt-1">
                <li>Proper heading hierarchy</li>
                <li>Responsive table with borders</li>
                <li>Syntax highlighted code block</li>
                <li>Task list with checkboxes</li>
                <li>Mathematical expressions</li>
                <li>Links with external icons</li>
                <li>Blockquote with yellow border</li>
                <li>Copy button on code blocks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-beige-800">🎨 Theme Elements:</h3>
              <ul className="list-disc list-inside mt-1">
                <li>Beige color hierarchy (900→700)</li>
                <li>Red action color for links</li>
                <li>Yellow accent for blockquotes</li>
                <li>Dark theme for code blocks</li>
                <li>Ancient Fantasy Asia styling</li>
                <li>Consistent spacing (4px scale)</li>
                <li>Smooth hover transitions</li>
                <li>Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}