# Learning Path Feature Requirements Analysis - MVP

## Task Overview
Analyze and refine Learning Path feature requirements based on user feedback for MVP implementation, focusing on simplified 2-level hierarchy and Confluence-inspired workflow.

## User Feedback Key Points
1. **Hierarchy Structure**: Simplified to Course → Sections → Pembelajaran (Learning items)
2. **Workflow**: Confluence-inspired but simplified for MVP
3. **Content Types**: MVP limited to text, PDF, images with TipTap editor
4. **Critical Decisions Made**: All key implementation decisions finalized based on user input

## Critical Decisions Finalized

### 1. Content Creation UX Flow
- **Section-First Approach**: Mandatory to create Section before Learning Items can be added
- **Sequential Creation**: One-by-one creation pattern, no bulk operations in MVP
- **Preview Strategy**: Real-time preview per Learning Item with section-level preview capability

### 2. Auto-Save Behavior
- **Conflict Resolution**: Last-write-wins strategy with 30-second auto-save intervals
- **Save Granularity**: Per Learning Item auto-save with localStorage backup
- **Recovery Mode**: Auto-recovery with user prompt for conflict scenarios

### 3. TipTap Editor Configuration
- **Image Upload**: Direct upload to Supabase on insert/paste
- **Content Limits**: 50K characters per Learning Item (sufficient for text-based learning)
- **Link Strategy**: Confluence-style internal linking with autocomplete for cross-referencing content

### 4. Mobile Creator Experience
- **View-Only Approach**: Mobile optimized for content viewing and navigation only
- **Edit Limitations**: Content creation limited to desktop/tablet for optimal UX
- **Responsive Design**: Mobile-first viewing with touch-optimized navigation

## Analysis Objectives
1. ⚡ Refined MVP Structure (2-level hierarchy)
2. 🔧 Confluence-Inspired Workflow Adaptation
3. 💾 Content Management Strategy
4. 📊 Technical Recommendations (sections count, file limits, TipTap integration)
5. 🎯 Future Features Classification

## Implementation Context
- **Technology Stack**: Next.js 15, Prisma 6, Supabase, Clerk Auth
- **Architecture**: Feature-first modular monolith, simplified for 2-developer team
- **Current State**: Course model exists (basic), no learning path structure yet
- **Design System**: Ancient Fantasy Asia theme with Shadcn UI

## Success Criteria
- Clear MVP requirements document ready for implementation
- Technical specifications with practical recommendations
- Future feature roadmap for post-MVP iterations
- Confluence-inspired workflow adapted to small team needs

## Next Steps
1. Complete systematic requirements analysis
2. Create comprehensive technical recommendations
3. Define implementation roadmap
4. Seek approval before implementation planning