# React-Markdown Implementation Plan
**Date**: 2025-01-18
**Project**: Maguru Course Management System
**Scope**: Course Page Enhancement dengan React-Markdown Ecosystem

## Current State Analysis

### ✅ Dependencies Already Available
Beruntung sekali, package.json sudah memiliki semua dependencies yang kita butuhkan:
- react-markdown: ^10.1.0 ✅
- react-syntax-highlighter: ^16.1.0 ✅
- remark-gfm: ^4.0.1 ✅
- remark-math: ^6.0.0 ✅
- rehype-katex: ^7.0.1 ✅
- rehype-raw: ^7.0.0 ✅
- @radix-ui/react-tabs: ^1.1.13 ✅

### 🔍 Current ContentRenderer Issues
1. Manual regex-based markdown parsing (lines 12-74)
2. Fragile HTML injection dengan dangerouslySetInnerHTML (line 127)
3. Limited syntax highlighting (basic CSS only)
4. No GitHub Flavored Markdown support
5. No mathematical expressions support
6. Complex dan maintenance-heavy code

## Task Breakdown Structure

### Epic 1: Enhanced ContentRenderer Implementation (Foundation)
**Timeline**: Week 1
**Priority**: High

### Epic 2: Tab Interface Implementation  
**Timeline**: Week 1-2
**Priority**: High

### Epic 3: Course Structure Integration
**Timeline**: Week 2
**Priority**: Medium

### Epic 4: Testing & Polish
**Timeline**: Week 2-3
**Priority**: Medium

## Technical Implementation Strategy

### Phase 1: Enhanced ContentRenderer (Minggu 1)
- Replace manual parsing dengan react-markdown
- Implement advanced syntax highlighting
- Add GitHub Flavored Markdown support
- Add mathematical expressions support
- Integrate dengan Ancient Fantasy Asia theme

### Phase 2: Tab Interface (Minggu 1-2)  
- Create TabNavigation component
- Implement Overview tab
- Implement Timeline tab
- Add tab state management

### Phase 3: Course Integration (Minggu 2)
- Update course detail page
- Integrate dengan existing course data
- Add progress tracking
- Mobile optimization

### Phase 4: Testing & Polish (Minggu 2-3)
- Component testing
- Integration testing
- Performance optimization
- Accessibility validation

## Success Criteria
- ✅ React-markdown ecosystem fully integrated
- ✅ 300+ language syntax highlighting support  
- ✅ GitHub Flavored Markdown working
- ✅ Mathematical expressions rendering
- ✅ Tab interface functional
- ✅ Mobile responsive design
- ✅ Ancient Fantasy Asia theme consistent
- ✅ Performance <100ms render time
- ✅ WCAG 2.1 AA compliance

## Next Steps
1. Create detailed task breakdown per Epic
2. Start dengan Epic 1: ContentRenderer enhancement
3. Parallel development untuk Tab interface
4. Integration testing untuk complete feature

## Key Technical Decisions
- React-markdown over MDX (simpler maintenance)
- Modular component approach
- Lazy loading untuk performance
- Custom theme matching design system
- Mobile-first responsive design