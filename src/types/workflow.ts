// New Workflow System Types

export interface Workflow {
  id: string
  name: string
  description: string
  category: 'automation' | 'data-extraction' | 'form-filling' | 'monitoring' | 'testing' | 'social-media' | 'e-commerce'
  status: 'draft' | 'active' | 'archived'
  tasks: WorkflowTask[]
  variables: WorkflowVariable[]
  triggers: WorkflowTrigger[]
  settings: WorkflowSettings
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

export interface WorkflowTask {
  id: string
  name: string
  description: string
  type: TaskType
  taskInstructions: string
  settings: TaskSettings
  dependencies: string[] // IDs of tasks that must complete first
  conditions: TaskCondition[]
  order: number
  retryCount: number
  maxRetries: number
  timeout: number
  variables: Record<string, any>
}

export type TaskType = 
  | 'navigate'
  | 'click'
  | 'type'
  | 'extract'
  | 'wait'
  | 'condition'
  | 'loop'
  | 'api-call'
  | 'file-upload'
  | 'file-download'
  | 'screenshot'
  | 'custom'

export interface TaskSettings {
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

export interface TaskCondition {
  type: 'if' | 'while' | 'for'
  condition: string // e.g., "{{variable}} == 'success'"
  trueTasks: string[] // Task IDs to execute if true
  falseTasks?: string[] // Task IDs to execute if false
  maxIterations?: number // For loops
}

export interface WorkflowVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  defaultValue?: any
  description: string
  isRequired: boolean
  isSecret: boolean
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event'
  config: Record<string, any>
  isActive: boolean
}

export interface WorkflowSettings {
  enableLogging: boolean
  maxExecutionTime: number
  enableNotifications: boolean
  notificationEmail?: string
  retryOnFailure: boolean
  maxRetries: number
  // Universal settings for all tasks in the workflow
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

// Workflow Execution Types
export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled'
  currentTaskId?: string
  completedTasks: string[]
  failedTasks: string[]
  variables: Record<string, any>
  startedAt: string
  completedAt?: string
  browserUseTaskIds: string[] // Track individual Browser Use tasks
  logs: ExecutionLog[]
  error?: string
}

export interface ExecutionLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  taskId?: string
  data?: any
}

// Template Types
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tasks: WorkflowTask[]
  variables: WorkflowVariable[]
  previewImage?: string
  estimatedTime: number
  tags: string[]
  author: string
  version: string
}

// API Request/Response Types
export interface CreateWorkflowRequest {
  name: string
  description: string
  category: string
  tasks: WorkflowTask[]
  variables: WorkflowVariable[]
  settings: WorkflowSettings
}

export interface UpdateWorkflowRequest {
  id: string
  name?: string
  description?: string
  category?: string
  tasks?: WorkflowTask[]
  variables?: WorkflowVariable[]
  settings?: WorkflowSettings
  status?: string
}

export interface ExecuteWorkflowRequest {
  workflowId: string
  variables?: Record<string, any>
  triggerType?: 'manual' | 'schedule' | 'webhook'
}

export interface ExecuteWorkflowResponse {
  executionId: string
  taskId?: string // Add taskId for frontend compatibility
  success: boolean
  message: string
  estimatedDuration?: number
}

// Task Template Types
export interface TaskTemplate {
  type: TaskType
  name: string
  description: string
  template: string
  variables: string[]
  icon: string
  category: string
  examples: TaskExample[]
}

export interface TaskExample {
  name: string
  description: string
  template: string
  variables: Record<string, any>
}

// Predefined Task Templates
export const TASK_TEMPLATES: Record<TaskType, TaskTemplate> = {
  navigate: {
    type: 'navigate',
    name: "Navigate to URL",
    description: "Go to a specific website",
    template: "Navigate to {{url}} and wait for page to load completely",
    variables: ["url"],
    icon: "Globe",
    category: "Navigation",
    examples: [
      {
        name: "Go to Google",
        description: "Navigate to Google homepage",
        template: "Navigate to https://google.com and wait for page to load",
        variables: { url: "https://google.com" }
      }
    ]
  },
  click: {
    type: 'click',
    name: "Click Element",
    description: "Click on a specific element",
    template: "Click on {{selector}} and wait for {{waitFor}}",
    variables: ["selector", "waitFor"],
    icon: "MousePointer",
    category: "Interaction",
    examples: [
      {
        name: "Click Login Button",
        description: "Click the login button",
        template: "Click on the login button and wait for the login form to appear",
        variables: { selector: "login button", waitFor: "login form" }
      }
    ]
  },
  type: {
    type: 'type',
    name: "Type Text",
    description: "Enter text into a field",
    template: "Type {{text}} into {{selector}}",
    variables: ["text", "selector"],
    icon: "Type",
    category: "Interaction",
    examples: [
      {
        name: "Enter Username",
        description: "Type username into login field",
        template: "Type the username into the username field",
        variables: { text: "{{username}}", selector: "username field" }
      }
    ]
  },
  extract: {
    type: 'extract',
    name: "Extract Data",
    description: "Extract information from the page",
    template: "Extract {{dataType}} from {{selector}} and save as {{variable}}",
    variables: ["dataType", "selector", "variable"],
    icon: "Database",
    category: "Data",
    examples: [
      {
        name: "Extract Product Price",
        description: "Extract price from product page",
        template: "Extract the price from the price element and save as productPrice",
        variables: { dataType: "price", selector: "price element", variable: "productPrice" }
      }
    ]
  },
  wait: {
    type: 'wait',
    name: "Wait",
    description: "Wait for a specific condition or time",
    template: "Wait for {{condition}} or {{timeout}} seconds",
    variables: ["condition", "timeout"],
    icon: "Clock",
    category: "Control",
    examples: [
      {
        name: "Wait for Page Load",
        description: "Wait for page to fully load",
        template: "Wait for the page to fully load or 10 seconds",
        variables: { condition: "page load", timeout: 10 }
      }
    ]
  },
  condition: {
    type: 'condition',
    name: "Conditional Logic",
    description: "Execute tasks based on conditions",
    template: "If {{condition}} then {{action}} else {{elseAction}}",
    variables: ["condition", "action", "elseAction"],
    icon: "GitBranch",
    category: "Control",
    examples: [
      {
        name: "Check Login Status",
        description: "Check if user is logged in",
        template: "If user is logged in then proceed to dashboard else show login form",
        variables: { condition: "user logged in", action: "proceed to dashboard", elseAction: "show login form" }
      }
    ]
  },
  loop: {
    type: 'loop',
    name: "Loop",
    description: "Repeat tasks multiple times",
    template: "Loop through {{items}} and {{action}} for each item",
    variables: ["items", "action"],
    icon: "Repeat",
    category: "Control",
    examples: [
      {
        name: "Process List Items",
        description: "Loop through a list of items",
        template: "Loop through the product list and extract price for each product",
        variables: { items: "product list", action: "extract price" }
      }
    ]
  },
  'api-call': {
    type: 'api-call',
    name: "API Call",
    description: "Make an API request",
    template: "Make {{method}} request to {{url}} with {{data}}",
    variables: ["method", "url", "data"],
    icon: "Globe",
    category: "Integration",
    examples: [
      {
        name: "Get User Data",
        description: "Fetch user data from API",
        template: "Make GET request to /api/users with user ID",
        variables: { method: "GET", url: "/api/users", data: "user ID" }
      }
    ]
  },
  'file-upload': {
    type: 'file-upload',
    name: "File Upload",
    description: "Upload a file",
    template: "Upload {{file}} to {{selector}}",
    variables: ["file", "selector"],
    icon: "Upload",
    category: "Files",
    examples: [
      {
        name: "Upload Document",
        description: "Upload a document to a form",
        template: "Upload the document file to the file upload field",
        variables: { file: "document", selector: "file upload field" }
      }
    ]
  },
  'file-download': {
    type: 'file-download',
    name: "File Download",
    description: "Download a file",
    template: "Download {{file}} from {{selector}}",
    variables: ["file", "selector"],
    icon: "Download",
    category: "Files",
    examples: [
      {
        name: "Download Report",
        description: "Download a report file",
        template: "Download the report file from the download link",
        variables: { file: "report", selector: "download link" }
      }
    ]
  },
  screenshot: {
    type: 'screenshot',
    name: "Take Screenshot",
    description: "Capture a screenshot",
    template: "Take screenshot of {{area}} and save as {{filename}}",
    variables: ["area", "filename"],
    icon: "Camera",
    category: "Media",
    examples: [
      {
        name: "Capture Page",
        description: "Take screenshot of entire page",
        template: "Take screenshot of the entire page and save as page_screenshot.png",
        variables: { area: "entire page", filename: "page_screenshot.png" }
      }
    ]
  },
  custom: {
    type: 'custom',
    name: "Custom Task",
    description: "Custom automation task",
    template: "{{customInstructions}}",
    variables: ["customInstructions"],
    icon: "Code",
    category: "Custom",
    examples: [
      {
        name: "Custom Automation",
        description: "Custom automation instructions",
        template: "Execute custom automation instructions",
        variables: { customInstructions: "Custom automation instructions" }
      }
    ]
  }
} 