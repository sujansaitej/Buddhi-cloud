import { NextRequest, NextResponse } from 'next/server'
import { Workflow, WorkflowTask } from '@/types/workflow'
import { getEffectiveTaskSettings, convertSettingsToApiFormat } from '@/lib/workflow-utils'
import HistoryService from '@/lib/history-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, variables, executionSettings } = body

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Validate execution settings
    const validatedExecutionSettings = {
      proxy: Boolean(executionSettings?.proxy || false),
      proxyCountry: executionSettings?.proxyCountry === 'none' ? '' : executionSettings?.proxyCountry || '',
      highlightElements: Boolean(executionSettings?.highlightElements || false)
    }

    // Fetch the workflow from the database
    let workflow: Workflow
    try {
      const workflowResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/workflow/list`)
      const workflowData = await workflowResponse.json()
      
      if (!workflowData.success) {
        throw new Error('Failed to fetch workflows')
      }
      
      workflow = workflowData.workflows.find((w: any) => w.id === workflowId)
      if (!workflow) {
        return NextResponse.json(
          { error: 'Workflow not found' },
          { status: 404 }
        )
      }
    } catch (error) {
      console.error('Error fetching workflow:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workflow' },
        { status: 500 }
      )
    }

    // Combine all workflow tasks into a single comprehensive task
    let combinedTaskInstructions = `Execute the following workflow: "${workflow.name}"\n\n`
    combinedTaskInstructions += `Workflow Description: ${workflow.description}\n\n`
    
    // Add variables section if variables are provided
    if (variables && Object.keys(variables).length > 0) {
      combinedTaskInstructions += `WORKFLOW VARIABLES:\n`
      Object.entries(variables).forEach(([key, value]) => {
        // Pass actual values without masking
        combinedTaskInstructions += `- ${key}: ${String(value)}\n`
      })
      combinedTaskInstructions += `\n`
    }
    
    combinedTaskInstructions += `Instructions:\n`
    
    // Sort tasks by order to ensure proper execution sequence
    const sortedTasks = [...workflow.tasks].sort((a, b) => a.order - b.order)
    
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i]
      
      // Replace variables in task instructions
      let taskInstructions = task.taskInstructions
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
          taskInstructions = taskInstructions.replace(regex, String(value))
        })
      }
      
      combinedTaskInstructions += `${i + 1}. ${task.name}: ${taskInstructions}\n\n`
    }
    
    // Minimal error handling guidance and variable usage notes
    combinedTaskInstructions += `If any error occurs, handle it gracefully.\n`
    if (variables && Object.keys(variables).length > 0) {
      combinedTaskInstructions += `- Use the provided workflow variables in the steps above\n`
      //combinedTaskInstructions += `- Variables have been automatically substituted in the instructions\n`
    }
    
    // Get effective settings from the first task (or use workflow defaults)
    const firstTask = sortedTasks[0]
    const effectiveSettings = firstTask ? 
      getEffectiveTaskSettings(workflow.settings, firstTask.settings) : 
      workflow.settings
    
    // Apply execution-time overrides
    const finalSettings = {
      ...effectiveSettings,
      ...validatedExecutionSettings
    }

    // Convert settings to API format and create the single comprehensive task
    const apiSettings = convertSettingsToApiFormat(finalSettings)
    
    try {
      const taskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/task/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: combinedTaskInstructions,
          ...apiSettings
        })
      })

      const taskData = await taskResponse.json()
      
      if (taskData.id) {
        // Create a single task result representing the entire workflow
        const taskResults = [{
          taskId: taskData.id,
          taskName: workflow.name,
          status: 'started',
          workflowSteps: sortedTasks.length
        }]
        
        console.log('Workflow Execution Request:', {
          workflowId,
          workflowName: workflow.name,
          variables: variables, // Pass actual values without masking
          executionSettings: validatedExecutionSettings,
          taskResults,
          totalTasks: sortedTasks.length,
          successfulTasks: 1,
          combinedTaskId: taskData.id
        })

        // Log history event for task execution
        try {
          await HistoryService.logTaskExecuted(
            taskData.id,
            workflow.name,
            'user',
            'System',
            { workflowId }
          )
        } catch (e) {
          console.warn('Failed to log task execution history event:', e)
        }

        return NextResponse.json({
          success: true,
          taskId: taskData.id,
          message: `Workflow "${workflow.name}" execution started successfully with ${sortedTasks.length} steps.`,
          executionSettings: validatedExecutionSettings,
          taskResults,
          workflowName: workflow.name,
          totalSteps: sortedTasks.length
        })
      } else {
        return NextResponse.json({
          success: false,
          error: taskData.error || 'Failed to start workflow execution',
          message: 'Workflow execution failed to start',
          details: taskData
        }, { status: 500 })
      }
    } catch (error) {
      console.error('Error executing workflow:', error)
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Workflow execution failed'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Workflow execution error:', error)
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
} 