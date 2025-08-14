import { Workflow } from '@/types/workflow'

// Use localStorage for persistence across server restarts
const STORAGE_KEY = 'buddhidemo_workflows'

// Initialize with sample workflow for testing
const SAMPLE_WORKFLOW: Workflow = {
  id: 'test-workflow-1',
  name: 'Test Email Workflow',
  description: 'A simple test workflow for email automation',
  category: 'automation',
  status: 'active',
  tasks: [
    {
      id: 'task-1',
      name: 'Open Gmail',
      description: 'Navigate to Gmail and sign in',
      taskInstructions: 'Go to gmail.com and sign in with the provided email',
      type: 'navigate',
      order: 1,
      dependencies: [],
      conditions: [],
      retryCount: 0,
      maxRetries: 3,
      timeout: 30,
      variables: {},
      settings: {
        model: 'gpt-4o',
        saveBrowserData: true,
        publicSharing: false,
        viewportWidth: 1280,
        viewportHeight: 960,
        adBlocker: true,
        proxy: true,
        proxyCountry: 'us',
        highlightElements: false,
        maxAgentSteps: 50,
        allowedDomains: ['gmail.com', 'google.com']
      }
    },
    {
      id: 'task-2', 
      name: 'Compose Email',
      description: 'Create and send an email',
      taskInstructions: 'Click on compose button and fill in the recipient email and subject',
      type: 'click',
      order: 2,
      dependencies: ['task-1'],
      conditions: [],
      retryCount: 0,
      maxRetries: 3,
      timeout: 30,
      variables: {},
      settings: {
        model: 'gpt-4o',
        saveBrowserData: true,
        publicSharing: false,
        viewportWidth: 1280,
        viewportHeight: 960,
        adBlocker: true,
        proxy: true,
        proxyCountry: 'us',
        highlightElements: false,
        maxAgentSteps: 50,
        allowedDomains: ['gmail.com', 'google.com']
      }
    }
  ],
  variables: [
    {
      name: 'email',
      type: 'string',
      description: 'Email address to use for login',
      isRequired: true,
      isSecret: false
    },
    {
      name: 'recipient',
      type: 'string', 
      description: 'Recipient email address',
      isRequired: true,
      isSecret: false
    }
  ],
  triggers: [],
  settings: {
    enableLogging: true,
    maxExecutionTime: 3600,
    enableNotifications: false,
    retryOnFailure: true,
    maxRetries: 3,
    // Universal task settings
    model: 'gpt-4o-mini',
    saveBrowserData: true,
    publicSharing: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    adBlocker: true,
    proxy: false,
    proxyCountry: 'none',
    highlightElements: false,
    maxAgentSteps: 15,
    allowedDomains: [],
    browserProfileId: undefined
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user',
  version: 1
}

// Get workflows from localStorage or initialize with sample
function getStoredWorkflows(): Workflow[] {
  if (typeof window === 'undefined') {
    // Server-side: return sample workflow for API routes
    return [SAMPLE_WORKFLOW]
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const workflows = JSON.parse(stored)
      console.log('Loaded workflows from localStorage:', workflows.length)
      return workflows
    } else {
      // Initialize with sample workflow if no stored workflows
      console.log('No stored workflows found, initializing with sample')
      localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_WORKFLOW]))
      return [SAMPLE_WORKFLOW]
    }
  } catch (error) {
    console.error('Error reading workflows from localStorage:', error)
    return [SAMPLE_WORKFLOW]
  }
}

// Save workflows to localStorage
function saveWorkflows(workflows: Workflow[]): void {
  if (typeof window === 'undefined') {
    // Server-side: do nothing
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
    console.log('Saved workflows to localStorage:', workflows.length)
  } catch (error) {
    console.error('Error saving workflows to localStorage:', error)
  }
}

// Initialize workflows array
let workflows: Workflow[] = getStoredWorkflows()

export function addWorkflow(workflow: Workflow): void {
  console.log('Adding workflow:', workflow.id, workflow.name)
  workflows.push(workflow)
  saveWorkflows(workflows)
  console.log('Total workflows in storage:', workflows.length)
}

export function getWorkflows(): Workflow[] {
  console.log('Getting all workflows, count:', workflows.length)
  return workflows
}

export function getWorkflow(id: string): Workflow | undefined {
  console.log('Looking for workflow with ID:', id)
  console.log('Available workflow IDs:', workflows.map(w => w.id))
  const workflow = workflows.find(w => w.id === id)
  console.log('Found workflow:', workflow ? workflow.name : 'NOT FOUND')
  return workflow
}

export function updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
  const index = workflows.findIndex(w => w.id === id)
  if (index === -1) return null
  
  workflows[index] = { ...workflows[index], ...updates, updatedAt: new Date().toISOString() }
  saveWorkflows(workflows)
  return workflows[index]
}

export function deleteWorkflow(id: string): boolean {
  const index = workflows.findIndex(w => w.id === id)
  if (index === -1) return false
  
  workflows.splice(index, 1)
  saveWorkflows(workflows)
  return true
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
} 