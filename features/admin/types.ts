/**
 * TSK-54: Admin Dashboard Types
 *
 * TypeScript interfaces for system operations dashboard
 */

import React from 'react'

// System Health Monitoring Types
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: string
  responseTime: string
  storage: string
  lastChecked: string
}

// Analytics Dashboard Types
export interface AnalyticsData {
  revenue: {
    current: number
    growth: string
  }
  courseQuality: {
    average: number
    totalReviews: number
  }
  userEngagement: {
    activeUsers: number
    completionRate: string
  }
}

// Platform Settings Types
export interface PlatformSettings {
  maintenanceMode: boolean
  newRegistrations: boolean
  featuredCourses: boolean
  systemNotifications: 'enabled' | 'disabled'
}

// Status Badge Types
export type StatusType = 'healthy' | 'warning' | 'critical' | 'info' | 'success'

export interface StatusBadge {
  type: StatusType
  label: string
}

// Metric Display Types
export interface MetricData {
  value: string | number
  trend?: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

// Admin Card Props
export interface AdminCardProps {
  title: string
  children: React.ReactNode
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

// Alert Types
export interface SystemAlert {
  id: string
  title: string
  message: string
  severity: StatusType
  action?: string
  timestamp: string
}