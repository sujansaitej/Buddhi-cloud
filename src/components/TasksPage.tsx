'use client'

import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  MoreVertical, 
  Search, 
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  SortAsc,
  SortDesc,
  Copy,
  Share2,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useTasks, useTaskActions, useTaskUpdates, apiUtils } from '@/hooks/useApi'
import { Task } from '@/types'
import TaskDetails from './TaskDetails'

interface TasksPageProps {
  onCreateTask: () => void
}

export default function TasksPage({ onCreateTask }: TasksPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Additional filtering options
  const [dateRange, setDateRange] = useState<string>('all')
  const [durationFilter, setDurationFilter] = useState<string>('all')
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Use the new filtering capabilities
  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useTasks(
    currentPage, 
    10, 
    {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchTerm || undefined,
      sortBy,
      sortOrder
    }
  )
  
  const { stopTask, pauseTask, resumeTask, loading: actionLoading, setActionLoading } = useTaskActions()
  const { task: selectedTaskData } = useTaskUpdates(selectedTask, false) // No polling

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

  // Handle the new API response structure
  const tasks = tasksData?.tasks || []
  const totalPages = tasksData?.total_pages || 1
  const totalCount = tasksData?.total_count || 0
  const currentPageNum = tasksData?.page || 1
  const currentLimit = tasksData?.limit || 10

  // Apply client-side filtering for advanced filters only
  const filteredTasks = tasks.filter((task: any) => {
    // Date range filter
    if (dateRange !== 'all') {
      const taskDate = new Date(task.created_at)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      let shouldInclude = false
      switch (dateRange) {
        case 'today':
          shouldInclude = taskDate >= today
          break
        case 'yesterday':
          shouldInclude = taskDate >= yesterday && taskDate < today
          break
        case 'week':
          shouldInclude = taskDate >= weekStart
          break
        case 'month':
          shouldInclude = taskDate >= monthStart
          break
        case 'custom':
          if (startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999) // Include the entire end date
            shouldInclude = taskDate >= start && taskDate <= end
          } else {
            shouldInclude = true
          }
          break
        default:
          shouldInclude = true
      }
      if (!shouldInclude) return false
    }
    
    // Duration filter
    if (durationFilter !== 'all' && task.finished_at) {
      const startTime = new Date(task.created_at).getTime()
      const endTime = new Date(task.finished_at).getTime()
      const durationMinutes = (endTime - startTime) / (1000 * 60)
      
      let shouldInclude = false
      switch (durationFilter) {
        case 'short':
          shouldInclude = durationMinutes < 1
          break
        case 'medium':
          shouldInclude = durationMinutes >= 1 && durationMinutes <= 5
          break
        case 'long':
          shouldInclude = durationMinutes > 5
          break
        default:
          shouldInclude = true
      }
      if (!shouldInclude) return false
    }
    
    // File type filter
    if (fileTypeFilter !== 'all') {
      let hasFiles = false
      switch (fileTypeFilter) {
        case 'recordings':
          // This would need to be checked via API call, but for now we'll assume all finished tasks might have recordings
          hasFiles = task.status === 'finished'
          break
        case 'screenshots':
          // This would need to be checked via API call, but for now we'll assume all finished tasks might have screenshots
          hasFiles = task.status === 'finished'
          break
        case 'output_files':
          hasFiles = (task.output_files && task.output_files.length > 0) ||
                    (task.metadata && task.metadata.output_files && task.metadata.output_files.length > 0)
          break
        default:
          hasFiles = true
      }
      if (!hasFiles) return false
    }
    
    return true
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, sortBy, sortOrder, dateRange, durationFilter, fileTypeFilter, startDate, endDate])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refetchTasks()
    } finally {
      // small delay for UX so spinner is visible
      setTimeout(() => setIsRefreshing(false), 300)
    }
  }

  const handleStopTask = async (taskId: string) => {
    try {
      setActionLoading(true)
      await stopTask(taskId)
      // Add a small delay to allow the API to process the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      refetchTasks()
    } catch (error) {
      console.error('Failed to stop task:', error)
      // Show user-friendly error message
      alert(`Failed to stop task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handlePauseTask = async (taskId: string) => {
    try {
      setActionLoading(true)
      console.log(`[FRONTEND] Pausing task: ${taskId}`)
      
      await pauseTask(taskId)
      
      // Add a delay to allow the API to process the request and update status
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Force a fresh fetch without cache
      refetchTasks()
      // Secondary refresh to catch eventual consistency
      setTimeout(() => {
        refetchTasks()
      }, 3000)
      
    } catch (error) {
      console.error('[FRONTEND] Failed to pause task:', error)
      alert(`Failed to pause task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleResumeTask = async (taskId: string) => {
    try {
      setActionLoading(true)
      console.log(`[FRONTEND] Resuming task: ${taskId}`)
      
      await resumeTask(taskId)
      
      // Add a delay to allow the API to process the request and update status
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Force a fresh fetch without cache
      refetchTasks()
      // Secondary refresh to catch eventual consistency
      setTimeout(() => {
        refetchTasks()
      }, 3000)
      
    } catch (error) {
      console.error('[FRONTEND] Failed to resume task:', error)
      alert(`Failed to resume task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

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
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-600" />
      case 'started':
        return <Play className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    return apiUtils.getStatusColor(status)
  }

  const getActionButtons = (task: any) => {
    const buttons = []

    // View Details Button
    buttons.push(
      <button
        key="details"
        onClick={() => {
          setSelectedTask(task.id)
          setShowTaskDetails(true)
        }}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
    )

    // Task control buttons based on status
    if (task.status === 'running' || task.status === 'started') {
      buttons.push(
        <button
          key="pause"
          onClick={() => handlePauseTask(task.id)}
          disabled={actionLoading}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          title="Pause Task"
        >
          <Pause className="w-4 h-4" />
        </button>,
        <button
          key="stop"
          onClick={() => handleStopTask(task.id)}
          disabled={actionLoading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Stop Task"
        >
          <Square className="w-4 h-4" />
        </button>
      )
    } else if (task.status === 'paused') {
      buttons.push(
        <button
          key="resume"
          onClick={() => handleResumeTask(task.id)}
          disabled={actionLoading}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Resume Task"
        >
          <Play className="w-4 h-4" />
        </button>
      )
    }

    // Live URL button
    if (task.live_url) {
      buttons.push(
        <a
          key="live"
          href={task.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Live"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )
    }

    // Download files button (check both output_files and metadata for files)
    const hasFiles = (task.output_files && task.output_files.length > 0) || 
                    (task.metadata && task.metadata.output_files && task.metadata.output_files.length > 0)
    
    if (hasFiles) {
      buttons.push(
        <button
          key="download"
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Download Files"
        >
          <Download className="w-4 h-4" />
        </button>
      )
    }

    return buttons
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-3 space-y-4">

        {/* Enhanced Filters */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters & Sorting</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                title="Refresh tasks"
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/90 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700"
                aria-label="Refresh tasks"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Status:</div>
                <div className="flex gap-1">
                  {['all','running','finished','failed','paused'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        statusFilter === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                <span>{showFilters ? 'Hide' : 'Show'} Advanced</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks by ID or instructions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="finished">Finished</option>
                <option value="failed">Failed</option>
                <option value="paused">Paused</option>
                <option value="stopped">Stopped</option>
                <option value="created">Created</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200/70">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="created_at">Creation Date</option>
                    <option value="finished_at">Completion Date</option>
                    <option value="status">Status</option>
                    <option value="id">Task ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'desc'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <SortDesc className="w-4 h-4 inline mr-1" />
                      Newest First
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'asc'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <SortAsc className="w-4 h-4 inline mr-1" />
                      Oldest First
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Results Per Page</label>
                  <select
                    value={currentLimit}
                    onChange={(e) => {
                      // This would need to be handled by updating the limit in the hook
                      // console.log('Limit changed to:', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>
              
              {/* Additional Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">Any Duration</option>
                    <option value="short">Short (&lt; 1 min)</option>
                    <option value="medium">Medium (1-5 min)</option>
                    <option value="long">Long (&gt; 5 min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <select
                    value={fileTypeFilter}
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Tasks</option>
                    <option value="recordings">With Recordings</option>
                    <option value="screenshots">With Screenshots</option>
                    <option value="output_files">With Output Files</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Date Range</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="End Date"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {((currentPageNum - 1) * currentLimit) + 1} to {Math.min(currentPageNum * currentLimit, totalCount)} of {totalCount} tasks
          </div>
          <div className="flex items-center space-x-2">
            <span>Page {currentPageNum} of {totalPages}</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm">
          {tasksLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first task to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={onCreateTask}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task: any) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => {
                  setSelectedTask(task.id)
                  setShowTaskDetails(true)
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            Task {task.id}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {apiUtils.formatTaskStatus(task.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {task.task?.substring(0, 100) + (task.task?.length > 100 ? '...' : '') || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                          {task.finished_at && (
                            <span>Finished: {new Date(task.finished_at).toLocaleDateString()}</span>
                          )}
                          <span>Click to view details</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      {getActionButtons(task)}
                      <div className="relative dropdown-container">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === task.id ? null : task.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openDropdown === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              {/* View Details */}
                              <button
                                onClick={() => {
                                  setSelectedTask(task.id)
                                  setShowTaskDetails(true)
                                  setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              
                              {/* Copy Task ID */}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(task.id)
                                  setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <Copy className="w-4 h-4" />
                                <span>Copy Task ID</span>
                              </button>
                              
                              {/* Share Task */}
                              {task.public_share_url && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(task.public_share_url)
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  <span>Copy Share URL</span>
                                </button>
                              )}
                              
                              {/* Live URL */}
                              {task.live_url && (
                                <a
                                  href={task.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenDropdown(null)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span>Open Live URL</span>
                                </a>
                              )}
                              
                              {/* Task Control Actions */}
                              {task.status === 'running' && (
                                <>
                                  <button
                                    onClick={() => {
                                      handlePauseTask(task.id)
                                      setOpenDropdown(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center space-x-2"
                                  >
                                    <Pause className="w-4 h-4" />
                                    <span>Pause Task</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStopTask(task.id)
                                      setOpenDropdown(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                  >
                                    <Square className="w-4 h-4" />
                                    <span>Stop Task</span>
                                  </button>
                                </>
                              )}
                              
                              {task.status === 'paused' && (
                                <button
                                  onClick={() => {
                                    handleResumeTask(task.id)
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                >
                                  <Play className="w-4 h-4" />
                                  <span>Resume Task</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Details (expandable) */}
                  {selectedTask === task.id && selectedTaskData && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Task Output</h4>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                            {selectedTaskData.output || 'No output available'}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recent Steps</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedTaskData.steps?.slice(-5).map((step: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-400">#{step.step_number || index + 1}</span>
                                <span className="text-gray-700">{step.action}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(step.status)}`}>
                                  {step.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPageNum - 1)}
                disabled={currentPageNum <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white/90 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => handlePageChange(currentPageNum + 1)}
                disabled={currentPageNum >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white/90 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 7) {
                  pageNum = i + 1
                } else if (currentPageNum <= 4) {
                  pageNum = i + 1
                } else if (currentPageNum >= totalPages - 3) {
                  pageNum = totalPages - 6 + i
                } else {
                  pageNum = currentPageNum - 3 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-xl ${
                      pageNum === currentPageNum
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 bg-white/90 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
          </div>
        )}
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