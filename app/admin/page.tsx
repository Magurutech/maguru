'use client'

/**
 * TSK-54: Admin Dashboard - System Operations Focus
 *
 * Frontend-first redesign dengan Ancient Fantasy Asia design system.
 * Focus pada system health monitoring, analytics, dan platform settings.
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Activity,
  TrendingUp,
  Settings,
  Server,
  Users,
  Gauge,
  Clock,
  Database,
  BarChart3,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useAdminGuard, renderAdminGuard } from '@/features/admin/hooks/useAdminGuard'

export default function AdminDashboardPage() {
  const authState = useAdminGuard()

  // TSK-54 Dummy Data Structures
  const systemHealth = {
    status: "healthy" as const,
    uptime: "99.8%",
    responseTime: "120ms",
    storage: "73%",
    lastChecked: "2025-01-15T14:30:00Z"
  }

  const analyticsData = {
    revenue: { current: 45600, growth: "+12%" },
    courseQuality: { average: 4.6, totalReviews: 1240 },
    userEngagement: { activeUsers: 2486, completionRate: "78%" }
  }

  const platformSettings = {
    maintenanceMode: false,
    newRegistrations: true,
    featuredCourses: true,
    systemNotifications: "enabled" as const
  }

  // Quick status for 5-second assessment rule
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-hijau-500'
      case 'warning': return 'text-kuning-500'
      case 'critical': return 'text-merah-500'
      default: return 'text-beige-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle
      case 'warning': return AlertCircle
      case 'critical': return XCircle
      default: return Activity
    }
  }

  const StatusIcon = getStatusIcon(systemHealth.status)

  return renderAdminGuard(authState, (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header - System Operations Focus */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-merah-100 rounded-lg">
              <Shield className="w-6 h-6 text-merah-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-beige-900 font-serif">System Operations</h1>
              <p className="text-beige-600">
                Dashboard monitoring sistem - {authState.user?.firstName || 'Administrator'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${getStatusColor(systemHealth.status)}`} />
              <Badge variant="outline" className="bg-beige-50">
                System {systemHealth.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* System Health Monitoring - Priority Alert Section */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-hijau-600" />
            <h2 className="text-xl font-semibold text-beige-900">System Health</h2>
            <Badge className="ml-auto bg-hijau-100 text-hijau-800">Live</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Overview */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-hijau-600" />
                <span className="text-sm font-medium text-beige-700">Status</span>
              </div>
              <p className="text-2xl font-bold text-hijau-600 capitalize">{systemHealth.status}</p>
            </div>

            {/* Uptime */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-beige-600" />
                <span className="text-sm font-medium text-beige-700">Uptime</span>
              </div>
              <p className="text-2xl font-bold text-beige-900">{systemHealth.uptime}</p>
            </div>

            {/* Response Time */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-kuning-600" />
                <span className="text-sm font-medium text-beige-700">Response</span>
              </div>
              <p className="text-2xl font-bold text-beige-900">{systemHealth.responseTime}</p>
            </div>

            {/* Storage */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-kuning-600" />
                <span className="text-sm font-medium text-beige-700">Storage</span>
              </div>
              <p className="text-2xl font-bold text-kuning-600">{systemHealth.storage}</p>
              <div className="w-full bg-beige-200 rounded-full h-2 mt-2">
                <div className="bg-kuning-400 h-2 rounded-full" style={{ width: systemHealth.storage }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard - Revenue & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-merah-600" />
              <h2 className="text-xl font-semibold text-beige-900">Revenue Analytics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-beige-600">Current Revenue</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-beige-900">
                    Rp {analyticsData.revenue.current.toLocaleString()}
                  </p>
                  <Badge className="bg-hijau-100 text-hijau-800">
                    {analyticsData.revenue.growth}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-beige-100">
                <span className="text-beige-600">Course Quality</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-beige-900">
                    {analyticsData.courseQuality.average}/5.0
                  </p>
                  <p className="text-sm text-beige-500">
                    {analyticsData.courseQuality.totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-hijau-600" />
              <h2 className="text-xl font-semibold text-beige-900">User Engagement</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-beige-600">Active Users</span>
                <p className="text-2xl font-bold text-beige-900">
                  {analyticsData.userEngagement.activeUsers.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-beige-100">
                <span className="text-beige-600">Completion Rate</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-hijau-600">
                    {analyticsData.userEngagement.completionRate}
                  </p>
                  <div className="w-24 bg-beige-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-hijau-400 h-2 rounded-full"
                      style={{ width: analyticsData.userEngagement.completionRate }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Settings - System Configuration */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-beige-700" />
            <h2 className="text-xl font-semibold text-beige-900">Platform Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Maintenance Mode */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-beige-700">Maintenance Mode</span>
                <Badge variant={platformSettings.maintenanceMode ? "destructive" : "secondary"}>
                  {platformSettings.maintenanceMode ? "ON" : "OFF"}
                </Badge>
              </div>
              <Button
                variant={platformSettings.maintenanceMode ? "destructive" : "outline"}
                size="sm"
                className="w-full"
              >
                {platformSettings.maintenanceMode ? "Disable" : "Enable"}
              </Button>
            </div>

            {/* New Registrations */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-beige-700">Registrations</span>
                <Badge variant={platformSettings.newRegistrations ? "default" : "secondary"}>
                  {platformSettings.newRegistrations ? "OPEN" : "CLOSED"}
                </Badge>
              </div>
              <Button
                variant={platformSettings.newRegistrations ? "default" : "outline"}
                size="sm"
                className="w-full"
              >
                {platformSettings.newRegistrations ? "Close" : "Open"}
              </Button>
            </div>

            {/* Featured Courses */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-beige-700">Featured Courses</span>
                <Badge variant={platformSettings.featuredCourses ? "default" : "secondary"}>
                  {platformSettings.featuredCourses ? "ON" : "OFF"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                Configure
              </Button>
            </div>

            {/* System Notifications */}
            <div className="bg-beige-50 rounded-lg p-4 border border-beige-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-beige-700">Notifications</span>
                <Badge variant={platformSettings.systemNotifications === "enabled" ? "default" : "secondary"}>
                  {platformSettings.systemNotifications.toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                Manage
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions - Task-Oriented Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <h3 className="font-semibold text-beige-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-hijau-600" />
              System Monitoring
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                View Logs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Performance Metrics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Error Reports
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <h3 className="font-semibold text-beige-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-kuning-600" />
              User Management
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                User Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Role Management
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <h3 className="font-semibold text-beige-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-merah-600" />
              Platform Control
            </h3>
            <div className="space-y-3">
              <Button variant="default" className="w-full justify-start bg-merah-500 hover:bg-merah-600">
                Emergency Stop
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Backup System
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Platform
              </Button>
            </div>
          </div>
        </div>

        {/* Development Info - TSK-54 Implementation */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-beige-100 rounded-lg p-6 border border-beige-200">
            <h3 className="font-semibold text-beige-900 mb-4">🚀 TSK-54 Implementation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <strong className="text-hijau-600">✅ Completed:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Ancient Fantasy Asia theming</li>
                  <li>• System operations focus</li>
                  <li>• useAdminGuard integration</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-kuning-600">🔄 In Progress:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Component modularization</li>
                  <li>• Responsive optimization</li>
                  <li>• Accessibility compliance</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-beige-600">📋 Phase 2:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Real data integration (TSK-55)</li>
                  <li>• Backend CRUD operations</li>
                  <li>• Advanced auth flows</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  ))
}