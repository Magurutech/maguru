/**
 * Utility function untuk mendapatkan authorization header dari Clerk
 *
 * @returns Authorization header string atau null jika tidak ada token
 */
export async function getAuthHeader(): Promise<string | null> {
    try {
      // Untuk client-side, kita akan menggunakan session token
      // Ini akan di-handle oleh middleware di server-side
      return null
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      return null
    }
  }