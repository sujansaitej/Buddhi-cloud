'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiService, apiUtils } from '@/lib/api'
import { TaskResponse, BalanceResponse, UserResponse, BrowserProfileResponse, ScheduledTaskResponse } from '@/lib/api'

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  useEffect(() => {
    execute()
  }, dependencies)

  return { data, loading, error, refetch: execute }
}

// Hook for user information
export function useUser() {
  return useApiCall(() => apiService.getUserInfo(), [])
}

// Hook for balance information
export function useBalance() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const balanceData = useApiCall(() => apiService.getBalance(), [refreshTrigger])
  
  const refreshBalance = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])
  
  return {
    ...balanceData,
    refreshBalance
  }
}

// Hook for tasks list with filtering
export function useTasks(page: number = 1, limit: number = 10, filters?: {
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useApiCall(
    () => apiService.getTasks(page, limit, filters),
    [page, limit, filters?.status, filters?.search, filters?.sortBy, filters?.sortOrder]
  )
}

// Hook for single task
export function useTask(taskId: string | null) {
  return useApiCall(
    () => taskId ? apiService.getTask(taskId) : Promise.reject(new Error('No task ID')),
    [taskId]
  )
}

// Hook for browser profiles
export function useBrowserProfiles() {
  return useApiCall(() => apiService.getBrowserProfiles(), [])
}

// Hook for scheduled tasks
export function useScheduledTasks() {
  return useApiCall(() => apiService.getScheduledTasks(), [])
}

// Hook for task management actions
export function useTaskActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTask = useCallback(async (taskData: {
    task: string
    save_browser_data?: boolean
    llm_model?: string
    use_adblock?: boolean
    use_proxy?: boolean
    proxy_country_code?: string
    highlight_elements?: boolean
    browser_viewport_width?: number
    browser_viewport_height?: number
    max_agent_steps?: number
    enable_public_share?: boolean
    enable_recordings?: boolean
    enable_screenshots?: boolean
    structured_output_json?: string
    allowed_domains?: string[]
    browser_profile_id?: string
    secrets?: Record<string, any>
    included_file_names?: string[]
  }) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.createTask(taskData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const stopTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.stopTask(taskId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const pauseTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.pauseTask(taskId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resumeTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.resumeTask(taskId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createTask,
    stopTask,
    pauseTask,
    resumeTask,
    loading,
    error,
    setActionLoading: setLoading
  }
}

// Hook for task updates with manual refresh and optional polling
export function useTaskUpdates(taskId: string | null, enablePolling: boolean = false, interval: number = 10000) {
  const [task, setTask] = useState<TaskResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastStatus, setLastStatus] = useState<string | null>(null)

  // Browser storage keys
  const getStorageKey = (suffix: string) => `task_${taskId}_${suffix}`

  const fetchTaskStatus = useCallback(async (): Promise<string> => {
    if (!taskId) {
      throw new Error('No task ID provided')
    }

    try {
      const response = await fetch(`/api/task/status/${taskId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch task status: ${response.status}`)
      }
      // Status API returns just the status string, not JSON
      const status = await response.text()
      return status.trim()
    } catch (err) {
      console.error('Error fetching task status:', err)
      throw err
    }
  }, [taskId])

  const fetchTaskDetails = useCallback(async () => {
    if (!taskId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/task/details/${taskId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch task details: ${response.status}`)
      }
      const result = await response.json()
      setTask(result)
      setError(null)
      
      // Store in browser storage
      try {
        localStorage.setItem(getStorageKey('details'), JSON.stringify(result))
        localStorage.setItem(getStorageKey('lastUpdate'), Date.now().toString())
      } catch (storageError) {
        console.warn('Failed to store task data in localStorage:', storageError)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task details')
    } finally {
      setLoading(false)
    }
  }, [taskId])

  // Load cached task data on mount
  useEffect(() => {
    if (!taskId) {
      setTask(null)
      setError(null)
      setLastStatus(null)
      return
    }

    // Try to load from browser storage first
    try {
      const cachedData = localStorage.getItem(getStorageKey('details'))
      const lastUpdate = localStorage.getItem(getStorageKey('lastUpdate'))
      
      if (cachedData && lastUpdate) {
        const parsedData = JSON.parse(cachedData)
        const cacheAge = Date.now() - parseInt(lastUpdate)
        
        // Use cached data if it's less than 30 seconds old
        if (cacheAge < 30000) {
          // console.log(`Using cached task data for ${taskId} (age: ${cacheAge}ms)`)
          setTask(parsedData)
          setLastStatus(parsedData.status)
          
          // Only fetch fresh data if task is still active
          if (parsedData.status === 'running' || parsedData.status === 'paused') {
            fetchTaskDetails()
          } else if (parsedData.status === 'finished' || parsedData.status === 'failed' || parsedData.status === 'stopped') {
            // For completed tasks, don't start polling
            // console.log(`Task ${taskId} is ${parsedData.status}, not starting polling`)
            return
          }
          return
        }
      }
    } catch (storageError) {
      console.warn('Failed to load cached task data:', storageError)
    }

    // No cache or cache expired, fetch fresh data
    fetchTaskDetails()
  }, [taskId, fetchTaskDetails])

  useEffect(() => {
    if (!taskId || !enablePolling) return

    // Set up optimized polling only if enabled
    const intervalId = setInterval(async () => {
      try {
        const currentStatus = await fetchTaskStatus()
        
        // Only update if status changed
        if (currentStatus !== lastStatus) {
          // console.log(`Task ${taskId} status changed: ${lastStatus} -> ${currentStatus}`)
          setLastStatus(currentStatus)
          
          // Fetch full details only if status changed or task is active
          if (currentStatus === 'running' || currentStatus === 'paused') {
            await fetchTaskDetails()
          } else if (currentStatus === 'finished' || currentStatus === 'failed' || currentStatus === 'stopped') {
            // For finished tasks, fetch details once more to get final state
            await fetchTaskDetails()
            // Stop polling for finished tasks
            clearInterval(intervalId)
          }
        }
        
        // Stop polling if task is finished, failed, or stopped
        if (currentStatus === 'finished' || currentStatus === 'failed' || currentStatus === 'stopped') {
          // console.log(`Task ${taskId} is ${currentStatus}, stopping polling`)
          clearInterval(intervalId)
          return // Exit early to prevent further processing
        }
      } catch (err) {
        console.error('Error in polling:', err)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [taskId, enablePolling, fetchTaskStatus, fetchTaskDetails, lastStatus, interval])

  // Cleanup function to remove stored data when component unmounts
  useEffect(() => {
    return () => {
      if (taskId) {
        try {
          localStorage.removeItem(getStorageKey('details'))
          localStorage.removeItem(getStorageKey('lastUpdate'))
        } catch (storageError) {
          console.warn('Failed to cleanup stored task data:', storageError)
        }
      }
    }
  }, [taskId])

  return { task, loading, error, refetch: fetchTaskDetails }
}

// Hook for browser profile management
export function useBrowserProfileActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProfile = useCallback(async (profileData: {
    name: string
    description?: string
    persist: boolean
    ad_blocker: boolean
    proxy: boolean
    proxy_country_code: string
    browser_viewport_width: number
    browser_viewport_height: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.createBrowserProfile(profileData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (profileId: string, profileData: Partial<BrowserProfileResponse>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.updateBrowserProfile(profileId, profileData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProfile = useCallback(async (profileId: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiService.deleteBrowserProfile(profileId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createProfile,
    updateProfile,
    deleteProfile,
    loading,
    error
  }
}

// Hook for scheduled task management
export function useScheduledTaskActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createScheduledTask = useCallback(async (taskData: {
    name: string
    description?: string
    schedule_type: 'interval' | 'cron'
    interval_minutes?: number
    cron_expression?: string
    start_at: string
    end_at?: string
    task: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.createScheduledTask(taskData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create scheduled task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateScheduledTask = useCallback(async (taskId: string, taskData: Partial<ScheduledTaskResponse>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.updateScheduledTask(taskId, taskData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update scheduled task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteScheduledTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiService.deleteScheduledTask(taskId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete scheduled task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createScheduledTask,
    updateScheduledTask,
    deleteScheduledTask,
    loading,
    error
  }
}

// Export utility functions
export { apiUtils } 