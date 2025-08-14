// API service layer for Browser Use API integration

const API_BASE_URL = 'https://api.browser-use.com/api/v1'
const LOCAL_API_BASE = '/api'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface TaskResponse {
  id: string
  task: string
  output: string | null
  status: 'created' | 'running' | 'finished' | 'stopped' | 'paused' | 'failed'
  created_at: string
  steps: TaskStepResponse[]
  live_url: string | null
  finished_at: string | null
  browser_data: object | null
  user_uploaded_files: string[] | null
  output_files: string[] | null
  public_share_url: string | null
  metadata: object | null
}

export interface TaskStepResponse {
  id: string
  step: number
  evaluation_previous_goal: string
  next_goal: string
  url: string
}

export interface TaskListResponse {
  tasks: SimplifiedTaskResponse[]
  total_pages: number
  page: number
  limit: number
  total_count: number
}

export interface SimplifiedTaskResponse {
  id: string
  task: string
  output: string | null
  status: string
  created_at: string
  finished_at: string | null
  live_url: string | null
}

export interface BalanceResponse {
  balance: number
  currency: string
}

export interface UserResponse {
  id: string
  email: string
  name?: string
  account_type: string
}

export interface BrowserProfileResponse {
  profile_id: string
  profile_name: string
  description?: string
  persist: boolean
  ad_blocker: boolean
  proxy: boolean
  proxy_country_code: string
  browser_viewport_width: number
  browser_viewport_height: number
}

export interface ScheduledTaskResponse {
  id: string
  task: string
  save_browser_data: boolean
  structured_output_json?: string
  llm_model: string
  use_adblock: boolean
  use_proxy: boolean
  highlight_elements: boolean
  // Optional recording settings (passed through when supported)
  enable_recordings?: boolean
  recording_quality?: string
  recording_fps?: number
  recording_resolution?: string
  // Advanced fields parity with create
  proxy_country_code?: string
  browser_viewport_width?: number
  browser_viewport_height?: number
  max_agent_steps?: number
  enable_public_share?: boolean
  allowed_domains?: string[]
  included_file_names?: string[]
  secrets?: Record<string, any>
  schedule_type: 'interval' | 'cron'
  interval_minutes?: number
  cron_expression?: string
  start_at: string
  next_run_at: string
  end_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useLocalApi: boolean = true
  ): Promise<T> {
    const baseUrl = useLocalApi ? LOCAL_API_BASE : API_BASE_URL
    const url = `${baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error (${response.status}): ${errorText}`)
      }

      // Normalize empty responses that some endpoints return as empty body or JSON null
      const contentLength = response.headers.get('content-length')
      const contentType = response.headers.get('content-type') || ''

      // Read text once, then decide how to handle
      const rawText = await response.text()
      const trimmed = rawText?.trim() || ''

      if (!trimmed || trimmed === 'null') {
        // Treat empty or JSON null bodies as void
        return undefined as T
      }

      // If JSON, parse it; otherwise return text
      if (contentType.includes('application/json')) {
        try {
          return JSON.parse(trimmed) as T
        } catch {
          // Fallback: return as text if parsing fails
          return trimmed as unknown as T
        }
      }

      return trimmed as unknown as T
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Task Management
  async createTask(taskData: {
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
    structured_output_json?: string
    allowed_domains?: string[]
    browser_profile_id?: string
    secrets?: Record<string, any>
    included_file_names?: string[]
  }): Promise<{ id: string; status: string }> {
    return this.request('/task/start', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async getTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/task/details/${taskId}`)
  }

  async getTasks(page: number = 1, limit: number = 10, filters?: {
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<TaskListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status)
    }
    
    if (filters?.search && filters.search.trim()) {
      params.append('search', filters.search.trim())
    }
    
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder)
    }
    
    return this.request<TaskListResponse>(`/tasks?${params.toString()}`)
  }

  async stopTask(taskId: string): Promise<void> {
    return this.request<void>(`/task/stop/${taskId}`, {
      method: 'PUT'
    })
  }

  async pauseTask(taskId: string): Promise<void> {
    return this.request<void>(`/task/pause/${taskId}`, {
      method: 'PUT'
    })
  }

  async resumeTask(taskId: string): Promise<void> {
    return this.request<void>(`/task/resume/${taskId}`, {
      method: 'PUT'
    })
  }

  // User & Balance
  async getUserInfo(): Promise<UserResponse> {
    return this.request('/user')
  }

  async getBalance(): Promise<BalanceResponse> {
    return this.request('/balance')
  }

  // Browser Profiles
  async getBrowserProfiles(page: number = 1, limit: number = 10): Promise<{
    profiles: BrowserProfileResponse[]
    total_pages: number
    page: number
    limit: number
    total_count: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return this.request(`/browser-profiles?${params.toString()}`)
  }

  async getBrowserProfile(profileId: string): Promise<BrowserProfileResponse> {
    return this.request(`/browser-profiles/${profileId}`)
  }

  async createBrowserProfile(profileData: {
    profile_name: string
    description?: string
    persist?: boolean
    ad_blocker?: boolean
    proxy?: boolean
    proxy_country_code?: string
    browser_viewport_width?: number
    browser_viewport_height?: number
  }): Promise<BrowserProfileResponse> {
    return this.request('/browser-profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    })
  }

  async updateBrowserProfile(
    profileId: string,
    profileData: Partial<{
      profile_name: string
      description: string
      persist: boolean
      ad_blocker: boolean
      proxy: boolean
      proxy_country_code: string
      browser_viewport_width: number
      browser_viewport_height: number
    }>
  ): Promise<BrowserProfileResponse> {
    return this.request(`/browser-profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async deleteBrowserProfile(profileId: string): Promise<void> {
    return this.request(`/browser-profiles/${profileId}`, {
      method: 'DELETE',
    })
  }

  // Scheduled Tasks
  async getScheduledTasks(page: number = 1, limit: number = 10): Promise<{
    tasks: ScheduledTaskResponse[]
    total_pages: number
    page: number
    limit: number
    total_count: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return this.request(`/scheduled-tasks?${params.toString()}`)
  }

  async getScheduledTask(taskId: string): Promise<ScheduledTaskResponse> {
    return this.request(`/scheduled-tasks/${taskId}`)
  }

  async createScheduledTask(taskData: {
    task: string
    schedule_type: 'interval' | 'cron'
    interval_minutes?: number
    cron_expression?: string
    start_at?: string
    end_at?: string
    secrets?: Record<string, any>
    allowed_domains?: string[]
    save_browser_data?: boolean
    structured_output_json?: string
    llm_model?: string
    use_adblock?: boolean
    use_proxy?: boolean
    proxy_country_code?: string
    highlight_elements?: boolean
    included_file_names?: string[]
    browser_viewport_width?: number
    browser_viewport_height?: number
    max_agent_steps?: number
    enable_public_share?: boolean
    metadata?: Record<string, any>
  }): Promise<{ id: string }> {
    return this.request('/scheduled-tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateScheduledTask(
    taskId: string,
    taskData: Partial<{
      task: string
      schedule_type: 'interval' | 'cron'
      interval_minutes: number
      cron_expression: string
      start_at: string
      end_at: string
      is_active: boolean
      use_adblock: boolean
      use_proxy: boolean
      highlight_elements: boolean
      llm_model: string
      save_browser_data: boolean
      structured_output_json: string
      metadata: Record<string, any>
      // advanced parity with create
      allowed_domains: string[]
      included_file_names: string[]
      secrets: Record<string, any>
      proxy_country_code: string
      browser_viewport_width: number
      browser_viewport_height: number
      max_agent_steps: number
      enable_public_share: boolean
      enable_recordings: boolean
      recording_quality: string
      recording_fps: number
      recording_resolution: string
    }>
  ): Promise<ScheduledTaskResponse> {
    return this.request(`/scheduled-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  async deleteScheduledTask(taskId: string): Promise<void> {
    return this.request(`/scheduled-tasks/${taskId}`, {
      method: 'DELETE',
    })
  }

  // File Management
  async getPresignedUrl(fileName: string): Promise<{ url: string; fields: Record<string, string> }> {
    return this.request('/uploads/presigned-url', {
      method: 'POST',
      body: JSON.stringify({ file_name: fileName }),
    })
  }

  async getTaskFile(taskId: string, fileName: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/task/${taskId}/output-file/${fileName}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BROWSER_USE_API_KEY}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get file: ${response.status}`)
    }
    
    return response.blob()
  }

  // Search
  async simpleSearch(query: string): Promise<any> {
    return this.request('/simple-search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  async searchUrl(url: string): Promise<any> {
    return this.request('/search-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    })
  }

  // Health Check
  async ping(): Promise<{ status: string }> {
    return this.request('/ping')
  }

  // Local API wrappers (for backward compatibility)
  async startTaskLocal(userInstructions: string): Promise<{ taskId: string }> {
    return this.request('/task/start', {
      method: 'POST',
      body: JSON.stringify({ userInstructions }),
    })
  }

  async getTaskStatusLocal(taskId: string): Promise<TaskResponse> {
    return this.request(`/task/status/${taskId}`)
  }

  async stopTaskLocal(taskId: string): Promise<{ message: string }> {
    return this.request(`/task/stop/${taskId}`, {
      method: 'POST',
    })
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Utility functions for common operations
export const apiUtils = {
  // Format task status for display
  formatTaskStatus: (status: string): string => {
    // Map status values to more user-friendly display values
    const statusMap: Record<string, string> = {
      'running': 'Running',
      'finished': 'Finished',
      'failed': 'Failed',
      'paused': 'Paused',
      'stopped': 'Stopped',
      'created': 'Created'
    }
    
    return statusMap[status] || (status.charAt(0).toUpperCase() + status.slice(1))
  },

  // Get status color for UI
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'finished':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'stopped':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'created':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  },

  // Calculate task duration
  getTaskDuration: (createdAt: string, finishedAt?: string): string => {
    const start = new Date(createdAt)
    const end = finishedAt ? new Date(finishedAt) : new Date()
    const duration = end.getTime() - start.getTime()
    
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
} 