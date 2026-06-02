# Research: Supabase Storage API

**Task:** Baca dokumentasi Supabase Storage API (upload, getPublicUrl)  
**Date:** 2026-05-01  
**Status:** Completed

---

## Overview

Dokumentasi ini merangkum hasil research tentang Supabase Storage API, khususnya untuk:

1. Upload file API (`storage.from(bucket).upload()`)
2. Get public URL API (`storage.from(bucket).getPublicUrl()`)
3. Error handling patterns
4. Best practices untuk file upload

**Bucket yang sudah dibuat:** `lesson-images` (public bucket)

---

## 1. Upload File API

### Basic Syntax

```typescript
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file, options)
```

### Parameters

| Parameter  | Type                          | Required | Description                                             |
| ---------- | ----------------------------- | -------- | ------------------------------------------------------- |
| `path`     | `string`                      | ✅       | File path termasuk nama file (e.g., `folder/image.png`) |
| `fileBody` | `File \| Blob \| ArrayBuffer` | ✅       | File yang akan diupload                                 |
| `options`  | `FileOptions`                 | ❌       | Optional upload options                                 |

### File Options

```typescript
interface FileOptions {
  cacheControl?: string // Cache control header (e.g., '3600')
  contentType?: string // MIME type (e.g., 'image/jpeg')
  upsert?: boolean // Overwrite jika file sudah ada (default: false)
  metadata?: Record<string, any> // Custom metadata
}
```

### Upload Behavior

- **Default:** Jika file sudah ada di path yang sama → error `400 Asset Already Exists`
- **Upsert mode:** Set `upsert: true` untuk overwrite file yang sudah ada
- **Content Type:** Otomatis detect dari file extension, atau bisa di-override dengan `contentType` option
- **File Size Limit:** Standard upload max 5GB, tapi **recommended max 6MB** (untuk file > 6MB gunakan TUS Resumable Upload)

### Code Examples

#### Basic Upload

```typescript
const avatarFile = event.target.files[0]
const { data, error } = await supabase.storage
  .from('lesson-images')
  .upload('public/avatar1.png', avatarFile, {
    cacheControl: '3600',
    upsert: false,
  })
```

#### Upload dengan Upsert

```typescript
const { data, error } = await supabase.storage.from('lesson-images').upload('file_path', file, {
  upsert: true, // Overwrite jika sudah ada
})
```

#### Upload dengan Content Type

```typescript
const { data, error } = await supabase.storage.from('lesson-images').upload('file_path', file, {
  contentType: 'image/jpeg',
})
```

#### Upload dari ArrayBuffer (React Native)

```typescript
// Untuk React Native, gunakan ArrayBuffer dari base64
const { data, error } = await supabase.storage
  .from('lesson-images')
  .upload('file_path', arrayBuffer, {
    contentType: 'image/png',
  })
```

### Response Format

**Success:**

```typescript
{
  data: {
    path: string,           // Path file yang diupload
    id: string,             // UUID file
    fullPath: string        // Full path termasuk bucket
  },
  error: null
}
```

**Error:**

```typescript
{
  data: null,
  error: {
    message: string,        // Error message
    statusCode: number      // HTTP status code
  }
}
```

---

## 2. Get Public URL API

### Basic Syntax

```typescript
const { data } = supabase.storage.from('bucket_name').getPublicUrl('file_path', options)
```

### Parameters

| Parameter | Type     | Required | Description                     |
| --------- | -------- | -------- | ------------------------------- |
| `path`    | `string` | ✅       | File path termasuk nama file    |
| `options` | `object` | ❌       | Optional transformation options |

### Options

```typescript
interface PublicUrlOptions {
  download?: boolean | string // Trigger download (true atau custom filename)
  transform?: {
    width?: number
    height?: number
    resize?: 'cover' | 'contain' | 'fill'
    format?: 'origin' | 'webp'
    quality?: number
  }
}
```

### Important Notes

⚠️ **Bucket harus PUBLIC** untuk menggunakan `getPublicUrl()`

- Method ini **tidak verify** apakah bucket public atau tidak
- Jika bucket private, URL akan tetap di-generate tapi file tidak bisa diakses
- Untuk private bucket, gunakan `createSignedUrl()` instead

### URL Format

```
https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[file-path]
```

### Code Examples

#### Basic Public URL

```typescript
const { data } = supabase.storage.from('lesson-images').getPublicUrl('folder/avatar1.png')

console.log(data.publicUrl)
// https://xyzcompany.supabase.co/storage/v1/object/public/lesson-images/folder/avatar1.png
```

#### Public URL dengan Download

```typescript
const { data } = supabase.storage.from('lesson-images').getPublicUrl('folder/avatar1.png', {
  download: true, // Trigger browser download
})
```

#### Public URL dengan Custom Download Filename

```typescript
const { data } = supabase.storage.from('lesson-images').getPublicUrl('folder/avatar1.png', {
  download: 'my-custom-name.png',
})
```

#### Public URL dengan Image Transformation

```typescript
const { data } = supabase.storage.from('lesson-images').getPublicUrl('folder/avatar1.png', {
  transform: {
    width: 500,
    height: 500,
    resize: 'cover',
    format: 'webp',
    quality: 80,
  },
})
```

### Response Format

```typescript
{
  data: {
    publicUrl: string // Public URL untuk file
  }
}
```

**Note:** Method ini **tidak return error**, selalu return URL (meskipun file tidak exist atau bucket private)

---

## 3. Error Handling Patterns

### Common Errors

| Error                     | Status Code | Cause                            | Solution                                  |
| ------------------------- | ----------- | -------------------------------- | ----------------------------------------- |
| `Asset Already Exists`    | 400         | File sudah ada di path yang sama | Gunakan `upsert: true` atau ubah filename |
| `Bucket not found`        | 404         | Bucket tidak exist               | Buat bucket terlebih dahulu               |
| `Invalid MIME type`       | 400         | File type tidak diizinkan        | Validasi MIME type sebelum upload         |
| `File size exceeds limit` | 413         | File terlalu besar               | Validasi file size sebelum upload         |
| `Unauthorized`            | 401         | RLS policy tidak allow           | Check RLS policies di bucket              |

### Error Handling Best Practices

#### 1. Check Error Object

```typescript
const { data, error } = await supabase.storage.from('lesson-images').upload(path, file)

if (error) {
  console.error('Upload failed:', error.message)
  // Handle error
} else {
  console.log('Upload success:', data.path)
}
```

#### 2. Specific Error Handling

```typescript
const { data, error } = await supabase.storage.from('lesson-images').upload(path, file)

if (error) {
  if (error.message.includes('Already exists')) {
    // Handle duplicate file
    console.error('File sudah ada')
  } else if (error.statusCode === 413) {
    // Handle file too large
    console.error('File terlalu besar')
  } else {
    // Handle other errors
    console.error('Upload error:', error.message)
  }
}
```

#### 3. Try-Catch Pattern

```typescript
try {
  const { data, error } = await supabase.storage.from('lesson-images').upload(path, file)

  if (error) throw error

  return data.path
} catch (err) {
  console.error('Upload failed:', err)
  throw new Error('Gagal mengupload gambar')
}
```

#### 4. Validation Before Upload

```typescript
async function uploadImage(file: File): Promise<string> {
  // Validate MIME type
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }

  // Validate file size (5MB)
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Upload
  const { data, error } = await supabase.storage.from('lesson-images').upload(fileName, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('lesson-images').getPublicUrl(fileName)

  return urlData.publicUrl
}
```

---

## 4. Best Practices

### File Upload Best Practices

#### 1. **Validate Before Upload**

```typescript
// ✅ GOOD: Validate sebelum upload
function validateImage(file: File): void {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format tidak didukung')
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File terlalu besar')
  }
}

// ❌ BAD: Upload tanpa validasi
await supabase.storage.from('bucket').upload(path, file)
```

#### 2. **Generate Unique Filenames**

```typescript
// ✅ GOOD: Unique filename dengan timestamp + random
const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.png`

// ❌ BAD: Hardcoded filename (bisa conflict)
const fileName = 'image.png'
```

#### 3. **Set Content Type Explicitly**

```typescript
// ✅ GOOD: Set content type
await supabase.storage.from('bucket').upload(path, file, {
  contentType: file.type,
})

// ⚠️ OK: Auto-detect dari extension (tapi kurang reliable)
await supabase.storage.from('bucket').upload(path, file)
```

#### 4. **Use Upsert Carefully**

```typescript
// ✅ GOOD: Upsert untuk update scenario
await supabase.storage.from('bucket').upload(path, file, {
  upsert: true, // OK untuk update existing file
})

// ⚠️ WARNING: Upsert bisa cause CDN cache issues
// Lebih baik upload ke path baru untuk avoid stale content
```

#### 5. **Handle Upload Progress (untuk large files)**

```typescript
// Untuk file > 6MB, gunakan TUS Resumable Upload
// Standard upload tidak support progress tracking
```

### Security Best Practices

#### 1. **RLS Policies**

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lesson-images');

-- Policy: Allow public read
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lesson-images');
```

#### 2. **Client-Side Validation**

```typescript
// Validate di client sebelum upload
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Format tidak didukung')
}

if (file.size > MAX_SIZE) {
  throw new Error('File terlalu besar')
}
```

#### 3. **Server-Side Validation (Edge Function)**

```typescript
// Validate di server untuk extra security
// Supabase Edge Function
Deno.serve(async (req) => {
  const formData = await req.formData()
  const file = formData.get('file') as File

  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response('Invalid file type', { status: 400 })
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return new Response('File too large', { status: 413 })
  }

  // Upload to storage
  // ...
})
```

### Performance Best Practices

#### 1. **Use CDN Cache Headers**

```typescript
await supabase.storage.from('bucket').upload(path, file, {
  cacheControl: '3600', // Cache for 1 hour
})
```

#### 2. **Optimize Images Before Upload**

```typescript
// Compress image di client sebelum upload
// Gunakan library seperti browser-image-compression
import imageCompression from 'browser-image-compression'

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

const compressedFile = await imageCompression(file, options)
await supabase.storage.from('bucket').upload(path, compressedFile)
```

#### 3. **Use Image Transformations**

```typescript
// Gunakan Supabase image transformation untuk resize on-the-fly
const { data } = supabase.storage.from('lesson-images').getPublicUrl('image.png', {
  transform: {
    width: 500,
    height: 500,
    resize: 'cover',
    format: 'webp',
    quality: 80,
  },
})
```

### Naming Conventions

#### 1. **Folder Structure**

```
lesson-images/
  ├── lessons/
  │   ├── lesson-123-image1.png
  │   └── lesson-123-image2.png
  ├── temp/
  │   └── temp-456-draft.png
  └── thumbnails/
      └── thumb-123.webp
```

#### 2. **Filename Pattern**

```typescript
// Pattern: {type}-{timestamp}-{random}.{ext}
const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

// Examples:
// lesson-1672531200000-abc123.png
// lesson-1672531200000-def456.jpg
```

---

## 5. Implementation untuk Maguru

### File: `lib/tiptap/image-upload.ts`

```typescript
import { supabaseStorage } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const BUCKET = 'lesson-images'

export async function uploadLessonImage(file: File): Promise<string> {
  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Upload to Supabase Storage
  const { data, error } = await supabaseStorage.storage.from(BUCKET).upload(fileName, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: '3600',
  })

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabaseStorage.storage.from(BUCKET).getPublicUrl(fileName)

  return urlData.publicUrl
}
```

### Usage di EditorToolbar

```typescript
import { uploadLessonImage } from '@/lib/tiptap/image-upload'
import { toast } from 'sonner'

function ImageUploadButton() {
  const { editor } = useCurrentEditor()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setUploading(true)
    try {
      const url = await uploadLessonImage(file)
      editor.chain().focus().setImage({ src: url }).run()
      toast.success('Gambar berhasil diupload')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengupload gambar'
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <ToolbarButton
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        tooltip="Upload Gambar"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </ToolbarButton>
    </>
  )
}
```

---

## 6. Testing Checklist

### Unit Tests

- [x] Validate MIME type rejection
- [x] Validate file size rejection
- [x] Validate successful upload
- [x] Validate error message format (Indonesian)
- [x] Mock supabaseStorage untuk test tanpa network

### Integration Tests

- [ ] Upload valid image → verify public URL returned
- [ ] Upload file > 5MB → verify error
- [ ] Upload invalid MIME type → verify error
- [ ] Get public URL dari uploaded image → verify accessible

### E2E Tests

- [ ] Click image button → select valid image → verify image muncul di editor
- [ ] Upload image > 5MB → verify error toast
- [ ] Upload invalid format → verify error toast
- [ ] Save lesson dengan image → reload → verify image persisted

---

## 7. References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Standard Uploads Guide](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [JavaScript Storage API Reference](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Public URL Reference](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl)
- [Storage Security Guide](https://supabase.com/docs/guides/storage/security/access-control)

---

**Research Completed:** 2026-05-01  
**Next Steps:** Implement `lib/tiptap/image-upload.ts` dan integrate ke EditorToolbar
