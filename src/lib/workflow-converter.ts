import { Workflow, WorkflowTask } from '@/types/workflow'

export class WorkflowConverter {
  static convertToTask(workflow: Workflow, variables: Record<string, any>): string {
    const steps = workflow.tasks.sort((a, b) => a.order - b.order)
    
    let taskInstruction = `You are an AI agent that will execute a multi-step workflow. Follow these steps exactly and complete the entire workflow:\n\n`
    
    // Add workflow context
    taskInstruction += `WORKFLOW: ${workflow.name}\n`
    taskInstruction += `DESCRIPTION: ${workflow.description}\n`
    taskInstruction += `TOTAL STEPS: ${steps.length}\n\n`
    
    // Add each step with more detailed instructions
    steps.forEach((step, index) => {
      taskInstruction += `STEP ${index + 1}: ${step.name}\n`
      taskInstruction += `Description: ${step.description}\n`
      taskInstruction += `Instructions: ${step.taskInstructions}\n`
      taskInstruction += `Type: ${step.type}\n`
      if (step.dependencies && step.dependencies.length > 0) {
        taskInstruction += `Dependencies: ${step.dependencies.join(', ')}\n`
      }
      taskInstruction += `\n`
    })
    
    // Add variable substitution
    taskInstruction += `VARIABLES TO USE:\n`
    Object.entries(variables).forEach(([key, value]) => {
      taskInstruction += `- ${key}: ${value}\n`
      // Also replace placeholders in the instruction
      taskInstruction = taskInstruction.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
    taskInstruction += `\n`
    
    // Add execution requirements
    taskInstruction += `EXECUTION REQUIREMENTS:\n`
    taskInstruction += `1. Execute ALL steps in order\n`
    taskInstruction += `2. Wait for each step to complete before moving to the next\n`
    taskInstruction += `3. If a step fails, try again up to 3 times\n`
    taskInstruction += `4. Complete the entire workflow - do not stop early\n`
    taskInstruction += `5. Provide detailed status for each step\n\n`
    
    // Add structured output requirement
    taskInstruction += `Return a structured response with the status of each step completed.`
    
    return taskInstruction
  }

  static getStructuredOutputSchema() {
    return {
      type: 'object',
      properties: {
        workflow_status: { 
          type: 'string',
          enum: ['completed', 'failed', 'in_progress']
        },
        completed_steps: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              step_number: { type: 'number' },
              step_name: { type: 'string' },
              status: { 
                type: 'string',
                enum: ['completed', 'failed', 'skipped']
              },
              result: { type: 'string' },
              duration: { type: 'number' }
            }
          }
        },
        final_result: { type: 'string' },
        errors: { 
          type: 'array',
          items: { type: 'string' }
        },
        total_steps: { type: 'number' },
        completed_count: { type: 'number' }
      },
      required: ['workflow_status', 'completed_steps', 'final_result']
    }
  }

  static calculateMaxSteps(workflow: Workflow): number {
    // Calculate max steps based on number of workflow steps
    const baseSteps = workflow.tasks.length * 15 // 15 steps per workflow task for more time
    return Math.min(Math.max(baseSteps, 100), 300) // Between 100 and 300 steps
  }

  static getAllowedDomains(workflow: Workflow): string[] {
    const domains = new Set<string>()
    
    workflow.tasks.forEach(task => {
      if (task.settings?.allowedDomains) {
        task.settings.allowedDomains.forEach(domain => domains.add(domain))
      }
    })
    
    // Add common domains if none specified
    if (domains.size === 0) {
      domains.add('gmail.com')
      domains.add('google.com')
      domains.add('example.com')
    }
    
    return Array.from(domains)
  }

  static getDefaultModel(workflow: Workflow): string {
    // Get model from first task's settings, or default to gpt-4o
    const firstTask = workflow.tasks[0]
    return firstTask?.settings?.model || 'gpt-4o'
  }

  static getTaskSettings(workflow: Workflow) {
    const firstTask = workflow.tasks[0]
    return {
      use_adblock: firstTask?.settings?.adBlocker ?? true,
      use_proxy: firstTask?.settings?.proxy ?? true,
      proxy_country_code: firstTask?.settings?.proxyCountry || 'us',
      highlight_elements: firstTask?.settings?.highlightElements ?? false,
      browser_viewport_width: firstTask?.settings?.viewportWidth || 1280,
      browser_viewport_height: firstTask?.settings?.viewportHeight || 960,
      save_browser_data: firstTask?.settings?.saveBrowserData ?? true,
      enable_public_share: firstTask?.settings?.publicSharing ?? false,
      // Add settings to prevent early stopping
      enable_recordings: true,
      enable_screenshots: true,
      max_agent_steps: this.calculateMaxSteps(workflow)
    }
  }
} 