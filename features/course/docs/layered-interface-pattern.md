# Layered Interface Pattern - Course Feature

## 📋 Overview

Layered Interface Pattern adalah pendekatan arsitektur untuk mengatasi masalah interface redundancy dan type safety di feature course. Pattern ini memisahkan interface berdasarkan layer dan tanggung jawab yang berbeda.

## 🏗️ Architecture Layers

### Layer 1: Database Models (Core)

```typescript
export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  status: PrismaCourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  creatorId: string // Clerk User ID
  createdAt: Date
  updatedAt: Date
}
```

**Karakteristik:**

- ✅ Sesuai dengan database schema (Prisma)
- ✅ Fokus pada data persistence
- ✅ Digunakan di service layer untuk CRUD operations
- ✅ Tidak ada field computed atau user-specific

### Layer 2: Display Models (User-Facing)

```typescript
export interface CourseCatalogItem {
  id: string
  title: string
  creator: string // Transformed from creatorId
  thumbnail: string
  rating: number
  students: number
  duration: string
  category: string
  price: number // Computed field
  enrolled: boolean // User-specific
  createdAt: string // Formatted date
  description: string
  longDescription: string
  curriculum: string[]
  wishlist: boolean // User-specific
}
```

**Karakteristik:**

- ✅ Optimized untuk UI display
- ✅ Mengandung user-specific data (enrolled, wishlist)
- ✅ Field yang di-transform (creator string, formatted dates)
- ✅ Computed fields (price, curriculum)

### Layer 3: Transformation Utilities

```typescript
export const courseTransformers = {
  toCatalogItem: (course: Course, userContext?: UserContext): CourseCatalogItem => {
    return {
      id: course.id,
      title: course.title,
      creator: 'Creator Name', // Transform dari creatorId
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      // ... transformasi lainnya
    }
  },
}
```

**Karakteristik:**

- ✅ Pure functions untuk transformasi data
- ✅ Type-safe dengan TypeScript
- ✅ Reusable di berbagai tempat
- ✅ Testable secara terpisah

## 📁 File Structure

```
features/course/
├── types/
│   └── index.ts                    # Interface definitions
├── lib/
│   ├── courseUtils.ts              # General utilities (formatting, filtering, validation)
│   ├── courseTransformers.ts       # Data transformation utilities
│   ├── mockData.ts                 # Mock data + mock utilities
│   ├── usage-examples.ts           # Usage examples
│   └── README.md                   # Documentation
```

## 🔧 Implementation Guidelines

### 1. Database Layer Usage

```typescript
// Service layer - menggunakan database model
const courses: Course[] = await courseService.getCourses()
const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED')
```

### 2. Display Layer Usage

```typescript
// UI components - menggunakan display model
interface CourseCardProps {
  course: CourseCatalogItem // Display model, bukan database model
  onEnroll: (courseId: string) => void
}
```

### 3. Transformation Usage

```typescript
// Service layer - transform database ke display
const courses: Course[] = await courseService.getCourses()
const catalogItems: CourseCatalogItem[] = courseTransformers.toCatalogItems(courses, userContext)
```

## 🎯 Benefits

### 1. Type Safety

- Clear separation antara database model dan display model
- Type error prevention saat assign model yang salah
- IntelliSense support untuk setiap layer

### 2. Maintainability

- Perubahan database tidak affect UI components
- Perubahan UI tidak affect database operations
- Transformation logic terpisah dan reusable

### 3. Scalability

- Mudah menambah field baru di display model
- Support untuk user-specific data (enrollment, wishlist)
- Flexible untuk future requirements

### 4. Testing

- Mock data terpisah untuk development
- Transformation functions bisa di-test secara terpisah
- Type-safe testing dengan TypeScript

## 🚀 Migration Strategy

### Phase 1: Add New Interfaces

```typescript
// Tambah interface baru tanpa menghapus yang lama
export interface CourseCatalogItem {
  /* new interface */
}
export interface CourseDetailView {
  /* new interface */
}

// Mark yang lama sebagai deprecated
/** @deprecated Use CourseCatalogItem instead */
export type CourseCatalog = CourseCatalogItem
```

### Phase 2: Update Components Gradually

```typescript
// Update satu per satu
interface CourseCardProps {
  course: CourseCatalogItem // Changed from CourseCatalog
}
```

### Phase 3: Remove Deprecated Interfaces

```typescript
// Setelah semua components migrated
// Hapus CourseCatalog dan CourseDetail interfaces
```

## 📝 Best Practices

### 1. Naming Convention

```typescript
// Database models: Simple names
export interface Course {}

// Display models: Descriptive names
export interface CourseCatalogItem {}
export interface CourseDetailView {}

// Transformation functions: Clear verbs
export const courseTransformers = {
  toCatalogItem: () => {},
  toDetailView: () => {},
}
```

### 2. Error Handling

```typescript
export const courseTransformers = {
  toCatalogItem: (course: Course, userContext?: UserContext): CourseCatalogItem => {
    try {
      return {
        // ... transformation
      }
    } catch (error) {
      // Fallback values
      return {
        id: course.id,
        title: course.title,
        creator: 'Unknown Creator',
        // ... safe defaults
      }
    }
  },
}
```

### 3. Performance Optimization

```typescript
// Cache transformation results
const transformationCache = new Map<string, CourseCatalogItem>()

export const courseTransformers = {
  toCatalogItem: (course: Course, userContext?: UserContext): CourseCatalogItem => {
    const cacheKey = `${course.id}-${userContext?.userId || 'anonymous'}`

    if (transformationCache.has(cacheKey)) {
      return transformationCache.get(cacheKey)!
    }

    const result = {
      /* transformation logic */
    }
    transformationCache.set(cacheKey, result)
    return result
  },
}
```

## 🔮 Future Enhancements

1. **Caching**: Implementasi cache untuk transformation results
2. **Validation**: Add validation untuk transformation input/output
3. **Error Handling**: Improve error handling untuk transformation failures
4. **Performance**: Optimize transformation untuk large datasets

## 📚 References

- [TypeScript Interface Documentation](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
