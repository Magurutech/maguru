# Course Feature - Layered Interface Pattern

## 📋 Overview

Implementasi **Layered Interface Pattern** untuk mengatasi masalah interface redundancy dan type safety di feature course. Pattern ini memisahkan interface berdasarkan layer dan tanggung jawab yang berbeda.

## 🏗️ Architecture

### Layer 1: Database Models

- **Interface**: `Course`
- **Purpose**: CRUD operations, sesuai dengan Prisma schema
- **Usage**: Service layer, database operations

### Layer 2: Display Models

- **Interface**: `CourseCatalogItem`, `CourseDetailView`
- **Purpose**: User-facing UI, dengan field yang di-transform
- **Usage**: React components, UI display

### Layer 3: Transformation Utilities

- **Functions**: `courseTransformers`, `mockCourseTransformers`
- **Purpose**: Convert antara database model dan display model
- **Usage**: Service layer, data transformation

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
│   └── README.md                   # Dokumentasi ini
```

## 🔧 Usage Examples

### Database Layer (Course Management)

```typescript
import { Course } from '../types'
import { mockCourseUtils } from '../lib'

// Get courses dalam format database
const courses: Course[] = mockCourseUtils.getCourses()

// Filter berdasarkan status
const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED')
```

### Display Layer (Course Catalog)

```typescript
import { CourseCatalogItem } from '../types'
import { mockCourseUtils } from '../lib'

// Get courses dalam format display
const catalogItems: CourseCatalogItem[] = mockCourseUtils.getCatalogItems()

// Handle user interactions
const handleEnroll = (courseId: string) => {
  const course = catalogItems.find((item) => item.id === courseId)
  console.log('Enrolling in:', course?.title)
}
```

### Transformation Layer

```typescript
import { courseTransformers } from '../lib'

// Transform database courses ke display format
const courses: Course[] = mockCourseUtils.getCourses()
const catalogItems = courseTransformers.toCatalogItems(courses, userContext)
```

### Mock Data Utilities

```typescript
import { mockCourseUtils } from '../lib'

// Get mock data dalam berbagai format
const courses = mockCourseUtils.getCourses() // Database format
const catalogItems = mockCourseUtils.getCatalogItems() // Display format
const detailViews = mockCourseUtils.getDetailViews() // Detail format

// Filter dan search
const mathCourses = mockCourseUtils.getCoursesByCategory('Matematika')
const publishedCourses = mockCourseUtils.getPublishedCourses()
const searchResults = mockCourseUtils.searchCourses('matematika')
```

## 🎯 Benefits

### 1. Type Safety

- ✅ Clear separation antara database model dan display model
- ✅ Type error prevention saat assign model yang salah
- ✅ IntelliSense support untuk setiap layer

### 2. Maintainability

- ✅ Perubahan database tidak affect UI components
- ✅ Perubahan UI tidak affect database operations
- ✅ Transformation logic terpisah dan reusable

### 3. Scalability

- ✅ Mudah menambah field baru di display model
- ✅ Support untuk user-specific data (enrollment, wishlist)
- ✅ Flexible untuk future requirements

### 4. Testing

- ✅ Mock data terpisah untuk development
- ✅ Transformation functions bisa di-test secara terpisah
- ✅ Type-safe testing dengan TypeScript

## 🚀 Migration Guide

### Phase 1: Update Imports

```typescript
// ❌ Old
import { CourseCatalog } from '../types'

// ✅ New
import { CourseCatalogItem } from '../types'
```

### Phase 2: Update Components

```typescript
// ❌ Old
interface CourseCardProps {
  course: CourseCatalog
}

// ✅ New
interface CourseCardProps {
  course: CourseCatalogItem
}
```

### Phase 3: Use Transformation Utilities

```typescript
// ❌ Old
const courses: Course[] = await getCourses()
const displayCourses: CourseCatalog[] = courses // Type error!

// ✅ New
const courses: Course[] = await getCourses()
const displayCourses: CourseCatalogItem[] = courseTransformers.toCatalogItems(courses)
```

## 📝 Notes

- **Legacy Support**: Interface lama masih tersedia sebagai type alias untuk backward compatibility
- **Mock Data**: Gunakan `mockCourseUtils` untuk development/testing
- **User Context**: Transformation functions support user-specific data
- **Performance**: Transformation functions pure dan bisa di-cache jika diperlukan

## 🔮 Future Enhancements

1. **Caching**: Implementasi cache untuk transformation results
2. **Validation**: Add validation untuk transformation input/output
3. **Error Handling**: Improve error handling untuk transformation failures
4. **Performance**: Optimize transformation untuk large datasets

## 📚 File Descriptions

### `courseUtils.ts`

General utility functions untuk:

- Formatting (duration, rating, numbers)
- Filtering dan searching
- Validation
- Error handling
- Safe array operations

### `courseTransformers.ts`

Data transformation utilities untuk:

- Convert database model ke display model
- User context integration (enrollment, wishlist)
- Mock data transformation untuk development

### `mockData.ts`

Mock data dan utilities untuk:

- Development dan testing
- Prototyping
- Multiple format access (database, display, detail)
- Filtering dan searching mock data

### `usage-examples.ts`

Comprehensive examples untuk:

- Database layer usage
- Display layer usage
- Transformation utilities
- Type safety benefits
- Real-world scenarios
