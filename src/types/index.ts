// Core types for Nizhal AI Automation Platform

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  accountType: 'free' | 'pro'
  apiKey?: string
}

export interface Task {
  id: string
  name: string
  description: string
  status: 'created' | 'running' | 'finished' | 'stopped' | 'paused' | 'failed'
  createdAt: string
  finishedAt?: string
  liveUrl?: string
  output?: string
  steps: TaskStep[]
  creditsUsed: number
  duration?: number
  workflowId?: string
  screenshots?: string[]
  outputFiles?: string[]
}

export interface TaskStep {
  id: string
  step: number
  evaluation_previous_goal: string
  next_goal: string
  url: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  category: 'business' | 'scraping' | 'social' | 'e-commerce' | 'other'
  tags: string[]
  taskInstructions: string
  defaultSettings: WorkflowSettings
  requiredCredentials: CredentialTemplate[]
  usageCount: number
  lastUsed?: string
  createdAt: string
  updatedAt: string
  // AI Generated Workflow properties
  prompt?: string
  steps?: WorkflowStep[]
  status?: 'draft' | 'active' | 'archived'
  createdBy?: string
}

export interface WorkflowStep {
  id: string
  title: string
  description: string
  action: string
  order: number
  isEditable: boolean
}

export interface WorkflowGenerationRequest {
  prompt: string
  model?: string
  temperature?: number
}

export interface WorkflowGenerationResponse {
  workflow: Workflow
  success: boolean
  message?: string
}

export interface WorkflowExecutionRequest {
  workflowId: string
  parameters?: Record<string, any>
}

export interface WorkflowExecutionResponse {
  taskId: string
  success: boolean
  message?: string
}

export interface WorkflowSettings {
  model: string
  saveBrowserData: boolean
  publicSharing: boolean
  viewportWidth: number
  viewportHeight: number
  adBlocker: boolean
  proxy: boolean
  proxyCountry: string
  highlightElements: boolean
  maxAgentSteps: number
  allowedDomains: string[]
  browserProfileId?: string
}

export interface CredentialTemplate {
  id: string
  service: string
  name: string
  description: string
  required: boolean
}

export interface ScheduledTask {
  id: string
  name: string
  description: string
  scheduleType: 'interval' | 'cron'
  intervalMinutes?: number
  cronExpression?: string
  startAt: string
  endAt?: string
  nextRunAt: string
  isActive: boolean
  workflowId?: string
  taskSettings: WorkflowSettings
  createdAt: string
  updatedAt: string
}

export interface BrowserProfile {
  id: string
  name: string
  description: string
  persist: boolean
  adBlocker: boolean
  proxy: boolean
  proxyCountry: string
  viewportWidth: number
  viewportHeight: number
  createdAt: string
  updatedAt: string
}

export interface Credential {
  id: string
  service: string
  name: string
  username?: string
  password?: string
  apiKey?: string
  lastUsed?: string
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  category: 'business' | 'scraping' | 'social' | 'e-commerce'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  taskInstructions: string
  previewImage?: string
}

export interface Stats {
  totalTasks: number
  activeTasks: number
  creditsLeft: number
  successRate: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

// Navigation types
export type NavigationItem = {
  id: string
  label: string
  icon: string
  href: string
  badge?: string
}

// Form types
export interface TaskCreationForm {
  taskInstructions: string
  model: string
  saveBrowserData: boolean
  publicSharing: boolean
  viewportWidth: number
  viewportHeight: number
  adBlocker: boolean
  proxy: boolean
  proxyCountry: string
  highlightElements: boolean
  maxAgentSteps: number
  allowedDomains: string[]
  browserProfileId?: string
  credentials: Record<string, any>
  includedFileNames: string[]
}

export interface WorkflowCreationForm {
  name: string
  description: string
  category: string
  tags: string[]
  taskInstructions: string
  defaultSettings: WorkflowSettings
  requiredCredentials: CredentialTemplate[]
}

// UI State types
export interface UIState {
  sidebarCollapsed: boolean
  currentPage: string
  selectedTask?: string
  selectedWorkflow?: string
  showCreateTaskModal: boolean
  showCreateWorkflowModal: boolean
  showSettingsModal: boolean
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
} 