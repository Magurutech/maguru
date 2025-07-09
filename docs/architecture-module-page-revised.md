# Arsitektur Manage Module (Revisi)

## Daftar Isi

- [Arsitektur Manage Module (Revisi)](#arsitektur-manage-module-revisi)
  - [Daftar Isi](#daftar-isi)
  - [1. Pendahuluan](#1-pendahuluan)
  - [2. High Level Architecture](#2-high-level-architecture)
    - [Diagram Arsitektur](#diagram-arsitektur)
    - [Kebutuhan Non-Fungsional](#kebutuhan-non-fungsional)
  - [3. Component Architecture](#3-component-architecture)
    - [Diagram Komponen](#diagram-komponen)
    - [UI Components](#ui-components)
    - [Containers](#containers)
  - [4. Layer-based Architecture](#4-layer-based-architecture)
    - [1. Presentation Layer (UI Components)](#1-presentation-layer-ui-components)
    - [2. State Management Layer (Context)](#2-state-management-layer-context)
    - [3. Business Logic Layer (Hooks)](#3-business-logic-layer-hooks)
    - [4. Data Access Layer (Adapter)](#4-data-access-layer-adapter)
    - [5. Backend Services Layer (API)](#5-backend-services-layer-api)
  - [5. Komunikasi Antar Komponen](#5-komunikasi-antar-komponen)
    - [Flow Data User Interaction](#flow-data-user-interaction)
  - [6. Konvensi Penamaan](#6-konvensi-penamaan)
    - [File dan Direktori](#file-dan-direktori)
    - [Components](#components)
    - [Context](#context)
    - [Hooks](#hooks)
    - [Adapters](#adapters)
    - [Services](#services)
    - [Types](#types)
  - [7. Patterns dan Best Practices](#7-patterns-dan-best-practices)
    - [Composition Pattern](#composition-pattern)
    - [Feature First Structure](#feature-first-structure)
    - [Error Handling](#error-handling)
    - [Progressive Loading](#progressive-loading)
    - [Testing](#testing)
  - [8. Tech Stack dan Dependencies](#8-tech-stack-dan-dependencies)
    - [Core Technologies](#core-technologies)
    - [UI Libraries](#ui-libraries)
    - [State Management](#state-management)
    - [Form Management](#form-management)
    - [API Integration](#api-integration)
    - [Editor Tools](#editor-tools)
    - [Testing Tools](#testing-tools)

## Ringkasan Arsitektur

Dokumen ini merupakan revisi dari arsitektur modul manage-module untuk meningkatkan konsistensi dan maintainability. Revisi ini berfokus pada penyesuaian dengan praktik terbaik Next.js App Router dan memperjelas alur kerja frontend dan backend.

## Pendekatan Arsitektur

Manage Module mengikuti pendekatan arsitektur berlapis (layered architecture) dengan pemisahan yang jelas antara:

1. **Presentasi (UI)**: Komponen React (Server dan Client Components)
2. **State Management**: Context API dan React Query
3. **Data Access**: Adapter dan Services
4. **Domain Logic**: Schemas dan Business Rules
5. **Data Storage**: Database (Prisma)

## Alur Frontend (Client-side)

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Interaction                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        React Components                         │
│                                                                 │
│  ┌───────────────────┐       ┌────────────────────┐             │
│  │ Server Components │       │ Client Components  │             │
│  │(No 'use client')  │       │('use client')      │             │
│  └───────────────────┘       └────────────────────┘             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        State Management                         │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │     Context API         │  │      React Query        │       │
│  │(Global UI State)        │  │(Server State)           │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                          Custom Hooks                           │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────────────┐     │
│  │  Feature Hooks      │    │      Utility Hooks          │     │
│  │(useModulePageData)  │    │(useDebounce, useMediaQuery) │     │
│  └─────────────────────┘    └─────────────────────────────┘     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                         Data Access Layer                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               modulePageAdapter                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
                          API Requests
                          (fetch/axios)
```

## Alur Backend (Server-side)

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Routes                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │          app/api/modules/[...]/route.ts                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        Services Layer                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               modulePageService                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        Data Access Layer                        │
│                                                                 │
│  ┌────────────────────────────┐                                 │
│  │         Prisma ORM         │                                 │
│  └────────────────────────────┘                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                          Database                               │
└─────────────────────────────────────────────────────────────────┘
```

## Cross-cutting Concerns

```
┌─────────────────────────────────────────────────────────────────┐
│                       Utils & Types                             │
│                                                                 │
│  ┌────────────────────────┐  ┌────────────────────────────┐     │
│  │      Data Formats      │  │        Schema/Types        │     │
│  │   (dataFormats.ts)     │  │    (modulePageSchema.ts)   │     │
│  └────────────────────────┘  └────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Komponen Arsitektur Detil

### 1. Komponen React (React Components Layer)

#### Instruksi penamaan React Component

- **Class/Function Component**: Gunakan PascalCase
  - Contoh: `ModuleSidebar`, `FolderItem`, `PageEditor`
- **Props Types**: Tambahkan suffix `Props`
  - Contoh: `ModuleSidebarProps`, `FolderItemProps`
- **Event Handlers**: Gunakan prefix `handle`
  - Contoh: `handleFolderClick`, `handleAddPage`

#### Server Components

**Lokasi File:**

- `app/manage-module/[moduleId]/page.tsx`
- `app/manage-module/page.tsx`

**Tanggung Jawab:**

- Melakukan data fetching pada server
- Mengatur metadata untuk SEO
- Merender layout dan struktur dasar halaman
- Melempar props ke Client Components

**Karakteristik:**

- Tidak menggunakan directive `'use client'`
- Tidak menggunakan React hooks
- Melakukan fetch dengan `await`
- Mengoptimalkan First Contentful Paint

#### Client Components

**Lokasi File:**

- `features/manage-module/components/ModulePageShell.tsx`
- `features/manage-module/components/ModulePageEditor.tsx`
- `features/manage-module/components/ModulePageSidebar.tsx`

**Tanggung Jawab:**

- Menangani interaksi pengguna
- Mengelola state lokal
- Menggunakan hooks untuk state management
- Merender UI yang interaktif

**Karakteristik:**

- Selalu menggunakan directive `'use client'`
- Menggunakan React hooks
- Menggunakan context providers
- Memanggil functions dari custom hooks

### 2. State Management Layer

#### Instruksi penamaan State Management Layer

- **Context**: Gunakan suffix `Context`
  - Contoh: `ModulePageUIContext`, `NavigationContext`
- **Provider**: Gunakan suffix `Provider`
  - Contoh: `ModulePageUIProvider`
- **Actions/Methods**: Gunakan verb yang menggambarkan aksi
  - Contoh: `toggleFolderExpand`, `startAddingPage`

#### Context API (UI State)

**Lokasi File:**

- `features/manage-module/context/module-page/ModulePageCRUDContext.tsx` (Operasi CRUD dasar)
- `features/manage-module/context/module-page/ModulePageNavigationContext.tsx` (Navigasi antar halaman)
- `features/manage-module/context/module-page/ModulePageUIContext.tsx` (State UI)

**Tanggung Jawab:**

- Menyediakan global state untuk UI
- Mengelola state navigasi dan routing
- Mengelola state sidebar dan interaksi UI
- Menyediakan fungsi-fungsi interaksi UI dengan pemisahan concern yang jelas

**Karakteristik:**

- Menggunakan React Context API dengan pemisahan concern
- Berfokus pada UI state, bukan data fetching
- Digunakan oleh Client Components
- Meminimalkan re-renders melalui pemisahan context
- Mencegah duplikasi kode melalui custom hooks dan helper functions

**Strategi Pencegahan Duplikasi:**

- Menerapkan hierarki context yang jelas
- Menggunakan custom hooks untuk berbagi logic
- Implementasi helper functions untuk operasi umum
- Penerapan pola dependency injection antar context

#### React Query (Server State)

**Lokasi File:**

- Digunakan dalam custom hooks

**Tanggung Jawab:**

- Mengelola server state (data dari API)
- Menangani caching
- Mengelola loading states
- Menangani error states

**Karakteristik:**

- Menggunakan React Query
- Berfokus pada data fetching dan caching
- Optimistic updates
- Revalidation strategies

### 3. Custom Hooks Layer

#### Instruksi penamaan State Management Layer

- **Hooks**: Gunakan prefix `use` (sesuai aturan React)
  - Contoh: `useModulePageData`, `useInlineEditing`
- **Return values**: Gunakan objek dengan nama yang deskriptif
  - Contoh: `{ folders, isLoading, error, fetchFolders }`

Custom Hooks Layer menerapkan arsitektur berlapis yang terdiri dari dua tingkatan utama:

#### 3.1 Low-Level Hooks (Data Access Hooks)

**Lokasi File:**

- `features/manage-module/hooks/module-page/useModulePage.ts`
- `features/manage-module/hooks/module-page/useFolder.ts`

**Tanggung Jawab:**

- Menjembatani komunikasi antara adapter layer dan high-level hooks
- Menyediakan akses langsung ke data dan operasi dasar CRUD
- Mengelola caching dan revalidasi dengan React Query
- Menangani error handling dasar dan retries
- Memastikan type safety untuk data yang diakses

**Karakteristik:**

- Memanggil adapter functions secara langsung (`modulePageAdapter`, `folderAdapter`)
- Menerapkan React Query hooks (`useQuery`, `useMutation`)
- Mengembalikan data mentah dan status query (loading, error)
- Menyediakan operasi dasar tanpa logika bisnis kompleks
- Minimal dependencies, fokus pada satu entitas atau operasi

**Contoh Fungsi:**

- `getPage`: Mengambil satu halaman berdasarkan ID
- `createPage`: Membuat halaman baru dengan data minimum
- `createFolder`: Membuat folder baru dengan data minimum
- `updatePage`: Memperbarui halaman dengan data yang diberikan

#### 3.2 High-Level Hooks (Business Logic Hooks)

**Lokasi File:**

- `features/manage-module/hooks/module-page/useModulePageOperation.ts`
- `features/manage-module/hooks/module-page/useModulePageUI.ts`
- `features/manage-module/hooks/useInlineEditing.ts`

**Tanggung Jawab:**

- Mengimplementasikan logika bisnis kompleks
- Menggabungkan data dan operasi dari multiple low-level hooks
- Menyediakan abstraksi yang lebih tinggi untuk komponen UI
- Menangani alur kerja pengguna dan use cases
- Menerapkan optimistic updates dan rollback strategies

**Karakteristik:**

- Menggunakan low-level hooks sebagai dependencies
- Menambahkan logika bisnis di atas operasi dasar
- Menggabungkan data dari berbagai sumber
- Menyediakan helper functions yang lebih intuitif untuk UI
- Memiliki dependencies yang lebih banyak, tapi lebih user-friendly

**Contoh Fungsi:**

- `handleCreateNewPage`: Membuat halaman baru dengan default values dan navigasi
- `handleCreateNewFolder`: Membuat folder baru dengan nama default dan penempatan yang tepat
- `startAddingPage`: Memulai proses penambahan halaman dengan persiapan UI
- `cancelAdding`: Membatalkan proses penambahan dengan cleanup state
- `getPagesByFolder`: Mendapatkan halaman yang difilter berdasarkan folder

#### 3.3 Hubungan antara Low-Level dan High-Level Hooks

```
┌───────────────────┐       ┌──────────────────┐       ┌───────────────┐
│                   │       │                  │       │               │
│  UI Components    │ uses  │  High-Level      │ uses  │  Low-Level    │
│  (React)          │──────>│  Hooks           │──────>│  Hooks        │
│                   │       │                  │       │               │
└───────────────────┘       └──────────────────┘       └───────┬───────┘
                                                              │
                                                              │ uses
                                                              ▼
                                                       ┌───────────────┐
                                                       │               │
                                                       │   Adapters    │
                                                       │               │
                                                       └───────────────┘
```

**Flow Data dan Operasi:**

1. **UI Components** memanggil fungsi dari **High-Level Hooks** untuk operasi bisnis
2. **High-Level Hooks** memanggil fungsi dari **Low-Level Hooks** untuk akses data dasar
3. **Low-Level Hooks** memanggil **Adapters** untuk komunikasi dengan API
4. **Adapters** melakukan HTTP requests ke API Routes

**Pemisahan Concerns:**

- **UI Components**: Fokus pada tampilan dan interaksi pengguna
- **High-Level Hooks**: Fokus pada logika bisnis dan alur kerja pengguna
- **Low-Level Hooks**: Fokus pada akses data dan operasi CRUD
- **Adapters**: Fokus pada komunikasi dengan API

#### 3.4 Keuntungan Pendekatan Berlapis

1. **Reusability**: Low-level hooks dapat digunakan oleh berbagai high-level hooks
2. **Testability**: Setiap layer dapat diuji secara terpisah dengan mock dependencies
3. **Maintainability**: Perubahan pada satu layer tidak mempengaruhi layer lain
4. **Separation of Concerns**: Setiap layer memiliki tanggung jawab yang jelas
5. **Scalability**: Mudah menambahkan fitur baru tanpa mengubah struktur yang ada

#### 3.5 Praktik Terbaik untuk Custom Hooks

1. **Naming Convention**:
   - Low-level hooks: `use<Entity>Data` (contoh: `useModulePageData`, `useFolderData`)
   - High-level hooks: `use<Feature>` atau `use<Entity><Operation>` (contoh: `useModulePageOperation`, `useInlineEditing`)

2. **Error Handling**:
   - Low-level hooks: Tangani error teknis (network, API)
   - High-level hooks: Tangani error bisnis dan UX (validasi, notifikasi)

3. **State Management**:
   - Low-level hooks: Fokus pada state data (isLoading, error, data)
   - High-level hooks: Fokus pada state aplikasi (activeAddingType, isEditing)

4. **Testing Strategy**:
   - Low-level hooks: Mock adapter responses
   - High-level hooks: Mock low-level hooks responses

### 4. Data Access Layer (Adapter)

#### Instruksi penamaan Adapter layer

- **Adapter Functions**: Gunakan nama operasi dengan suffix `Adapter`
  - Contoh: `modulePageAdapter.createPage`, `folderAdapter.getFolder`
- **API Methods**: Gunakan verbs yang menjelaskan operasi HTTP
  - Contoh: `fetchFolders`, `createPage`, `updateFolder`

**Lokasi File:**

- `features\manage-module\adapters\pageAdapter.ts`
- `features\manage-module\adapters\folderAdapter.ts`

**Tanggung Jawab:**

- Komunikasi dengan API
- Transformasi data
- Validasi data
- Error handling

**Karakteristik:**

- Interface-based design (IModulePageAdapter)
- Tidak bergantung pada UI libraries
- Dapat digunakan di Client dan Server Components
- Menyediakan type-safe operations

### 5. API Routes Layer

**Lokasi File:**

- `app\api\module\[moduleId]\route.ts`
- `app\api\module\[moduleId]\folders\route.ts`
- `app\api\module\[moduleId]\folders\[folderId]\pages\route.ts`

**Tanggung Jawab:**

- Handling HTTP requests
- Validasi input
- Authorization checks
- Memanggil service layer

**Karakteristik:**

- Menggunakan Next.js Route Handlers
- Menangani routing dan parameter
- Menghasilkan HTTP responses
- Diekspos ke client

### 6. Services Layer

#### Instruksi penamaan Services layer

- **Service Functions**: Gunakan nama operasi dengan suffix `Service`
  - Contoh: `createPageService`, `getFoldersService`
- **Helper Functions**: Gunakan nama yang deskriptif untuk tujuannya
  - Contoh: `validateFolderData`, `transformPageResponse`

**Lokasi File:**

- `features/manage-module/services/modulePageService.ts`

**Tanggung Jawab:**

- Implementasi business logic
- Data validation
- Transaction management
- Domain rules enforcement

**Karakteristik:**

- Interface-based design (IModulePageService)
- setiap function atau const akan diberi anma akhiran Service example : getPageService, PostPageService.
- Tidak bergantung pada framework
- gunakan logger.ts untuk debug minimal `features\manage-module\services\logger.ts`
- Digunakan oleh API Routes dan Server Components
- Mengelola komunikasi dengan database

### 7. Utils & Types Layer

#### Instruksi penamaan Utls & Types layer

- **Utility Functions**: Gunakan nama deskriptif tanpa prefix/suffix khusus
  - Contoh: `formatDate`, `sanitizeHtml`
- **Type Definitions**: Gunakan PascalCase tanpa suffix
  - Contoh: `ModulePage`, `FolderData`
- **Validation Schemas**: Gunakan suffix `Schema`
  - Contoh: `createPageSchema`, `folderSchema`

#### Data Formats

**Lokasi File:**

- `features/manage-module/lib/dataFormats.ts`

**Tanggung Jawab:**

- Transformasi data antar format
- Validasi data
- Konversi tipe data

#### Schema/Types

**Lokasi File:**

- `features/manage-module/types/modulePageSchema.ts`
- `features/manage-module/types/index.ts`

**Tanggung Jawab:**

- Mendefinisikan tipe data
- Validasi data dengan Zod
- Ekspor tipe untuk digunakan di seluruh aplikasi

## Struktur Folder yang Direkomendasikan

```
/
├── app/                                # Next.js App Router
│   ├── manage-module/
│   │   ├── page.tsx                    # Module listing page
│   │   ├── [moduleId]/
│   │   │   ├── page.tsx                # Module detail page
│   │   │   ├── layout.tsx              # Layout untuk pages
│   │   │   └── error.tsx               # Error handling
│   │   └── loading.tsx                 # Loading UI
│   └── api/                            # API Routes
│       └── modules/
│           └── [...]/route.ts          # API Handlers
│
├── features/                           # Feature-based organization
│   └── manage-module/
│       ├── components/                 # React Components
│       │   ├── ModulePageEditor.tsx    # Editor komponen
│       │   ├── ModulePageSidebar.tsx   # Sidebar komponen
│       │   └── ui/                     # Atomic UI components
│       │       ├── Button.tsx
│       │       └── ...
│       │
│       ├── context/                    # React Context Providers
│       │   ├── ModulePageCRUDContext.tsx
│       │   └── ModulePagesContext.tsx
│       │
│       ├── hooks/                      # Custom React Hooks
│       │   ├── useModulePageData.ts
│       │   └── useModulePageQuery.ts
│       │
│       ├── adapters/                   # Data Access Adapters
│       │   └── modulePageAdapter.ts
│       │
│       ├── services/                   # Business Logic Services
│       │   └── modulePageService.ts
│       │
│       ├── lib/                        # Utility Functions
│       │   └── dataFormats.ts
│       │
│       └── types/                      # TypeScript & Zod Types
│           ├── index.ts
│           └── modulePageSchema.ts
│
└── lib/                                # Shared Utilities
    ├── utils.ts
    └── constants.ts
```

## Alur Data End-to-End

### 1. User Interaction Flow

1. **Pengguna berinteraksi dengan UI**
   - Misal: Klik tombol "Create Page"

2. **Client Component menangkap event**
   - `ModulePageSidebar.tsx` mendeteksi klik
   - Memanggil handler dari context

3. **Context menangani UI state**
   - `ModulePageCRUDContext` memperbarui state
   - Memanggil method dari custom hook

4. **Custom Hook melakukan operasi data**
   - `useModulePageData.createPage()` dipanggil
   - Menggunakan React Query untuk mutasi

5. **Adapter melakukan API call**
   - `modulePageAdapter.createPage()` dipanggil
   - Membuat HTTP request ke API Route

6. **API Route memproses request**
   - Memvalidasi input
   - Memanggil service

7. **Service melakukan operasi database**
   - Melakukan operasi CRUD via Prisma
   - Mengembalikan hasil

8. **Response dikembalikan ke client**
   - React Query memperbarui cache
   - UI diperbarui untuk menampilkan perubahan

### 2. Server-side Rendering Flow

1. **Browser meminta halaman**
   - Request ke `/manage-module/[moduleId]`

2. **Server Component melakukan data fetching**
   - `page.tsx` memanggil service atau adapter
   - `await modulePageService.getModulePages(moduleId)`

3. **Service mengambil data dari database**
   - Query database via Prisma
   - Mengembalikan data

4. **Server Component merender HTML**
   - Merender komponen dengan data
   - Mengirim HTML ke browser

5. **Client hydration**
   - JavaScript di-load di browser
   - Client Components menjadi interaktif
   - React Query menggunakan `initialData` dari server

## Praktik Terbaik dan Rekomendasi

1. **Server vs Client Components**
   - Gunakan Server Components untuk:
     - Data fetching awal
     - SEO dan metadata
     - Konten statis atau jarang berubah
   - Gunakan Client Components untuk:
     - Interaktivitas pengguna
     - Form handling
     - State lokal dan effects

2. **State Management**
   - Gunakan Context API untuk:
     - UI state (sidebar collapsed, active tab)
     - Theme dan preferences
   - Gunakan React Query untuk:
     - Server state (data dari API)
     - Caching dan revalidation
     - Loading dan error states

3. **Code Organization**
   - Organisasi berdasarkan fitur (feature-based)
   - Co-locate kode yang berhubungan
   - Pisahkan server-only code dengan "server-only" package

4. **Performance Optimization**
   - Implementasi Incremental Static Regeneration (ISR)
   - Gunakan `next/dynamic` untuk lazy loading
   - Optimasi React Query dengan staleTime dan cacheTime

5. **Type Safety**
   - Gunakan Zod untuk validasi dan type inference
   - Hindari penggunaan `any`
   - Definisikan interfaces untuk layers

## Kesimpulan

Dengan revisi arsitektur ini, modul manage-module menjadi lebih:

1. **Terstruktur**: Pemisahan tanggung jawab yang jelas
2. **Maintainable**: Kode yang lebih mudah dimengerti dan diubah
3. **Performant**: Memanfaatkan fitur terbaru Next.js App Router
4. **Type-safe**: Menggunakan TypeScript dan Zod secara maksimal
5. **Testable**: Layer yang terpisah memudahkan pengujian

Arsitektur ini mengikuti praktik terbaik Next.js dan React modern, memastikan aplikasi yang skalabel dan mudah dipelihara di masa depan.
