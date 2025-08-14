import { NextRequest, NextResponse } from 'next/server'
import { Workflow } from '@/types/workflow'
import { getEffectiveTaskSettings, convertSettingsToApiFormat } from '@/lib/workflow-utils'

// Helper to fetch a workflow by ID using existing list API
async function fetchWorkflowById(workflowId: string): Promise<Workflow | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const workflowResponse = await fetch(`${baseUrl}/api/workflow/list`, { cache: 'no-store' })
  const workflowData = await workflowResponse.json()
  if (!workflowData?.success) throw new Error('Failed to fetch workflows')
  return (workflowData.workflows as Workflow[]).find((w) => w.id === workflowId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      workflowId,
      variables,
      executionSettings,
      // schedule fields
      schedule_type,
      interval_minutes,
      cron_expression,
      start_at,
      end_at,
      // optional advanced pass-throughs (these will be filtered by scheduled-tasks endpoint)
      llm_model,
      use_adblock,
      use_proxy,
      proxy_country_code,
      highlight_elements,
      save_browser_data,
      browser_viewport_width,
      browser_viewport_height,
      max_agent_steps,
      enable_public_share,
      allowed_domains,
      included_file_names,
      secrets,
      // recording
      enable_recordings,
      recording_quality,
      recording_fps,
      recording_resolution,
      browser_profile_id,
    } = body || {}

    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
    }

    if (!schedule_type || (schedule_type !== 'interval' && schedule_type !== 'cron')) {
      return NextResponse.json({ error: 'schedule_type must be interval or cron' }, { status: 400 })
    }
    if (schedule_type === 'interval' && (!interval_minutes || Number(interval_minutes) < 1)) {
      return NextResponse.json({ error: 'interval_minutes must be >= 1 for interval schedules' }, { status: 400 })
    }
    if (schedule_type === 'cron' && !cron_expression) {
      return NextResponse.json({ error: 'cron_expression is required for cron schedules' }, { status: 400 })
    }

    // Load workflow
    let workflow: Workflow | undefined
    try {
      workflow = await fetchWorkflowById(workflowId)
      if (!workflow) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
      }
    } catch (err) {
      console.error('[WorkflowSchedule] Error fetching workflow:', err)
      return NextResponse.json({ error: 'Failed to fetch workflow' }, { status: 500 })
    }

    // Build combined instructions similar to /api/workflow/execute
    let combinedTaskInstructions = `Execute the following workflow: "${workflow.name}"\n\n`
    combinedTaskInstructions += `Workflow Description: ${workflow.description}\n\n`

    if (variables && Object.keys(variables).length > 0) {
      combinedTaskInstructions += 'WORKFLOW VARIABLES:\n'
      Object.entries(variables).forEach(([key, value]) => {
        combinedTaskInstructions += `- ${key}: ${String(value)}\n`
      })
      combinedTaskInstructions += '\n'
    }

    combinedTaskInstructions += 'Instructions:\n'
    const sortedTasks = [...workflow.tasks].sort((a, b) => a.order - b.order)
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i]
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
    combinedTaskInstructions += 'If any error occurs, handle it gracefully.\n'
    if (variables && Object.keys(variables).length > 0) {
      combinedTaskInstructions += '- Use the provided workflow variables in the steps above\n'
     // combinedTaskInstructions += '- Variables have been automatically substituted in the instructions\n'
    }

    // Get effective settings from first task or workflow defaults
    const firstTask = sortedTasks[0]
    const effectiveSettings = firstTask
      ? getEffectiveTaskSettings(workflow.settings, firstTask.settings)
      : workflow.settings

    const validatedExecutionSettings = {
      proxy: Boolean(executionSettings?.proxy || false),
      proxyCountry: executionSettings?.proxyCountry === 'none' ? '' : executionSettings?.proxyCountry || '',
      highlightElements: Boolean(executionSettings?.highlightElements || false),
    }

    const finalSettings = {
      ...effectiveSettings,
      ...validatedExecutionSettings,
    }

    const apiSettings = convertSettingsToApiFormat(finalSettings)

    // Build creation payload for scheduled-tasks API
    const createPayload: Record<string, any> = {
      task: combinedTaskInstructions,
      schedule_type,
      ...(schedule_type === 'interval' ? { interval_minutes: Number(interval_minutes) } : {}),
      ...(schedule_type === 'cron' ? { cron_expression } : {}),
      ...(start_at ? { start_at } : {}),
      ...(end_at ? { end_at } : {}),
      ...apiSettings,
      // Optional custom overrides (if caller provided)
      ...(llm_model ? { llm_model } : {}),
      ...(typeof use_adblock === 'boolean' ? { use_adblock } : {}),
      ...(typeof use_proxy === 'boolean' ? { use_proxy } : {}),
      ...(proxy_country_code ? { proxy_country_code } : {}),
      ...(typeof highlight_elements === 'boolean' ? { highlight_elements } : {}),
      ...(typeof save_browser_data === 'boolean' ? { save_browser_data } : {}),
      ...(browser_viewport_width ? { browser_viewport_width } : {}),
      ...(browser_viewport_height ? { browser_viewport_height } : {}),
      ...(max_agent_steps ? { max_agent_steps } : {}),
      ...(typeof enable_public_share === 'boolean' ? { enable_public_share } : {}),
      ...(Array.isArray(allowed_domains) ? { allowed_domains } : {}),
      ...(Array.isArray(included_file_names) ? { included_file_names } : {}),
      ...(secrets ? { secrets } : {}),
      ...(typeof enable_recordings === 'boolean' ? { enable_recordings } : {}),
      ...(recording_quality ? { recording_quality } : {}),
      ...(recording_fps ? { recording_fps } : {}),
      ...(recording_resolution ? { recording_resolution } : {}),
      ...(browser_profile_id ? { browser_profile_id } : {}),
      // Persist linkage in metadata for traceability (metadata values must be strings)
      metadata: {
        workflow_id: String(workflowId),
        workflow_vars: variables ? JSON.stringify(variables) : '',
      },
    }

    // Reuse local scheduled-tasks endpoint (handles provider call + persistence)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/scheduled-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `Failed to create scheduled workflow: ${errText}` }, { status: 500 })
    }
    const data = await res.json()

    return NextResponse.json({ success: true, scheduledTask: data })
  } catch (error) {
    console.error('[WorkflowSchedule] Error:', error)
    return NextResponse.json({ error: 'Failed to schedule workflow' }, { status: 500 })
  }
}


