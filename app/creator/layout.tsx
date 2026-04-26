/**
 * Creator Layout
 *
 * Layout khusus untuk creator role yang menyediakan:
 * - Creator-specific navigation
 * - Content creation tools
 * - Creator-focused sidebar
 */

import React from 'react'
import { UserRoleProvider } from '@/features/auth'
import { PenTool, BookOpen, Video, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CreatorLayoutProps {
  children: React.ReactNode
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  return (
    <UserRoleProvider>
      <div className="min-h-screen bg-linear-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
              <div className="w-8 h-8 bg-linear-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Maguru
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                Creator
              </span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6">
              <div className="space-y-2">
                <Link href="/creator">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700"
                  >
                    <PenTool className="mr-3 h-4 w-4" />
                    Creator Studio
                  </Button>
                </Link>

                <Link href="/creator/course-manage">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700"
                  >
                    <BookOpen className="mr-3 h-4 w-4" />
                    My Courses
                  </Button>
                </Link>

                <Link href="/creator/content">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700"
                  >
                    <FileText className="mr-3 h-4 w-4" />
                    Content Library
                  </Button>
                </Link>

                <Link href="/creator/videos">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Video className="mr-3 h-4 w-4" />
                    Video Manager
                  </Button>
                </Link>

                <Link href="/creator/students">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Users className="mr-3 h-4 w-4" />
                    Students
                  </Button>
                </Link>


              </div>


              {/* Quick Actions */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    <BookOpen className="w-3 h-3 mr-2" />
                    New Course
                  </Button>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Creator Studio v1.5</p>
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
