'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TasksPage from '@/components/TasksPage'
import TaskCreationModal from '@/components/TaskCreationModal'
import PageHeader from '@/components/PageHeader'
import { Play, RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TaskDetails from '@/components/TaskDetails'
import { useUser } from '@/contexts/UserContext'

export default function TasksRoute() {
  const { user, loading } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })

  const handleCreateTask = () => {
    setShowCreateTaskModal(true)
  }

  // Persist density across app
  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

  const handleTaskCreated = (taskId: string) => {
    console.log('Task created successfully:', taskId)
    setShowCreateTaskModal(false)
    // Refresh the tasks list
    window.location.reload()
  }

  const handleNavigate = (page: string) => {
    if (page === 'tasks') return
    router.push(`/${page}`)
  }
  
  // Handle task ID from URL
  useEffect(() => {
    const taskId = searchParams.get('taskId')
    if (taskId) {
      setSelectedTaskId(taskId)
      setShowTaskDetails(true)
    }
  }, [searchParams])

  // Show loading state while user data is being fetched
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
      <Sidebar 
        currentPage="tasks"
        onNavigate={handleNavigate}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Tasks"
          subtitle="Manage and monitor your automation tasks"
          icon={<Play className="w-5 h-5 text-white" />}
          actions={(
            <div className="flex items-center gap-3">
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
              <Button onClick={handleCreateTask} variant="gradient" className="px-6 py-2 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          )}
        />
        <div className={`max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6 ${density==='compact' ? 'py-2' : ''}`}>
          <div className={density==='compact' ? 'text-[13px]' : ''}>
            <TasksPage onCreateTask={handleCreateTask} />
          </div>
        </div>
      </div>
      
      <TaskCreationModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onTaskCreated={handleTaskCreated}
      />
      
      {showTaskDetails && selectedTaskId && (
        <TaskDetails
          taskId={selectedTaskId}
          isOpen={showTaskDetails}
          onClose={() => {
            setShowTaskDetails(false)
            setSelectedTaskId(null)
            // Update URL to remove taskId parameter
            const url = new URL(window.location.href)
            url.searchParams.delete('taskId')
            window.history.replaceState({}, '', url.toString())
          }}
        />
      )}
    </div>
  )
} 