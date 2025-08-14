import { Workflow } from '@/types/workflow'
import dbConnect from './database'
import { WorkflowModel } from '@/models/Workflow'

// Sample workflow for initialization
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

// Initialize database with sample workflow if empty
async function initializeDatabase() {
  try {
    await dbConnect()
    const count = await WorkflowModel.countDocuments()
    
    if (count === 0) {
      console.log('Database is empty, initializing with sample workflow...')
      await WorkflowModel.create(SAMPLE_WORKFLOW)
      console.log('Sample workflow created successfully')
    } else {
      console.log(`Database has ${count} workflows`)
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// Initialize on module load (opt-in via env to avoid unexpected sample data in prod)
if (process.env.SEED_SAMPLE_WORKFLOW === 'true') {
  initializeDatabase()
}

export async function addWorkflow(workflow: Workflow): Promise<void> {
  try {
    await dbConnect()
    console.log('Adding workflow to MongoDB:', workflow.id, workflow.name)
    
    await WorkflowModel.create(workflow)
    console.log('Workflow added successfully to MongoDB')
  } catch (error) {
    console.error('Error adding workflow to MongoDB:', error)
    throw error
  }
}

export async function getWorkflows(): Promise<Workflow[]> {
  try {
    await dbConnect()
    console.log('Fetching workflows from MongoDB...')
    
    const workflows = await WorkflowModel.find({}).sort({ createdAt: -1 }).lean()
    console.log(`Found ${workflows.length} workflows in MongoDB`)
    
    return workflows as unknown as Workflow[]
  } catch (error) {
    console.error('Error fetching workflows from MongoDB:', error)
    throw error
  }
}

export async function getWorkflow(id: string): Promise<Workflow | undefined> {
  try {
    await dbConnect()
    console.log('Looking for workflow in MongoDB with ID:', id)
    
    const workflow = await WorkflowModel.findOne({ id }).lean()
    console.log('Found workflow:', workflow ? (workflow as any).name : 'NOT FOUND')
    
    return (workflow as unknown as Workflow) || undefined
  } catch (error) {
    console.error('Error fetching workflow from MongoDB:', error)
    throw error
  }
}

export async function updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
  try {
    await dbConnect()
    console.log('Updating workflow in MongoDB with ID:', id)
    
    const workflow = await WorkflowModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    
    return (workflow as unknown as Workflow) || null
  } catch (error) {
    console.error('Error updating workflow in MongoDB:', error)
    throw error
  }
}

export async function deleteWorkflow(id: string): Promise<boolean> {
  try {
    await dbConnect()
    console.log('Deleting workflow from MongoDB with ID:', id)
    
    const result = await WorkflowModel.deleteOne({ id })
    console.log('Delete result:', result.deletedCount > 0 ? 'SUCCESS' : 'NOT FOUND')
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting workflow from MongoDB:', error)
    throw error
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
} 