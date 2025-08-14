'use client'

import React, { useEffect, useRef, useState } from 'react'
import { LucideIcon, RefreshCw } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'purple' | 'orange'
  loading?: boolean
  onRefresh?: () => void
  animate?: boolean
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    value: 'text-blue-900',
    title: 'text-blue-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    value: 'text-green-900',
    title: 'text-green-700'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    value: 'text-purple-900',
    title: 'text-purple-700'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    value: 'text-orange-900',
    title: 'text-orange-700'
  }
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  loading = false,
  onRefresh,
  animate = false
}: StatsCardProps) {
  const colors = colorClasses[color]
  const [animatedValue, setAnimatedValue] = useState<number | null>(null)
  const previousValueRef = useRef<number>(0)

  useEffect(() => {
    if (!animate || loading || typeof value !== 'number') {
      setAnimatedValue(null)
      previousValueRef.current = typeof value === 'number' ? value : 0
      return
    }

    const start = previousValueRef.current || 0
    const end = value
    const durationMs = 800
    const startTime = performance.now()

    let rafId = 0
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setAnimatedValue(current)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        previousValueRef.current = end
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [value, animate, loading])

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${colors.icon}`} />
              <p className={`text-sm font-medium ${colors.title}`}>
                {title}
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className={`p-1 rounded-full transition-colors ${
                  loading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : `${colors.icon} hover:bg-white/50`
                }`}
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${colors.value}`}>
                {animatedValue !== null
                  ? animatedValue.toLocaleString()
                  : typeof value === 'number'
                    ? value.toLocaleString()
                    : value}
              </p>
              
              {trend && (
                <div className="flex items-center space-x-1">
                  <span className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 