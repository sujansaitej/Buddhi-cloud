'use client'

import React, { useEffect, useState } from 'react'
import { 
  Home, 
  Workflow, 
  Play, 
  Calendar, 
  FileText, 
  Clock, 
  Settings, 
  Monitor,
  ChevronLeft, 
  ChevronRight,
  User,
  Shield,
  LogOut
} from 'lucide-react'
import { NavigationItem, User as UserType } from '@/types'

interface SidebarProps {
  user?: UserType
  currentPage: string
  onNavigate: (page: string) => void
  initialCollapsed?: boolean
  persistCollapsed?: boolean
}

const navigationSections: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: 'Core',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home', href: 'dashboard' },
    ],
  },
  {
    label: 'Build',
    items: [
      { id: 'workflows', label: 'Workflows', icon: 'Workflow', href: 'workflows' },
      { id: 'templates', label: 'Templates', icon: 'FileText', href: 'templates' },
    ],
  },
  {
    label: 'Run',
    items: [
      { id: 'tasks', label: 'Tasks', icon: 'Play', href: 'tasks' },
      { id: 'scheduled-tasks', label: 'Scheduled Tasks', icon: 'Calendar', href: 'scheduled-tasks' },
      { id: 'browser-profiles', label: 'Browser Profiles', icon: 'Monitor', href: 'browser-profiles' },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { id: 'history', label: 'History', icon: 'Clock', href: 'history' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { id: 'wallet', label: 'Wallet', icon: 'Shield', href: 'wallet' },
      { id: 'settings', label: 'Settings', icon: 'Settings', href: 'settings' },
    ],
  },
]

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Home,
    Workflow,
    Play,
    Calendar,
    FileText,
    Clock,
    Settings,
    Shield,
    Monitor,
  }
  return iconMap[iconName] || Home
}

export default function Sidebar({ user: propUser, currentPage, onNavigate, initialCollapsed, persistCollapsed = true }: SidebarProps) {
  const user = propUser
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (initialCollapsed !== undefined) return initialCollapsed
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('sidebarCollapsed')
        if (raw !== null) return raw === 'true'
      } catch {}
    }
    return false
  })
  const toggleCollapse = () => setCollapsed((v) => !v)

  useEffect(() => {
    if (!persistCollapsed) return
    try { localStorage.setItem('sidebarCollapsed', String(collapsed)) } catch {}
  }, [collapsed])

  return (
    <div className={`bg-white/80 backdrop-blur border-r border-gray-100 ${collapsed ? 'w-16' : 'w-64'}`} aria-label="Sidebar Navigation">
      <div className="flex flex-col h-full">
        {/* Top Section - User Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-white/40">
              <User className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {user?.accountType || 'Free'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-4">
          {navigationSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  {section.label}
                </div>
              )}
              <div className="space-y-2">
                {section.items.map((item) => {
                  const IconComponent = getIconComponent(item.icon)
                  const isActive = currentPage === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200'
                      } ${collapsed ? 'justify-center' : ''}`}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {item.badge && !collapsed && (
                        <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <button
            onClick={() => { window.location.href = '/' }}
            className={`${collapsed ? 'flex items-center justify-center h-8 w-8 rounded-xl' : 'w-full flex items-center justify-start space-x-3 rounded-xl px-3 py-2'} text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-sm`}
            aria-label="Logout"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className={collapsed ? 'w-4 h-4 stroke-[2]' : 'w-5 h-5'} />
            {!collapsed && <span className="truncate">Logout</span>}
          </button>
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-[color,background-color,box-shadow,border-color] duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 