/**
 * Admin Layout - Ancient Fantasy Asia Design
 *
 * Layout khusus untuk admin role dengan Ancient Fantasy Asia theme:
 * - Admin-specific navigation dengan magical styling
 * - System monitoring tools dengan neumorphic design
 * - Administrative sidebar dengan whimsical interactions
 */

import React from 'react'
import { UserRoleProvider } from '@/features/auth'
import { Shield, Users, Settings, BarChart3, Database, AlertTriangle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <UserRoleProvider>
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
        {/* Sidebar Navigation - Ancient Fantasy Asia Design */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-beige-200 shadow-neu z-40">
          <div className="flex flex-col h-full">
            {/* Logo - Ancient Fantasy Asia Style */}
            <div className="flex items-center space-x-3 p-6 border-b border-beige-200">
              <div className="w-8 h-8 bg-gradient-to-br from-merah-600 to-kuning-500 rounded-lg flex items-center justify-center shadow-glow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-merah-600 to-kuning-500 bg-clip-text text-transparent font-serif">
                Maguru
              </span>
              <span className="text-xs bg-merah-100 text-merah-800 px-2 py-1 rounded-full font-medium animate-float">
                Admin
              </span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6">
              <div className="space-y-2">
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-kuning-50 hover:text-merah-700 transition-all duration-200 hover:shadow-sm"
                  >
                    <Shield className="mr-3 h-4 w-4 text-beige-700" />
                    Control Panel
                  </Button>
                </Link>

                <Link href="/admin/users">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-kuning-50 hover:text-merah-700 transition-all duration-200 hover:shadow-sm"
                  >
                    <Users className="mr-3 h-4 w-4 text-beige-700" />
                    User Management
                  </Button>
                </Link>

                <Link href="/admin/content">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-kuning-50 hover:text-merah-700 transition-all duration-200 hover:shadow-sm"
                  >
                    <Database className="mr-3 h-4 w-4 text-beige-700" />
                    Content Review
                  </Button>
                </Link>

                <Link href="/admin/analytics">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-kuning-50 hover:text-merah-700 transition-all duration-200 hover:shadow-sm"
                  >
                    <BarChart3 className="mr-3 h-4 w-4 text-beige-700" />
                    Analytics
                  </Button>
                </Link>

                <Link href="/admin/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-kuning-50 hover:text-merah-700 transition-all duration-200 hover:shadow-sm"
                  >
                    <Settings className="mr-3 h-4 w-4 text-beige-700" />
                    System Settings
                  </Button>
                </Link>
              </div>

              {/* System Status - Ancient Fantasy Style */}
              <div className="mt-8 p-4 bg-kuning-50 rounded-lg border border-kuning-200 shadow-neu">
                <h3 className="text-sm font-semibold text-beige-900 mb-3 font-serif">System Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-beige-700">Server Health</span>
                    <span className="font-semibold text-hijau-600">98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-beige-700">Active Users</span>
                    <span className="font-semibold text-beige-900">2,486</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-beige-700">Alerts</span>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-kuning-500 animate-float" />
                      <span className="font-semibold text-kuning-600">2</span>
                    </div>
                  </div>
                  <div className="w-full bg-beige-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-hijau-500 to-hijau-400 h-2 rounded-full shadow-glow" style={{ width: '98%' }}></div>
                  </div>
                  <p className="text-xs text-hijau-600 text-center mt-1 font-medium">System Operational</p>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Admin Panel v2.0</p>
              <p className="text-xs text-gray-400 text-center mt-1">© 2024 Maguru</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">{children}</div>

        {/* Mobile overlay (hidden on desktop) */}
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 hidden"
          id="sidebar-overlay"
        ></div>
      </div>
    </UserRoleProvider>
  )
}
