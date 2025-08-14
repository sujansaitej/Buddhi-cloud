'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { Monitor } from 'lucide-react'
import BrowserProfilesPage from '@/components/BrowserProfilesPage'
import PageHeader from '@/components/PageHeader'
import { useUser } from '@/contexts/UserContext'

export default function BrowserProfilesRoute() {
  const { user, loading } = useUser()
  const router = useRouter()

  const handleNavigate = (page: string) => {
    if (page === 'browser-profiles') return
    router.push(`/${page}`)
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="browser-profiles" onNavigate={handleNavigate} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader
          title="Browser Profiles"
          subtitle="Manage browser configurations for your automation tasks"
          icon={<Monitor className="w-5 h-5 text-white" />}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6">
          <BrowserProfilesPage />
        </div>
      </div>
    </div>
  )
}



