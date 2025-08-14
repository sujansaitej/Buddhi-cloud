'use client'

import React, { useEffect, useState } from 'react'
import { Target } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AutomationPerfItem {
  automationId: string
  name: string
  successRate: number
  avgDuration: number
  lastRun: string
  status: 'running' | 'success' | 'failed' | 'paused'
  runsToday: number
}

interface AutomationPerformanceProps {
  className?: string
  limit?: number
  bare?: boolean // when true, render without outer Card/title
}

export default function AutomationPerformance({ className, limit = 12, bare = false }: AutomationPerformanceProps) {
  const [items, setItems] = useState<AutomationPerfItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setError(null)
      const res = await fetch(`/api/health/automations`, { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setItems((data.automations || []).slice(0, limit))
      } else {
        setError('Failed to load automation performance')
      }
    } catch (err) {
      console.error('Error loading automation performance:', err)
      setError('Failed to load automation performance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const content = (
    <>
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No automation performance data</div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((automation) => (
            <div key={automation.automationId} className="border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{automation.name}</h4>
                <Badge className={getStatusColor(automation.status)}>
                  {automation.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Success Rate</span>
                  <div className="font-medium">{automation.successRate}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Avg Duration</span>
                  <div className="font-medium">{automation.avgDuration}m</div>
                </div>
                <div>
                  <span className="text-gray-500">Runs</span>
                  <div className="font-medium">{automation.runsToday}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Last run: {formatTimeAgo(automation.lastRun)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )

  if (bare) {
    return <div className={className}>{content}</div>
  }

  return (
    <Card className={`px-2 sm:px-3 md:px-4 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Target className="w-5 h-5 mr-2 text-indigo-500" />
          Automation Performance
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}


