# Claude Code Multi-File System Documentation

## Overview

Multi-File System adalah fitur powerful Claude Code yang memungkinkan akses dan penggunaan multiple directories secara bersamaan dalam satu development session. Fitur ini mengubah Claude Code dari single-project assistant menjadi distributed systems architecture assistant yang dapat memelihara context lintas batas proyek.

## Konsep Fundamental

### Apa itu Multi-File System?

Multi-File System memungkinkan Claude Code untuk:
- **Context Preservation**: Memelihara pemahaman arsitektural lintas multiple directories
- **Cross-Project Collaboration**: Bekerja dengan beberapa repository atau direktori tanpa kehilangan konteks sistem
- **Architectural Awareness**: Memahami dependencies, interfaces, dan integrasi antar komponen yang berada di direktori berbeda

### Mengapa Penting?

Dalam pengembangan modern dengan microservices, monorepo, atau distributed systems, developer sering bekerja dengan multiple directories yang saling terhubung. Multi-File System memecahkan masalah:

1. **Context Switching Loss**: Kehilangan pemahaman saat berpindah antar direktori
2. **Integration Mismatches**: Ketidaksesuaian API contracts, types, atau interfaces
3. **Architectural Incoherence**: Kehilangan big picture saat fokus pada komponen individual

## Syntax dan Penggunaan

### Basic Syntax

```bash
# Mengakses direktori tambahan dari current working directory
claude --add-dir /path/to/other/directory
claude --add-dir ../backend-api
claude --add-dir ../shared-libraries
claude --add-dir ../infrastructure
```

### Multiple Directories

```bash
# Mengakses multiple directories sekaligus
claude --add-dir ../frontend --add-dir ../backend --add-dir ../shared-types --add-dir ../docs
```

## Arsitektur dan Cara Kerja

### Context Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Context Management Layer                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Primary CWD   │   Secondary     │    Tertiary Contexts    │
│   (Main Proj)   │   Directories   │   (Supporting Systems)  │
├─────────────────┼─────────────────┼─────────────────────────┤
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────────────┐ │
│ │   maguru/   │ │ │  shared-lib │ │ │    deployment/      │ │
│ │  features/  │←┼→│   utils/    │←┼→│    infra-config/    │ │
│ │   course/   │ │ │   types/    │ │ │    monitoring/      │ │
│ └─────────────┘ │ └─────────────┘ │ └─────────────────────┘ │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Key Components

1. **Semantic Context Graph**: Maps relationships antar directories
2. **Cross-Project Dependency Tracking**: Maintains awareness of shared components
3. **Architectural State Persistence**: Remembers component boundaries across sessions
4. **Interface Contract Maintenance**: Preserves API boundaries between systems

## Use Cases untuk Maguru Project

### 1. Frontend-Backend Integration

**Scenario**: Developing course management feature yang membutuhkan tight integration antara frontend dan backend.

```bash
# Dari directory maguru (frontend)
claude --add-dir ../maguru-backend --add-dir ../shared-types

# Benefits:
# - API contract validation real-time
# - Type consistency across FE-BE
# - Integration testing insights
# - Performance optimization lintas stack
```

**Praktical Example**:
```typescript
// Di frontend (maguru/features/course/hooks/useCourseData.ts)
const { data, error } = useCourseData(courseId)

// Claude dapat validate bahwa API di ../maguru-backend/routes/course.js
// memiliki compatible response structure dan handle edge cases yang sama
```

### 2. Microservices Development

**Scenario**: Maguru berkembang menjadi microservices architecture dengan multiple services.

```bash
# Development session untuk user management
claude --add-dir ../course-service --add-dir ../auth-service --add-dir ../shared-libraries

# Capabilities:
# - Cross-service impact analysis
# - Event schema consistency validation
# - Shared dependency version management
# - Service mesh configuration verification
```

### 3. Full-Stack Feature Development

**Scenario**: Implementing complete feature dari database schema hingga UI components.

```bash
# Complete feature development session
claude --add-dir ../database-migrations --add-dir ../api-server --add-dir ../shared-components

# Workflow:
# 1. Database schema design dengan awareness of API requirements
# 2. API endpoint development dengan understanding of frontend needs
# 3. UI component creation dengan knowledge of data structure
# 4. Integration testing strategy across all layers
```

### 4. Infrastructure dan Application Co-evolution

**Scenario**: Application changes yang memerlukan infrastructure adjustments.

```bash
# Infrastructure-aware development
claude --add-dir ../kubernetes --add-dir ../terraform --add-dir ../monitoring

# Use cases:
# - Capacity planning based on application changes
# - Security policy updates yang consistent
# - Performance monitoring configuration
# - Deployment pipeline optimization
```

## Architectural Patterns

### 1. Context Hierarchy Strategy

```
Level 1: maguru/ (Primary - main application)
├── features/course/
├── features/auth/  
└── features/user_manage/

Level 2: ../shared-resources/ (Secondary - shared utilities)
├── shared-components/
├── shared-types/
└── shared-utils/

Level 3: ../infrastructure/ (Tertiary - deployment & ops)
├── kubernetes/
├── terraform/
└── monitoring/

Level 4: ../documentation/ (Supporting - architecture docs)
├── architecture/
├── api-contracts/
└── runbooks/
```

### 2. Feature-First Multi-Directory Development

```typescript
// Example: Course creation feature spanning multiple directories

// Primary: maguru/features/course/components/CourseCreationForm.tsx
export const CourseCreationForm = () => {
  const { createCourse } = useCourseApi() // Uses shared API client
  // Component implementation
}

// Secondary: ../shared-api/courseApi.ts
export const courseApi = {
  createCourse: (data: CourseCreateRequest): Promise<Course> => {
    // API client implementation
  }
}

// Tertiary: ../api-server/routes/course.ts
app.post('/courses', async (req: CourseCreateRequest) => {
  // Backend implementation
})
```

Claude Code dengan Multi-File System dapat:
- Validate consistency antara `CourseCreateRequest` type usage
- Ensure error handling consistency across layers
- Suggest optimization opportunities
- Identify breaking changes impact

### 3. Event-Driven Architecture Support

```bash
# Event-driven microservices development
claude --add-dir ../event-schemas --add-dir ../course-service --add-dir ../notification-service

# Capabilities:
# - Event schema evolution validation
# - Consumer-producer contract verification  
# - Event flow documentation generation
# - Dead letter queue handling consistency
```

## Best Practices

### 1. Directory Organization Strategy

**Recommended Structure**:
```
project-root/
├── main-application/          # Primary directory
├── shared-libraries/          # Secondary - reusable components
├── infrastructure/            # Tertiary - deployment configs
├── documentation/            # Supporting - architecture docs
└── testing/                  # Supporting - integration tests
```

**Usage Pattern**:
```bash
# Start from main application
cd main-application
claude --add-dir ../shared-libraries --add-dir ../infrastructure
```

### 2. Context Scope Management

**Small Projects (1-3 directories)**:
```bash
claude --add-dir ../backend --add-dir ../shared-types
# Full context loading, comprehensive analysis
```

**Medium Projects (4-7 directories)**:
```bash
claude --add-dir ../services --add-dir ../libs --add-dir ../infra --scope module
# Selective context activation, focused analysis
```

**Large Projects (8+ directories)**:
```bash
claude --add-dir ../microservices --add-dir ../shared --add-dir ../ops --scope project --concurrency 3
# Federated context management, parallel processing
```

### 3. Integration Workflow Patterns

**Development Workflow**:
```bash
# 1. Analysis phase - understand current state
claude --add-dir ../backend --add-dir ../docs --think

# 2. Implementation phase - focused development
claude --add-dir ../backend --add-dir ../shared-types --scope module

# 3. Validation phase - comprehensive testing
claude --add-dir ../backend --add-dir ../tests --add-dir ../integration --validate
```

## Advanced Use Cases

### 1. Monolith to Microservices Migration

```bash
# Migration planning session
claude --add-dir ../monolith --add-dir ../service-candidates --add-dir ../shared-infrastructure --think-hard

# Migration activities:
# - Boundary identification untuk service extraction
# - Interface contract design
# - Data migration strategy
# - Rollback plan development
```

### 2. Multi-Team Coordination

```bash
# Cross-team development session
claude --add-dir ../team-a-services --add-dir ../team-b-frontend --add-dir ../shared-standards

# Coordination benefits:
# - Code standard consistency
# - Interface agreement validation
# - Dependency conflict resolution
# - Documentation synchronization
```

### 3. Legacy System Modernization

```bash
# Legacy modernization project
claude --add-dir ../legacy-system --add-dir ../modern-replacement --add-dir ../migration-tools

# Modernization support:
# - Legacy code analysis dan understanding
# - Modern equivalent design
# - Migration strategy planning
# - Risk assessment dan mitigation
```

## Performance dan Scalability

### Context Loading Strategy

| Project Size | Directories | Loading Strategy | Performance Impact |
|--------------|-------------|------------------|-------------------|
| Small (1-3) | Full loading | Instant access | Minimal |
| Medium (4-7) | Selective loading | Context on demand | Low |
| Large (8-15) | Lazy loading | Progressive context | Moderate |
| Enterprise (15+) | Federated | Distributed context | Managed |

### Memory Management

```bash
# Efficient memory usage untuk large projects
claude --add-dir ../services --add-dir ../libs --token-efficient --uc

# Optimizations:
# - Symbol-based communication
# - Compressed context representation
# - Incremental context updates
# - Smart caching strategies
```

## Troubleshooting

### Common Issues dan Solutions

**Issue 1: Context Overload**
```
Symptom: Claude responses become slow atau incomplete
Solution: Use --scope flags untuk limit analysis depth
Example: claude --add-dir ../backend --scope file
```

**Issue 2: Path Resolution Problems**  
```
Symptom: Directory tidak dapat diakses
Solution: Gunakan absolute paths atau verify relative path
Example: claude --add-dir /full/path/to/directory
```

**Issue 3: Memory Constraints**
```
Symptom: Performance degradation dengan many directories
Solution: Use selective context loading
Example: claude --add-dir ../critical-only --concurrency 2
```

## Integrasi dengan Maguru Development Workflow

### 1. Daily Development Routine

```bash
# Morning standup - project status check
claude --add-dir ../backend --add-dir ../infra
# Check: service health, pending PRs, integration status

# Feature development session
claude --add-dir ../backend --add-dir ../shared-types --scope module
# Focus: specific feature dengan necessary context

# End-of-day review
claude --add-dir ../backend --add-dir ../tests --add-dir ../docs --validate
# Ensure: code quality, test coverage, documentation updates
```

### 2. Code Review Process

```bash
# Comprehensive code review
claude --add-dir ../feature-branch --add-dir ../main-branch --add-dir ../tests

# Review checklist:
# - Cross-directory impact analysis
# - Integration point validation
# - Performance implication assessment
# - Security boundary verification
```

### 3. Release Preparation

```bash
# Pre-release validation
claude --add-dir ../application --add-dir ../infrastructure --add-dir ../monitoring --validate

# Release activities:
# - Deployment readiness check
# - Infrastructure capacity verification
# - Monitoring configuration validation
# - Rollback plan confirmation
```

## Future Considerations

### Evolving Architecture Patterns

1. **Serverless Integration**: Multi-directory support untuk serverless functions
2. **Edge Computing**: Distributed deployment context management  
3. **AI/ML Pipeline**: Model training, deployment, monitoring coordination
4. **Multi-Cloud**: Cross-cloud resource management dan coordination

### Tool Ecosystem Integration

- **Docker/Kubernetes**: Container orchestration awareness
- **CI/CD Pipelines**: Build dan deployment coordination
- **Monitoring Systems**: Observability across service boundaries
- **Security Tools**: Security posture management across directories

## Conclusion

Multi-File System adalah foundational feature yang memungkinkan Claude Code untuk beroperasi sebagai true distributed systems assistant. Untuk proyek complex seperti Maguru yang berpotensi untuk scale dan evolve architecturally, fitur ini menjadi essential tool untuk maintaining coherence dan productivity across system boundaries.

Key benefits:
- **Architectural Coherence**: Maintain understanding across project boundaries
- **Development Velocity**: Reduce context switching overhead
- **Integration Quality**: Prevent API mismatches dan interface conflicts
- **Team Coordination**: Enable collaborative development pada complex systems
- **System Evolution**: Support architecture evolution tanpa losing context

Dengan proper implementation dari Multi-File System patterns, development teams dapat achieve higher productivity dan better system quality pada complex, distributed architectures.