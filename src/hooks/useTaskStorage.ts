'use client'

import { useState, useEffect, useCallback } from 'react'

interface TaskStorageData {
  taskId: string
  data: any
  timestamp: number
  status: string
}

export function useTaskStorage() {
  const [storageAvailable, setStorageAvailable] = useState(false)

  // Check if localStorage is available
  useEffect(() => {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      setStorageAvailable(true)
    } catch (e) {
      setStorageAvailable(false)
    }
  }, [])

  const getTaskKey = useCallback((taskId: string, type: string) => {
    return `task_${taskId}_${type}`
  }, [])

  const storeTaskData = useCallback((taskId: string, data: any, type: string = 'details') => {
    if (!storageAvailable) return false

    try {
      const storageData: TaskStorageData = {
        taskId,
        data,
        timestamp: Date.now(),
        status: data.status || 'unknown'
      }
      localStorage.setItem(getTaskKey(taskId, type), JSON.stringify(storageData))
      return true
    } catch (error) {
      console.warn('Failed to store task data:', error)
      return false
    }
  }, [storageAvailable, getTaskKey])

  const getTaskData = useCallback((taskId: string, type: string = 'details', maxAge: number = 30000) => {
    if (!storageAvailable) return null

    try {
      const key = getTaskKey(taskId, type)
      const stored = localStorage.getItem(key)
      
      if (!stored) return null

      const storageData: TaskStorageData = JSON.parse(stored)
      const age = Date.now() - storageData.timestamp

      if (age > maxAge) {
        // Data is too old, remove it
        localStorage.removeItem(key)
        return null
      }

      return storageData.data
    } catch (error) {
      console.warn('Failed to retrieve task data:', error)
      return null
    }
  }, [storageAvailable, getTaskKey])

  const removeTaskData = useCallback((taskId: string, type: string = 'details') => {
    if (!storageAvailable) return

    try {
      localStorage.removeItem(getTaskKey(taskId, type))
    } catch (error) {
      console.warn('Failed to remove task data:', error)
    }
  }, [storageAvailable, getTaskKey])

  const clearAllTaskData = useCallback(() => {
    if (!storageAvailable) return

    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('task_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear task data:', error)
    }
  }, [storageAvailable])

  const getTaskStatus = useCallback((taskId: string) => {
    const data = getTaskData(taskId, 'details', 60000) // 1 minute cache for status
    return data?.status || null
  }, [getTaskData])

  return {
    storageAvailable,
    storeTaskData,
    getTaskData,
    removeTaskData,
    clearAllTaskData,
    getTaskStatus
  }
} 