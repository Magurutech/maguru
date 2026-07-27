/**
 * Auth Feature Exports
 *
 * Centralized exports untuk features/auth module
 * Menyediakan clean interface untuk role management system dengan Supabase Auth
 */

// Main exports
export { UserRoleProvider, useUserRoleContext, DEFAULT_ROLE } from './context/UserRoleContext'
export { RoleDisplay } from './components/RoleDisplay'
export {
  useUserRole,
  useUserRole as default,
  useRoleGuard,
  useRoleNavigation,
  useRoleLoadingState,
  useRoleDevelopment,
  useRoleConditional,
  useRoleErrorHandling,
} from './hooks/useUserRole'

// Types
export type {
  UserRole,
  UserRoleState,
  UserRoleContextType,
  UserRoleProviderProps,
  UseUserRoleReturn,
  DevModeConfig,
  RoleError,
  RoleGuard,
  RoleValidator,
} from './types'
