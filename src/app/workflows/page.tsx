'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Play,
  Settings,
  Trash2,
  Edit,
  Eye,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
  Filter,
  ArrowLeft,
  Wand2,
  CheckCircle,
  Clock,
  Users,
  X,
  Save,
  Database,
  TestTube,
  Share2,
  ShoppingCart,
  Mail
} from 'lucide-react'
import { Workflow } from '@/types/workflow'
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder'
import AIWorkflowGenerator from '@/components/workflow/AIWorkflowGenerator'
import WorkflowTemplates from '@/components/workflow/WorkflowTemplates'
import { WorkflowExecutor } from '@/components/workflow/WorkflowExecutor'
import { getDefaultUniversalSettings } from '@/lib/workflow-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/Sidebar'
import { useUser } from '@/contexts/UserContext'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  title: string
}

export default function WorkflowsPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [currentView, setCurrentView] = useState<'list' | 'builder' | 'templates' | 'ai-generator'>('list')
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })

  // Persist density across app. Keep above any conditional returns
  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflow/list')
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.workflows || [])
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
      addNotification('error', 'Error', 'Failed to fetch workflows')
    } finally {
      setIsLoading(false)
    }
  }

  const addNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, title, message }
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleLoadTemplate = async (templateId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/templates/${templateId}`)
      const data = await response.json()
      
      if (data.success && data.template) {
        handleTemplateSelected(data.template)
      } else {
        addNotification('error', 'Error', 'Failed to load template')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      addNotification('error', 'Error', 'Failed to load template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name: 'New Workflow',
      description: 'A new automation workflow',
      category: 'automation',
      status: 'active',
      tasks: [],
      variables: [],
      triggers: [],
      settings: getDefaultUniversalSettings(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user',
      version: 1
    }
    setSelectedWorkflow(newWorkflow)
    setCurrentView('builder')
  }

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setCurrentView('builder')
  }

  const handleTemplateSelected = (template: any) => {
    const workflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category as Workflow['category'],
      status: 'active',
      tasks: template.tasks,
      variables: template.variables,
      triggers: [],
      settings: getDefaultUniversalSettings(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user',
      version: 1
    }
    setSelectedWorkflow(workflow)
    setCurrentView('builder')
  }

  useEffect(() => {
    fetchWorkflows()
    
    // Handle URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      
      // Handle template parameter
      const templateId = urlParams.get('template')
      if (templateId) {
        handleLoadTemplate(templateId)
      }
      
      // Handle edit parameter
      const editId = urlParams.get('edit')
      if (editId) {
        const workflowToEdit = workflows.find(w => w.id === editId)
        if (workflowToEdit) {
          handleEditWorkflow(workflowToEdit)
        }
      }
      
      // Handle execute parameter
      const executeId = urlParams.get('execute')
      if (executeId) {
        const workflowToExecute = workflows.find(w => w.id === executeId)
        if (workflowToExecute) {
          // Will be handled after workflows are loaded
        }
      }
      
      // Handle create parameter
      const createParam = urlParams.get('create')
      if (createParam === 'true') {
        handleCreateWorkflow()
      }
    }
  }, [workflows.length])

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



  const handleAIWorkflowGenerated = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setCurrentView('builder')
  }

  

  const handleWorkflowExecutionSuccess = (taskId: string) => {
    console.log('Workflow executed successfully, task ID:', taskId)
    addNotification('success', 'Success', `Workflow execution started! Task ID: ${taskId}`)
    
    // Navigate to the task details page
    if (taskId) {
      setTimeout(() => {
        router.push(`/tasks?taskId=${taskId}`)
      }, 1500) // Short delay to allow the notification to be seen
    }
  }

  const handleWorkflowExecutionError = (error: string) => {
    console.error('Workflow execution error:', error)
    addNotification('error', 'Execution Failed', error)
  }

  const handleSaveWorkflow = async (workflow: Workflow) => {
    try {
      console.log('Saving workflow:', workflow)

      // Check if this is an existing workflow (has an ID that exists in our list)
      const isExistingWorkflow = workflows.some(w => w.id === workflow.id)
      
      let response
      if (isExistingWorkflow) {
        // Update existing workflow
        console.log('Updating existing workflow:', workflow.id)
        response = await fetch('/api/workflow/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflow),
        })
      } else {
        // Create new workflow
        console.log('Creating new workflow')
        response = await fetch('/api/workflow/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflow),
        })
      }

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchWorkflows()
        const saved = data.workflow
        if (saved) {
          setSelectedWorkflow(saved)
        }
        addNotification('success', 'Success', `Workflow ${isExistingWorkflow ? 'updated' : 'created'} successfully!`)
        return saved || workflow
      } else {
        const errorMessage = data.error || data.details || `Failed to ${isExistingWorkflow ? 'update' : 'create'} workflow`
        console.error('Save workflow error:', data)
        addNotification('error', 'Save Failed', errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      addNotification('error', 'Error', `Error saving workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const response = await fetch(`/api/workflow/delete?id=${workflowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchWorkflows()
        addNotification('success', 'Success', 'Workflow deleted successfully!')
      } else {
        const errorData = await response.json()
        addNotification('error', 'Delete Failed', errorData.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
      addNotification('error', 'Error', `Error deleting workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleNavigate = (page: string) => {
    if (page === 'workflows') {
      setCurrentView('list')
      setSelectedWorkflow(null)
    } else {
      router.push(`/${page}`)
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-200 text-emerald-800 border-emerald-300 hover:bg-emerald-300 hover:text-emerald-900 transition-all duration-200'
      case 'draft': return 'bg-amber-200 text-amber-800 border-amber-300 hover:bg-amber-300 hover:text-amber-900 transition-all duration-200'
      case 'archived': return 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-800 transition-all duration-200'
      default: return 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-800 transition-all duration-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-blue-300 text-blue-900 border-blue-400 hover:bg-blue-400 hover:text-blue-950 transition-all duration-200'
      case 'data-extraction': return 'bg-purple-300 text-purple-900 border-purple-400 hover:bg-purple-400 hover:text-purple-950 transition-all duration-200'
      case 'form-filling': return 'bg-orange-300 text-orange-900 border-orange-400 hover:bg-orange-400 hover:text-orange-950 transition-all duration-200'
      case 'monitoring': return 'bg-teal-300 text-teal-900 border-teal-400 hover:bg-teal-400 hover:text-teal-950 transition-all duration-200'
      case 'testing': return 'bg-red-300 text-red-900 border-red-400 hover:bg-red-400 hover:text-red-950 transition-all duration-200'
      case 'social-media': return 'bg-pink-300 text-pink-900 border-pink-400 hover:bg-pink-400 hover:text-pink-950 transition-all duration-200'
      case 'e-commerce': return 'bg-indigo-300 text-indigo-900 border-indigo-400 hover:bg-indigo-400 hover:text-indigo-950 transition-all duration-200'
      default: return 'bg-gray-300 text-gray-800 border-gray-400 hover:bg-gray-400 hover:text-gray-900 transition-all duration-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconClass = 'w-5 h-5'
    switch (category) {
      case 'automation': return <Sparkles className={iconClass} />
      case 'data-extraction': return <Database className={iconClass} />
      case 'form-filling': return <FileText className={iconClass} />
      case 'monitoring': return <Eye className={iconClass} />
      case 'testing': return <TestTube className={iconClass} />
      case 'social-media': return <Share2 className={iconClass} />
      case 'e-commerce': return <ShoppingCart className={iconClass} />
      default: return <Mail className={iconClass} />
    }
  }

  const categories = [
    'all',
    'automation',
    'data-extraction',
    'form-filling',
    'monitoring',
    'testing',
    'social-media',
    'e-commerce'
  ]

  // Notification Component
  const NotificationToast = ({ notification }: { notification: Notification }) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
        case 'error': return <X className="w-5 h-5 text-red-600" />
        case 'info': return <Clock className="w-5 h-5 text-blue-600" />
      }
    }

    const getBgColor = () => {
      switch (notification.type) {
        case 'success': return 'bg-green-50 border-green-200'
        case 'error': return 'bg-red-50 border-red-200'
        case 'info': return 'bg-blue-50 border-blue-200'
      }
    }

    return (
      <div className={`fixed top-4 right-4 z-[999999] p-4 border rounded-xl shadow-lg max-w-sm animate-in slide-in-from-right-4 duration-300 ${getBgColor()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</h3>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Render different views
  if (currentView === 'builder' && selectedWorkflow) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Sidebar
          currentPage="workflows"
          onNavigate={handleNavigate}
          user={user}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentView('list')
                    setSelectedWorkflow(null)
                  }}
                  className="hover:bg-gray-100 border border-gray-200 shadow-sm rounded-xl p-3"
                  title="Back to Workflows"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
                    <p className="text-sm text-gray-600">{selectedWorkflow.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WorkflowExecutor
                  workflow={selectedWorkflow}
                  onSuccess={handleWorkflowExecutionSuccess}
                  onError={handleWorkflowExecutionError}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <WorkflowBuilder
              workflow={selectedWorkflow}
              onSave={handleSaveWorkflow}
              onPreview={() => { }}
            />
          </div>
        </div>
        
        {/* Notifications */}
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    )
  }

  if (currentView === 'ai-generator') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Sidebar
          currentPage="workflows"
          onNavigate={handleNavigate}
          user={user}
        />
        <div className="flex-1 overflow-y-auto">
          <AIWorkflowGenerator
            onWorkflowGenerated={handleAIWorkflowGenerated}
            onBack={() => setCurrentView('list')}
          />
        </div>
        
        {/* Notifications */}
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    )
  }

  if (currentView === 'templates') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Sidebar
          currentPage="workflows"
          onNavigate={handleNavigate}
          user={user}
        />
        <div className="flex-1 overflow-y-auto">
          <WorkflowTemplates
            onTemplateSelected={handleTemplateSelected}
            onBack={() => setCurrentView('list')}
          />
        </div>
        
        {/* Notifications */}
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    )
  }

  // Main workflows list view
  return (
    <div className={`flex h-screen bg-gray-50 ${density==='compact' ? 'text-[13px]' : ''}`}>
      <Sidebar currentPage="workflows" onNavigate={handleNavigate} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Workflows"
          subtitle="Create and manage your automation workflows"
          icon={<Wand2 className="w-5 h-5 text-white" />}
          actions={(
            <>
              <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden mr-2" role="group" aria-label="Density">
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
              <Button onClick={() => setCurrentView('ai-generator')} variant="gradient" className="px-6 py-2.5">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
              <Button onClick={handleCreateWorkflow} variant="gradient" className="from-blue-600 to-blue-700 px-6 py-2.5">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </>
          )}
        />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'list' && (
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 animate-fade-in-up">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                    <Input
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-xl shadow-sm text-sm h-12"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-transparent border-0 focus:ring-0 text-sm font-medium text-gray-700"
                    >
                      <option value="all">All Categories</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Workflows List */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 text-sm">Loading workflows...</p>
                    </div>
                  </div>
                ) : filteredWorkflows.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No workflows found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Get started by creating your first workflow or use AI to generate one automatically.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={handleCreateWorkflow}
                        variant="gradient"
                        className="px-6 py-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Workflow
                      </Button>
                      <Button
                        onClick={() => setCurrentView('ai-generator')}
                        variant="gradient"
                        className="from-purple-600 to-pink-600 px-6 py-3"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Generate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                    {filteredWorkflows.map(workflow => (
                      <Card key={workflow.id} className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group rounded-2xl h-full flex flex-col overflow-hidden animate-scale-in">
                        <CardContent className="p-0 flex flex-col h-full">
                          {/* Card Header */}
                          <div className="p-6 pb-4 flex-1 min-h-0">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/20">
                                  {getCategoryIcon(workflow.category)}
                                </div>
                                <div>
                                  <Badge className={`${getCategoryColor(workflow.category)} border-0 font-semibold text-xs px-4 py-2 rounded-full shadow-md`}>
                                    {workflow.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(workflow.status)} border-0 font-semibold text-xs px-4 py-2 rounded-full shadow-md`}>
                                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 leading-tight">
                              <span className="line-clamp-2 break-words">{workflow.name}</span>
                            </h3>
                            <div>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 break-words">{workflow.description}</p>
                            </div>
                          </div>

                          {/* Stats & Actions - Fixed at bottom */}
                          <div className="mt-auto">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-t border-gray-100/60">
                              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-700">{workflow.tasks.length} tasks</span>
                                  <span className="hidden sm:inline text-gray-300">•</span>
                                  <span className="font-semibold text-gray-700">v{workflow.version}</span>
                                </div>
                                <span className="font-medium text-gray-600">{new Date(workflow.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>

                              {/* Action Buttons */}
                              {/* Actions: Row 1 - Edit | Execute */}
                              <div className="grid grid-cols-2 gap-2 w-full">
                                <Button
                                  size="sm"
                                  variant="gradient"
                                  onClick={() => handleEditWorkflow(workflow)}
                                  className="w-full rounded-xl font-semibold h-10"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <WorkflowExecutor
                                  workflow={workflow}
                                  onSuccess={handleWorkflowExecutionSuccess}
                                  onError={handleWorkflowExecutionError}
                                  showScheduleButton={false}
                                  executeButtonClassName="w-full"
                                />
                              </div>

                              {/* Actions: Row 2 - Schedule | Eye | Delete */}
                              <div className="mt-2 flex items-center gap-2 w-full">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    router.push(`/scheduled-tasks?workflowId=${encodeURIComponent(workflow.id)}`)
                                  }}
                                  className="flex-1 bg-white/90 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl h-10 px-4 shadow-sm"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Schedule
                                </Button>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditWorkflow(workflow)}
                                    className="w-10 h-10 p-0 bg-white/90 border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full shadow-sm"
                                    title="Preview"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteWorkflow(workflow.id)}
                                    className="w-10 h-10 p-0 bg-white/90 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-600 rounded-full shadow-sm"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Notifications */}
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}