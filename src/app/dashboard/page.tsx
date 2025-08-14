'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import TaskCreationModal from '@/components/TaskCreationModal'
import ApiKeySetup from '@/components/ApiKeySetup'
import ApiKeyTest from '@/components/ApiKeyTest'
import BrowserProfilesPage from '@/components/BrowserProfilesPage'
import ScheduledTasksPage from '@/components/ScheduledTasksPage'
import { useUser } from '@/contexts/UserContext'
import { WorkflowTemplate } from '@/types/workflow'

// Import the proper page components
import SettingsPage from '@/app/settings/page'
import HistoryPage from '@/app/history/page'

export default function DashboardPage() {
  const { user, loading } = useUser()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showCreateWorkflowModal, setShowCreateWorkflowModal] = useState(false)
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [showApiKeyTest, setShowApiKeyTest] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  const handleNavigate = (page: string) => {
    if (page === 'workflows') {
      window.location.href = '/workflows'
      return
    }
    if (page === 'tasks') {
      window.location.href = '/tasks'
      return
    }
    if (page === 'wallet') {
      window.location.href = '/wallet'
      return
    }
    if (page === 'templates') {
      window.location.href = '/templates'
      return
    }
    if (page === 'history') {
      window.location.href = '/history'
      return
    }
    if (page === 'settings') {
      window.location.href = '/settings'
      return
    }
    setCurrentPage(page)
  }

  const handleCreateTask = () => {
    setSelectedTemplate(null)
    setShowCreateTaskModal(true)
  }

  const handleCreateWorkflow = () => {
    setShowCreateWorkflowModal(true)
    // TODO: Implement workflow creation modal
    // console.log('Create workflow clicked')
  }

  const handleUseTemplate = async (template: WorkflowTemplate) => {
    try {
      // Increment template usage
      const response = await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'user' })
      })

      if (response.ok) {
        // Redirect to workflow builder with the template parameter
        window.location.href = `/workflows?template=${template.id}`
      }
    } catch (error) {
      console.error('Error using template:', error)
      // Even if the usage increment fails, still redirect to use the template
      window.location.href = `/workflows?template=${template.id}`
    }
  }

  const handleTaskCreated = (taskId: string) => {
    console.log('Task created successfully:', taskId)
    setShowCreateTaskModal(false)
    // Navigate to tasks page to show the new task
    window.location.href = '/tasks'
  }

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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onCreateTask={handleCreateTask}
            onCreateWorkflow={handleCreateWorkflow}
            onUseTemplate={handleUseTemplate}
          />
        )

      case 'scheduled-tasks':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              <ScheduledTasksPage />
            </div>
          </div>
        )
      
      case 'browser-profiles':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              <BrowserProfilesPage />
            </div>
          </div>
        )
      case 'templates':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates</h2>
                <p className="text-gray-600 mb-6">Browse and use pre-built automation templates</p>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all duration-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )
      case 'history':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <HistoryPage />
          </div>
        )
      case 'settings':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <SettingsPage />
          </div>
        )
      default:
        return (
          <Dashboard
            onCreateTask={handleCreateTask}
            onCreateWorkflow={handleCreateWorkflow}
            onUseTemplate={handleUseTemplate}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        initialCollapsed={true}
        persistCollapsed={false}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {renderPage()}
      </div>
      
      {showCreateTaskModal && (
        <TaskCreationModal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
      
      {showApiKeySetup && (
        <ApiKeySetup
          isOpen={showApiKeySetup}
          onClose={() => setShowApiKeySetup(false)}
        />
      )}
      
      {showApiKeyTest && (
        <ApiKeyTest
          isOpen={showApiKeyTest}
          onClose={() => setShowApiKeyTest(false)}
        />
      )}
    </div>
  )
} 