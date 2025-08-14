'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, Activity } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AlertItem {
  id: string
  type: 'failure' | 'performance' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  automationId?: string
  automationName?: string
}

interface RecentAlertsProps {
  className?: string
  limit?: number
  bare?: boolean // when true, render without outer Card/title
}

export default function RecentAlerts({ className, limit = 10, bare = false }: RecentAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAlerts = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/health/alerts?limit=${limit}`, { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setAlerts(data.alerts || [])
      } else {
        setError('Failed to load alerts')
      }
    } catch (err) {
      console.error('Failed to load alerts:', err)
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
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
      ) : alerts.length === 0 ? (
        <div className="text-sm text-gray-500 flex items-center"><Activity className="w-4 h-4 mr-2"/>No recent alerts</div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto scrollbar-none pr-1">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-2xl p-4 ${getAlertColor(alert.severity)} border-opacity-40` }>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{alert.title}</h4>
                <Badge variant="outline" className="text-xs">{alert.severity}</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{alert.automationName || 'System'}</span>
                <span>{formatTimeAgo(alert.timestamp)}</span>
              </div>
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
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}


