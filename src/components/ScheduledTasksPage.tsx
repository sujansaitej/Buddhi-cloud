'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Calendar,
  Clock,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  Timer,
  Repeat
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { apiService, ScheduledTaskResponse } from '@/lib/api'
import CreateScheduledTaskModal from './CreateScheduledTaskModal'
import EditScheduledTaskModal from './EditScheduledTaskModal'

interface ScheduledTasksPageProps {
  className?: string
}

export default function ScheduledTasksPage({ className }: ScheduledTasksPageProps) {
  const [tasks, setTasks] = useState<ScheduledTaskResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [modalDefaultMode, setModalDefaultMode] = useState<'custom' | 'workflow'>('custom')
  const [modalWorkflowId, setModalWorkflowId] = useState<string | undefined>(undefined)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ScheduledTaskResponse | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'next' | 'created' | 'status'>('next')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await apiService.getScheduledTasks(1, 50)
      setTasks(response.tasks || [])
    } catch (error) {
      console.error('Error fetching scheduled tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // If URL has ?workflowId=..., open modal in workflow mode
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const wid = url.searchParams.get('workflowId')
    if (wid) {
      setModalDefaultMode('workflow')
      setModalWorkflowId(wid)
      setShowCreateModal(true)
      // optional: clean the query param without reload
      url.searchParams.delete('workflowId')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  const handleCreateTask = async (taskData: any) => {
    try {
      await apiService.createScheduledTask(taskData)
      await fetchTasks()
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating scheduled task:', error)
      throw error
    }
  }

  const handleEditTask = async (taskData: any) => {
    if (!selectedTask) return
    
    try {
      await apiService.updateScheduledTask(selectedTask.id, taskData)
      await fetchTasks()
      setShowEditModal(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error updating scheduled task:', error)
      throw error
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled task? This will stop all future executions.')) {
      return
    }

    try {
      await apiService.deleteScheduledTask(taskId)
      await fetchTasks()
    } catch (error) {
      console.error('Error deleting scheduled task:', error)
    }
  }

  const handleToggleActive = async (task: ScheduledTaskResponse) => {
    try {
      await apiService.updateScheduledTask(task.id, {
        is_active: !task.is_active
      })
      await fetchTasks()
    } catch (error) {
      console.error('Error toggling task status:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && task.is_active) ||
      (filterStatus === 'inactive' && !task.is_active)
    return matchesSearch && matchesFilter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'status') {
      return (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1
    }
    if (sortBy === 'created') {
      const ad = new Date(a.created_at as any).getTime()
      const bd = new Date(b.created_at as any).getTime()
      return bd - ad
    }
    // next run
    const an = computeNextRun(a)
    const bn = computeNextRun(b)
    const at = an ? an.getTime() : Infinity
    const bt = bn ? bn.getTime() : Infinity
    return at - bt
  })

  // Robust date parsing: treat ISO-like strings without timezone as UTC
  const parseTaskDate = (value: any): Date => {
    if (!value) return new Date(NaN)
    if (value instanceof Date) return value
    if (typeof value === 'string') {
      if (/Z|[+-]\d{2}:?\d{2}$/.test(value) || /GMT/.test(value)) return new Date(value)
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?$/.test(value)) return new Date(`${value}Z`)
      return new Date(value)
    }
    return new Date(value)
  }

  const computeNextRun = (task: ScheduledTaskResponse): Date | null => {
    const now = new Date()
    const endAt = task.end_at ? parseTaskDate(task.end_at) : undefined
    
    if (task.schedule_type === 'interval' && task.interval_minutes) {
      const start = parseTaskDate(task.start_at)
      const intervalMs = task.interval_minutes * 60_000
      if (now.getTime() <= start.getTime()) {
        return start
      }
      const elapsed = now.getTime() - start.getTime()
      const k = Math.floor(elapsed / intervalMs) + 1
      const next = new Date(start.getTime() + k * intervalMs)
      if (endAt && next.getTime() > endAt.getTime()) return null
      // If provider gave a future next_run_at, prefer the later of computed vs provider to avoid flicker
      const providerNext = task.next_run_at ? parseTaskDate(task.next_run_at) : new Date(NaN)
      if (!isNaN(providerNext.getTime()) && providerNext.getTime() > now.getTime()) {
        return providerNext.getTime() > next.getTime() ? providerNext : next
      }
      return next
    }
    // Cron or when interval info missing – fallback to provider next_run_at if it's in the future
    const providerNext = parseTaskDate(task.next_run_at)
    if (!isNaN(providerNext.getTime()) && providerNext.getTime() > now.getTime()) return providerNext
    return null
  }

  const computeNextRuns = (task: ScheduledTaskResponse, count = 3): Date[] => {
    const results: Date[] = []
    if (task.schedule_type === 'interval' && task.interval_minutes) {
      const now = new Date()
      const start = parseTaskDate(task.start_at)
      const endAt = task.end_at ? parseTaskDate(task.end_at) : undefined
      const intervalMs = task.interval_minutes * 60_000
      let first: Date
      if (now.getTime() <= start.getTime()) {
        first = start
      } else {
        const elapsed = now.getTime() - start.getTime()
        const k = Math.floor(elapsed / intervalMs) + 1
        first = new Date(start.getTime() + k * intervalMs)
      }
      let cur = first
      while (results.length < count) {
        if (endAt && cur.getTime() > endAt.getTime()) break
        results.push(cur)
        cur = new Date(cur.getTime() + intervalMs)
      }
      return results
    }
    // Cron: show provider next_run_at if future
    const providerNext = task.next_run_at ? parseTaskDate(task.next_run_at) : new Date(NaN)
    if (!isNaN(providerNext.getTime()) && providerNext.getTime() > Date.now()) return [providerNext]
    return results
  }

  const formatLocal = (d: Date) => d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })

  const formatNextRun = (task: ScheduledTaskResponse) => {
    const next = computeNextRun(task)
    if (!next) return 'Overdue'
    const now = new Date()
    const diffMs = next.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24)
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''} (${formatLocal(next)})`
    } else if (diffHours > 0) {
      return `In ${diffHours}h ${diffMins}m (${formatLocal(next)})`
    }
    return `In ${Math.max(diffMins, 0)}m (${formatLocal(next)})`
  }

  const formatSchedule = (task: ScheduledTaskResponse) => {
    if (task.schedule_type === 'interval') {
      const minutes = task.interval_minutes || 0
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60)
        const remainingMins = minutes % 60
        return remainingMins > 0 ? `Every ${hours}h ${remainingMins}m` : `Every ${hours}h`
      }
      return `Every ${minutes}m`
    } else {
      return `Cron: ${task.cron_expression}`
    }
  }

  return (
    <div className={`py-4 ${className}`}>
      {/* Header removed to avoid duplication with route-level PageHeader */}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10 pointer-events-none" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e)=> setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              aria-label="Sort by"
            >
              <option value="next">Sort: Next run</option>
              <option value="created">Sort: Created</option>
              <option value="status">Sort: Status</option>
            </select>
            <Button 
              variant="outline" 
              onClick={fetchTasks}
              disabled={loading}
              className="border-gray-200 hover:border-gray-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="lg:ml-auto">
            <Button onClick={() => setShowCreateModal(true)} variant="gradient" className="h-10 px-5">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Task
            </Button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl animate-pulse border-0">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'No tasks match your search criteria.' 
                : 'Create your first scheduled task to automate your workflows.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
            <Button onClick={() => setShowCreateModal(true)} variant="gradient" className="px-6">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-1 gap-3">
                  {/* Left: icon + title + small pills */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md text-white flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base md:text-lg font-semibold leading-tight line-clamp-1 md:line-clamp-2" title={task.task}>
                        {task.task}
                      </CardTitle>
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        <span className={`px-2.5 py-1 text-[12px] rounded-full font-semibold ${task.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {task.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2.5 py-1 text-[12px] rounded-full font-semibold bg-indigo-100 text-indigo-700">
                          {task.schedule_type === 'interval' ? (
                            <><Timer className="w-3 h-3 mr-1 inline" /> Interval</>
                          ) : (
                            <><Repeat className="w-3 h-3 mr-1 inline" /> Cron</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: compact schedule summary */}
                  <div className="hidden sm:flex flex-col items-end gap-1 text-sm min-w-[12rem]">
                    <div className="font-medium text-gray-800">{formatSchedule(task)}</div>
                    <div className="text-gray-500">{formatNextRun(task)}</div>
                  </div>

                  {/* Menu */}
                  <div className="relative ml-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenDropdown(openDropdown === task.id ? null : task.id)}
                      className="w-10 h-10 p-0 rounded-full"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    {openDropdown === task.id && (
                      <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            handleToggleActive(task)
                            setOpenDropdown(null)
                          }}
                        >
                          {task.is_active ? (
                            <><Pause className="w-3 h-3 mr-2" /> Deactivate</>
                          ) : (
                            <><Play className="w-3 h-3 mr-2" /> Activate</>
                          )}
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            setSelectedTask(task)
                            setShowEditModal(true)
                            setOpenDropdown(null)
                          }}
                        >
                          <Edit className="w-3 h-3 mr-2" />
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          onClick={() => {
                            handleDeleteTask(task.id)
                            setOpenDropdown(null)
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-100"></div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Schedule Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </div>
                  <span className="text-sm font-medium">
                    {formatSchedule(task)}
                  </span>
                </div>

                {/* Next Run */}
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {task.is_active ? 'Next Run' : 'Next (planned)'}
                    </div>
                    <span className="text-sm font-medium">{formatNextRun(task)}</span>
                  </div>
                  {/* Next runs preview (like Edit modal) */}
                  <div className="text-[11px] text-gray-600">
                    {(() => {
                      const runs = computeNextRuns(task, 3)
                      if (!runs.length) return null
                      return (
                        <span>
                          Next runs: {runs.map((r) => formatLocal(r)).join(' • ')}
                        </span>
                      )
                    })()}
                  </div>
                </>

                {/* Key Settings condensed */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{task.llm_model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ad Block</span>
                    <span className="font-medium">{task.use_adblock ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proxy</span>
                    <span className="font-medium">{task.use_proxy ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Record</span>
                    <span className="font-medium">{task.enable_recordings ? 'On' : 'Off'}</span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-[11px] text-gray-500 pt-2 border-t grid grid-cols-2 gap-2">
                  <div>Start: {parseTaskDate(task.start_at).toLocaleString()}</div>
                  <div>Next: {(() => { const n = computeNextRun(task); return n ? n.toLocaleString() : '—' })()}</div>
                </div>

                {/* Footer Actions (same pattern as workflow cards) */}
                <div className="mt-2 pt-4 border-t border-gray-100/60">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="gradient"
                      className="w-full rounded-xl h-10"
                      onClick={() => { setSelectedTask(task); setShowEditModal(true) }}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/90 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-xl h-10"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateScheduledTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateTask}
          defaultMode={modalDefaultMode}
          defaultWorkflowId={modalWorkflowId}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <EditScheduledTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedTask(null)
          }}
          onSave={handleEditTask}
          task={selectedTask}
        />
      )}
    </div>
  )
}

