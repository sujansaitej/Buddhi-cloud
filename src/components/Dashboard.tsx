'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  Workflow as WorkflowIcon, 
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Trash2,
  Edit,
  Settings,
  Star,
  Zap,
  Download,
  Target,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Database,
  FileText,
  Eye,
  TestTube,
  Share2,
  ShoppingCart,
  Mail
} from 'lucide-react'
import StatsCard from './StatsCard'
import { ShadowIllustration, AutomationIllustration, DataFlowIllustration, WorkflowIllustration } from '@/components/Illustrations'
import { Stats, Task } from '@/types'
import { Workflow, WorkflowTemplate } from '@/types/workflow'
import { useBalance, useTasks, useUser, apiUtils } from '@/hooks/useApi'
import TaskDetails from './TaskDetails'
import WorkflowSuggestionsWidget from './WorkflowSuggestionsWidget'
import RecentAlerts from './RecentAlerts'
import AutomationPerformance from './AutomationPerformance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/Sidebar'
import WorkflowTemplates from '@/components/workflow/WorkflowTemplates'
import { WorkflowExecutor } from '@/components/workflow/WorkflowExecutor'
import { getDefaultUniversalSettings } from '@/lib/workflow-utils'

interface DashboardProps {
  onCreateTask: () => void
  onCreateWorkflow: () => void
  onUseTemplate: (template: Workflow | any) => void
}

export default function Dashboard({ onCreateTask, onCreateWorkflow, onUseTemplate }: DashboardProps) {
  // Next.js router
  const router = useRouter()
  
  // API hooks
  const { data: balance, loading: balanceLoading, refreshBalance } = useBalance()
  const { data: tasksData, loading: tasksLoading } = useTasks(1, 6)
  const { data: user, loading: userLoading } = useUser()

  // Local state
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [workflowsLoading, setWorkflowsLoading] = useState(true)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)

  // Fetch workflows from API
  const fetchWorkflows = async () => {
    try {
      setWorkflowsLoading(true)
      const response = await fetch('/api/workflow/list')
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.workflows || [])
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setWorkflowsLoading(false)
    }
  }

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true)
      const response = await fetch('/api/templates?limit=3')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
    fetchTemplates()
  }, [])

  // Calculate stats from real data
  const calculateStats = (): Stats => {
    if (!tasksData) {
      return {
        totalTasks: 0,
        activeTasks: 0,
        creditsLeft: 0,
        successRate: 0
      }
    }

    const tasks = tasksData.tasks || []
    const totalTasks = tasksData.total_count || 0
    const activeTasks = tasks.filter(task => task.status === 'running').length
    const creditsLeft = balance?.balance || 0
    
    const finishedTasks = tasks.filter(task => task.status === 'finished')
    const failedTasks = tasks.filter(task => task.status === 'failed')
    const totalFinished = finishedTasks.length + failedTasks.length
    const successRate = totalFinished > 0 ? Math.round((finishedTasks.length / totalFinished) * 100) : 0

    return {
      totalTasks,
      activeTasks,
      creditsLeft,
      successRate
    }
  }

  const stats = calculateStats()
  const isLoading = balanceLoading || tasksLoading || userLoading

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />
      case 'finished':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    return apiUtils.getStatusColor(status)
  }

  const getCategoryIcon = (category: string) => {
    const iconClass = 'w-5 h-5'
    switch (category) {
      case 'automation': return <Zap className={iconClass} />
      case 'data-extraction': return <Database className={iconClass} />
      case 'form-filling': return <FileText className={iconClass} />
      case 'monitoring': return <Eye className={iconClass} />
      case 'testing': return <TestTube className={iconClass} />
      case 'social-media': return <Share2 className={iconClass} />
      case 'e-commerce': return <ShoppingCart className={iconClass} />
      case 'email': return <Mail className={iconClass} />
      default: return <FileText className={iconClass} />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500 text-white border-emerald-600 font-semibold'
      case 'intermediate': return 'bg-amber-500 text-white border-amber-600 font-semibold'
      case 'advanced': return 'bg-rose-500 text-white border-rose-600 font-semibold'
      default: return 'bg-gray-500 text-white border-gray-600 font-semibold'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-indigo-500 text-white border-indigo-600 font-semibold'
      case 'data-extraction': return 'bg-purple-500 text-white border-purple-600 font-semibold'
      case 'form-filling': return 'bg-orange-500 text-white border-orange-600 font-semibold'
      case 'monitoring': return 'bg-emerald-500 text-white border-emerald-600 font-semibold'
      case 'testing': return 'bg-rose-500 text-white border-rose-600 font-semibold'
      case 'social-media': return 'bg-pink-500 text-white border-pink-600 font-semibold'
      case 'e-commerce': return 'bg-blue-500 text-white border-blue-600 font-semibold'
      case 'email': return 'bg-cyan-500 text-white border-cyan-600 font-semibold'
      default: return 'bg-gray-500 text-white border-gray-600 font-semibold'
    }
  }

  // Transform API task data to our Task interface
  const transformTask = (apiTask: any): Task => {
    return {
      id: apiTask.id,
      name: `Task ${apiTask.id}`,
      description: apiTask.task?.substring(0, 100) + '...' || 'No description',
      status: apiTask.status,
      createdAt: apiTask.created_at,
      finishedAt: apiTask.finished_at,
      liveUrl: apiTask.live_url,
      output: apiTask.output,
      steps: apiTask.steps || [],
      creditsUsed: 0,
      outputFiles: apiTask.output_files || []
    }
  }

  const tasks = tasksData?.tasks?.map(transformTask) || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const handleEditWorkflow = (workflow: Workflow) => {
    router.push(`/workflows?edit=${workflow.id}`)
  }
  
  const handleExecuteWorkflow = (workflow: Workflow) => {
    router.push(`/workflows?execute=${workflow.id}`)
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const response = await fetch(`/api/workflow/delete?id=${workflowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchWorkflows()
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Overview Hero */}
      <div className="relative px-6 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-purple-200/40 to-blue-200/40 rounded-full blur-2xl"></div>
          </div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 items-center">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-3 py-1 text-xs text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live automation overview
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Build, run and monitor your browser automations in one place
              </h1>
              <p className="text-gray-600 max-w-xl">
                Launch workflows, review health, and manage tasks with real-time insights. Clean visuals and subtle motion make complex systems easy to grasp.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onCreateWorkflow} className="btn-primary">
                  Create workflow
                </button>
                <button onClick={onCreateTask} className="btn-secondary">
                  Quick task
                </button>
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-4 justify-items-center">
              <div className="translate-y-2 animate-float">
                <AutomationIllustration className="w-40 h-40 md:w-48 md:h-48" />
              </div>
              <div className="delay-150 animate-float">
                <DataFlowIllustration className="w-36 h-36 md:w-44 md:h-44" />
              </div>
              <div className="-translate-y-2 delay-300 animate-float">
                <WorkflowIllustration className="w-36 h-36 md:w-44 md:h-44" />
              </div>
              <div className="delay-500 animate-float">
                <ShadowIllustration className="w-40 h-40 md:w-48 md:h-48" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Overview */}
      <div className="px-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all animate-scale-in stagger-1">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-indigo-100/70 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 font-medium">Workflows</p>
                <h3 className="text-lg font-bold text-gray-900">Design & execute</h3>
              </div>
              <WorkflowIllustration className="w-16 h-16 opacity-90" />
            </div>
            <p className="mt-2 text-sm text-gray-600">Create multi-step automations with reusable templates.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => router.push('/workflows?create=true')} className="btn-primary px-4 py-2 text-sm">New</button>
              <button onClick={() => router.push('/workflows')} className="btn-secondary px-4 py-2 text-sm">Open</button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all animate-scale-in stagger-2">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-purple-100/70 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Tasks</p>
                <h3 className="text-lg font-bold text-gray-900">Ad-hoc runs</h3>
              </div>
              <AutomationIllustration className="w-16 h-16 opacity-90" />
            </div>
            <p className="mt-2 text-sm text-gray-600">Execute single tasks with live monitoring and logs.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={onCreateTask} className="btn-primary px-4 py-2 text-sm">Run</button>
              <button onClick={() => router.push('/tasks')} className="btn-secondary px-4 py-2 text-sm">View</button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all animate-scale-in stagger-3">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-blue-100/70 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Templates</p>
                <h3 className="text-lg font-bold text-gray-900">Prebuilt flows</h3>
              </div>
              <DataFlowIllustration className="w-16 h-16 opacity-90" />
            </div>
            <p className="mt-2 text-sm text-gray-600">Start faster with curated automation blueprints.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => router.push('/templates')} className="btn-primary px-4 py-2 text-sm">Browse</button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all animate-scale-in stagger-4">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-emerald-100/70 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Wallet</p>
                <h3 className="text-lg font-bold text-gray-900">Usage & credits</h3>
              </div>
              <ShadowIllustration className="w-16 h-16 opacity-90" />
            </div>
            <p className="mt-2 text-sm text-gray-600">Manage credentials, groups, and credit balance.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => router.push('/wallet')} className="btn-secondary px-4 py-2 text-sm">Open wallet</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Quick Stats moved to Settings page */}

        {/* Template Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Popular Templates</h2>
            <button 
              onClick={() => router.push('/templates')}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : templates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
                <p className="text-gray-500 mb-4">Check back later for new automation templates</p>
              </div>
            ) : (
              templates.slice(0, 3).map((template) => (
                <div key={template.id} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md ring-1 ring-white/40">
                            {getCategoryIcon(template.category)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                            {template.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getDifficultyColor(template.difficulty)}>
                              {template.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{template.estimatedTime}s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>{template.tasks.length} tasks</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        by {template.author} • v{template.version}
                      </div>
                      <Button 
                        onClick={() => {
                          onUseTemplate(template)
                          window.location.href = `/workflows?template=${template.id}`
                        }}
                        size="sm"
                        className="btn-primary px-4 py-2 text-xs"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Workflows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Workflows</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/workflows')}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                View All
              </button>
              <button
                onClick={() => router.push('/workflows?create=true')}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))
            ) : workflows.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WorkflowIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
                <p className="text-gray-500 mb-4">Create your first workflow to automate tasks</p>
                <button
                  onClick={() => router.push('/workflows?create=true')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  Create Workflow
                </button>
              </div>
            ) : (
              workflows.slice(0, 6).map((workflow) => (
                <div key={workflow.id} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-md hover:shadow-xl transition-all">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md ring-1 ring-white/40">
                            {getCategoryIcon(workflow.category)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-1 mb-1">
                            {workflow.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {workflow.description}
                          </p>
                        </div>
                      </div>
                      <div className="relative dropdown-container">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === workflow.id ? null : workflow.id)}
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-full transition-all duration-200"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openDropdown === workflow.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl z-20">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEditWorkflow(workflow)
                                  setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-2 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit Workflow</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleDeleteWorkflow(workflow.id)
                                  setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Workflow</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats Section */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-5 px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="font-medium">Status: {workflow.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-medium">
                          {workflow.createdAt ? new Date(workflow.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleExecuteWorkflow(workflow)}
                        className="flex-1 btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Execute
                      </button>
                      <button 
                        onClick={() => handleEditWorkflow(workflow)}
                        className="flex-1 btn-secondary py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh Tasks"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={onCreateTask}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </button>
              <button
                onClick={() => router.push('/tasks')}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <span>View All Tasks</span>
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">Create your first task to get started</p>
                  <button
                    onClick={onCreateTask}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Create Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 6).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => {
                      setSelectedTask(task.id)
                      setShowTaskDetails(true)
                    }}>
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(task.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {apiUtils.formatTaskStatus(task.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features Section */}
      <div className="px-6 space-y-8 mb-8">
        {/* Row 1: Suggestions */}
        <div className="grid grid-cols-1 gap-8 items-stretch">
          <div className="h-full">
            <WorkflowSuggestionsWidget onUseTemplate={onUseTemplate} className="h-full min-h-[420px]" />
          </div>
        </div>

        {/* Health moved to Settings */}

        {/* Row 3: Remaining (Alerts + Performance) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
          <div className="h-full">
            <RecentAlerts className="h-full min-h-[320px]" />
          </div>
          <AutomationPerformance className="h-full min-h-[320px]" />
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <TaskDetails
          taskId={selectedTask}
          isOpen={showTaskDetails}
          onClose={() => {
            setShowTaskDetails(false)
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
} 