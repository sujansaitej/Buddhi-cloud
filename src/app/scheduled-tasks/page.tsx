'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Calendar } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ScheduledTasksPage from '@/components/ScheduledTasksPage'
import { useUser } from '@/contexts/UserContext'
import { useEffect, useState } from 'react'

export default function ScheduledTasksRoute() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })

  const handleNavigate = (page: string) => {
    if (page === 'scheduled-tasks') return
    router.push(`/${page}`)
  }

  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

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
      <Sidebar currentPage="scheduled-tasks" onNavigate={handleNavigate} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader
          title="Scheduled Tasks"
          subtitle="Automate your tasks with recurring schedules"
          icon={<Calendar className="w-5 h-5 text-white" />}
          actions={(
            <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden" role="group" aria-label="Density">
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-2 text-xs ${density==='comfortable' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                aria-pressed={density==='comfortable'}
              >Comfortable</button>
              <button
                onClick={() => setDensity('compact')}
                className={`px-3 py-2 text-xs border-l border-gray-200 ${density==='compact' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                aria-pressed={density==='compact'}
              >Compact</button>
            </div>
          )}
        />

        {/* Content */}
        <div className={`flex-1 overflow-y-auto max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6 ${density==='compact' ? 'text-[13px]' : ''}`}>
          <ScheduledTasksPage />
        </div>
      </div>
    </div>
  )
}



