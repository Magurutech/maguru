/**
 * TSK-54: Admin Components Exports
 *
 * Clean exports for admin dashboard components
 */

// Re-export admin guard components
export { useAdminGuard, renderAdminGuard, AdminLoadingScreen, AdminAccessDenied } from '../hooks/useAdminGuard'

// Re-export types
export type {
  SystemHealth,
  AnalyticsData,
  PlatformSettings,
  StatusType,
  StatusBadge,
  MetricData,
  AdminCardProps,
  SystemAlert
} from '../types'