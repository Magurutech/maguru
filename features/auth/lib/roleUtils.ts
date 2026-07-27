/**
 * Role Utility Constants
 */

import type { UserRole } from '../types'

export const DEFAULT_ROLE: UserRole = 'user'

export const isValidRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && ['admin', 'creator', 'user'].includes(role)
}
