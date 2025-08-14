import { NextRequest, NextResponse } from 'next/server'
import { Workflow } from '@/types/workflow'
import { addWorkflow, generateId, getWorkflows } from '@/lib/workflow-storage-mongo'
import { normalizeWorkflowSettings } from '@/lib/workflow-utils'
import HistoryService from '@/lib/history-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating workflow with body:', JSON.stringify(body, null, 2))
    
    const { id: providedId, name, description, category, tasks, variables, settings } = body

    if (!name || !description || !category) {
      console.log('Missing required fields:', { name, description, category })
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      )
    }

    // Validate task types
    if (tasks && Array.isArray(tasks)) {
      const validTaskTypes = ['navigate', 'click', 'type', 'extract', 'wait', 'condition', 'loop', 'api-call', 'file-upload', 'file-download', 'screenshot', 'custom']
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        if (!validTaskTypes.includes(task.type)) {
          console.log(`Invalid task type at index ${i}:`, task.type)
          return NextResponse.json(
            { error: `Invalid task type "${task.type}" at task ${i + 1}. Valid types are: ${validTaskTypes.join(', ')}` },
            { status: 400 }
          )
        }
      }
    }

    // Validate variable types
    if (variables && Array.isArray(variables)) {
      const validVariableTypes = ['string', 'number', 'boolean', 'array', 'object']
      for (let i = 0; i < variables.length; i++) {
        const variable = variables[i]
        if (!validVariableTypes.includes(variable.type)) {
          console.log(`Invalid variable type at index ${i}:`, variable.type)
          return NextResponse.json(
            { error: `Invalid variable type "${variable.type}" at variable ${i + 1}. Valid types are: ${validVariableTypes.join(', ')}` },
            { status: 400 }
          )
        }
      }
    }

    const workflow: Workflow = {
      id: providedId || generateId(),
      name,
      description,
      category: category as any,
      status: 'active',
      tasks: tasks || [],
      variables: variables || [],
      triggers: [],
      settings: normalizeWorkflowSettings(settings || {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user',
      version: 1
    }

    console.log('Generated workflow:', JSON.stringify(workflow, null, 2))
    await addWorkflow(workflow)
    console.log('Workflow added successfully')

    // Log history event for workflow creation
    try {
      await HistoryService.logWorkflowCreated(
        workflow.id,
        workflow.name,
        'user',
        'System'
      )
    } catch (e) {
      console.warn('Failed to log workflow creation history event:', e)
    }

    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow created successfully'
    })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create workflow',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const workflows = await getWorkflows()
    return NextResponse.json({
      success: true,
      workflows,
      total: workflows.length
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch workflows',
        success: false 
      },
      { status: 500 }
    )
  }
} 