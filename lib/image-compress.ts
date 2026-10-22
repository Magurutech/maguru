/**
 * Image Compression and WebP Conversion Utility
 *
 * Provides client-side image compression, 1:1 center-cropping for avatars,
 * and automatic conversion to modern WebP format.
 */

export interface CompressionResult {
  file: File
  previewUrl: string
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

/**
 * Format bytes into human-readable string (KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Compresses an image file and converts it to WebP format.
 * Center-crops the image to a 1:1 square for avatar use.
 *
 * @param file The original image file
 * @param options Configuration for compression and cropping
 */
export async function compressAndConvertToWebp(
  file: File,
  options: {
    maxSize?: number
    quality?: number
    cropSquare?: boolean
  } = {}
): Promise<CompressionResult> {
  const { maxSize = 512, quality = 0.85, cropSquare = true } = options

  return new Promise((resolve, reject) => {
    // SSR / Node environment guard
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve({
        file,
        previewUrl: '',
        originalSize: file.size,
        compressedSize: file.size,
        width: 0,
        height: 0,
      })
    }

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      try {
        const canvas = document.createElement('canvas')
        let sx = 0
        let sy = 0
        let sWidth = img.width
        let sHeight = img.height
        let dWidth = img.width
        let dHeight = img.height

        if (cropSquare) {
          // Center-crop to 1:1 square
          const minDim = Math.min(img.width, img.height)
          sx = (img.width - minDim) / 2
          sy = (img.height - minDim) / 2
          sWidth = minDim
          sHeight = minDim

          // Scale down if larger than maxSize
          const targetSize = Math.min(minDim, maxSize)
          dWidth = targetSize
          dHeight = targetSize
        } else {
          // Proportional scale
          if (dWidth > maxSize || dHeight > maxSize) {
            if (dWidth > dHeight) {
              dHeight = Math.round((dHeight * maxSize) / dWidth)
              dWidth = maxSize
            } else {
              dWidth = Math.round((dWidth * maxSize) / dHeight)
              dHeight = maxSize
            }
          }
        }

        canvas.width = dWidth
        canvas.height = dHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Canvas context tidak tersedia'))
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight)

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback if browser doesn't support canvas.toBlob
              return resolve({
                file,
                previewUrl: URL.createObjectURL(file),
                originalSize: file.size,
                compressedSize: file.size,
                width: img.width,
                height: img.height,
              })
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '')
            const webpFile = new File([blob], `${cleanName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            const previewUrl = URL.createObjectURL(blob)

            resolve({
              file: webpFile,
              previewUrl,
              originalSize: file.size,
              compressedSize: blob.size,
              width: dWidth,
              height: dHeight,
            })
          },
          'image/webp',
          quality
        )
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Gagal memuat berkas gambar'))
    }

    img.src = objectUrl
  })
}
