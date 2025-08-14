'use client'

import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  Filter, 
  Search, 
  RefreshCw, 
  Eye,
  Workflow,
  Play,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Pause,
  Square,
  Calendar,
  Settings
} from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Sidebar from '@/components/Sidebar'
import PageHeader from '@/components/PageHeader'

interface HistoryEvent {
  id: string
  type: 'workflow_created' | 'workflow_edited' | 'workflow_deleted' | 'task_executed' | 'task_stopped' | 'task_paused' | 'task_resumed' | 'template_used' | 'settings_changed'
  title: string
  description: string
  timestamp: Date
  userId: string
  userName: string
  metadata?: Record<string, any>
  severity: 'info' | 'success' | 'warning' | 'error'
}

export default function HistoryPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [events, setEvents] = useState<HistoryEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<HistoryEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, typeFilter, dateFilter, severityFilter])

  const loadHistory = async () => {
    try {
      setLoadingEvents(true)
      
      // Fetch from the API
      const response = await fetch('/api/history')
      const data = await response.json()
      
      if (data.success && data.events) {
        // Transform the API response to match our interface
        const transformedEvents: HistoryEvent[] = data.events.map((event: any) => ({
          id: event.id,
          type: event.type,
          title: event.title,
          description: event.description,
          timestamp: new Date(event.timestamp),
          userId: event.userId,
          userName: event.userName,
          metadata: event.metadata || {},
          severity: event.severity
        }))
        
        setEvents(transformedEvents)
      } else {
        console.error('Failed to load history:', data.error)
        // Fallback to sample data if API fails
        setEvents([])
      }
    } catch (error) {
      console.error('Error loading history:', error)
      // Fallback to sample data if API fails
      setEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

  const filterEvents = () => {
    let filtered = events

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      filtered = filtered.filter(event => {
        const eventDate = event.timestamp
        switch (dateFilter) {
          case 'today':
            return eventDate >= today
          case 'yesterday':
            return eventDate >= yesterday && eventDate < today
          case 'this_week':
            return eventDate >= weekStart
          case 'this_month':
            return eventDate >= monthStart
          default:
            return true
        }
      })
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(event => event.severity === severityFilter)
    }

    setFilteredEvents(filtered)
  }

  const groupEventsByDay = (eventsToGroup: HistoryEvent[]) => {
    const groups: Record<string, HistoryEvent[]> = {}
    for (const ev of eventsToGroup) {
      const key = ev.timestamp.toDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push(ev)
    }
    // Ensure stable order: newest day first
    const orderedKeys = Object.keys(groups).sort((a,b)=> new Date(b).getTime() - new Date(a).getTime())
    return { groups, orderedKeys }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workflow_created':
        return <Plus className="w-4 h-4" />
      case 'workflow_edited':
        return <Edit className="w-4 h-4" />
      case 'workflow_deleted':
        return <Trash2 className="w-4 h-4" />
      case 'task_executed':
        return <Play className="w-4 h-4" />
      case 'task_stopped':
        return <Square className="w-4 h-4" />
      case 'task_paused':
        return <Pause className="w-4 h-4" />
      case 'task_resumed':
        return <Play className="w-4 h-4" />
      case 'template_used':
        return <Workflow className="w-4 h-4" />
      case 'settings_changed':
        return <Settings className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workflow_created':
      case 'task_executed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'workflow_edited':
      case 'template_used':
      case 'settings_changed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'workflow_deleted':
      case 'task_stopped':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'task_paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return timestamp.toLocaleDateString()
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="history" onNavigate={(id:string)=>{ router.push(id==='dashboard' ? '/dashboard' : `/${id}`)}} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="History"
          subtitle="Track recent actions and events"
          icon={<Clock className="w-5 h-5 text-white" />}
          showBackButton={false}
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
              <Button
                onClick={loadHistory}
                disabled={loadingEvents}
                variant="outline"
                className="border-gray-200 hover:border-gray-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingEvents ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4">
          <div className="space-y-4">
            
            {/* Filters */}
            <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${density==='compact' ? 'p-3' : 'p-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10 pointer-events-none" />
                      <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Types</option>
                      <option value="workflow_created">Workflow Created</option>
                      <option value="workflow_edited">Workflow Edited</option>
                      <option value="workflow_deleted">Workflow Deleted</option>
                      <option value="task_executed">Task Executed</option>
                      <option value="task_stopped">Task Stopped</option>
                      <option value="task_paused">Task Paused</option>
                      <option value="template_used">Template Used</option>
                      <option value="settings_changed">Settings Changed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="this_week">This Week</option>
                      <option value="this_month">This Month</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
            </div>

            {/* Events List */}
            <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${density==='compact' ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                <Badge className="bg-indigo-100 text-indigo-700">{filteredEvents.length} events</Badge>
              </div>
                {loadingEvents ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Loading history...</p>
                    </div>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                  </div>
                ) : (
                  (() => {
                    const { groups, orderedKeys } = groupEventsByDay(filteredEvents)
                    return (
                      <div className="space-y-6">
                        {orderedKeys.map((dayKey) => (
                          <div key={dayKey} className="space-y-3">
                            <div className="bg-white py-1">
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                {new Date(dayKey).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            {groups[dayKey].map((event) => (
                              <div
                                key={event.id}
                                className={`flex items-start gap-4 ${density==='compact' ? 'p-3' : 'p-4'} border border-gray-200 rounded-lg hover:shadow-sm transition-[box-shadow,transform]`}
                              >
                                <div className="flex-shrink-0">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)} shadow-sm`}>
                                    {getEventIcon(event.type)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <div>
                                      <h3 className="font-medium text-gray-900 leading-tight">{event.title}</h3>
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getSeverityColor(event.severity)} rounded-full px-2.5 py-0.5 text-[11px]` }>
                                        {event.severity}
                                      </Badge>
                                      <span className="text-sm text-gray-500">
                                        {formatTimestamp(event.timestamp)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <span>By {event.userName}</span>
                                      {event.metadata && (
                                        <div className="flex items-center gap-2">
                                          {Object.entries(event.metadata).map(([key, value]) => (
                                            <span key={key} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs">
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-indigo-600 hover:text-indigo-700"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  })()
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
