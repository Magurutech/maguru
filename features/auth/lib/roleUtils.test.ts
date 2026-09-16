/**
 * Unit Tests untuk roleUtils.ts
 */

import { DEFAULT_ROLE, isValidRole } from './roleUtils'

describe('roleUtils', () => {
  describe('DEFAULT_ROLE', () => {
    it('should have default role as user', () => {
      expect(DEFAULT_ROLE).toBe('user')
    })
  })

  describe('isValidRole', () => {
    it('should return true for valid roles', () => {
      expect(isValidRole('admin')).toBe(true)
      expect(isValidRole('creator')).toBe(true)
      expect(isValidRole('user')).toBe(true)
    })

    it('should return false for invalid roles', () => {
      expect(isValidRole('guest')).toBe(false)
      expect(isValidRole('superuser')).toBe(false)
      expect(isValidRole('')).toBe(false)
      expect(isValidRole(null)).toBe(false)
      expect(isValidRole(undefined)).toBe(false)
      expect(isValidRole(123)).toBe(false)
      expect(isValidRole({})).toBe(false)
    })
  })
})
