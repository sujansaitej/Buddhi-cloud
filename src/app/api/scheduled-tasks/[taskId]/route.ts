import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import ScheduledTask from '@/models/ScheduledTask'

function toIsoDate(value: any): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    if (/Z|[+-]\d{2}:?\d{2}$/.test(value) || /GMT/.test(value)) {
      const d = new Date(value)
      return isNaN(d.getTime()) ? undefined : d
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/.test(value)) {
      const d = new Date(`${value}Z`)
      return isNaN(d.getTime()) ? undefined : d
    }
    const d = new Date(value)
    return isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}

function normalizeTaskDates(task: any) {
  if (!task || typeof task !== 'object') return task
  return {
    ...task,
    start_at: toIsoDate(task.start_at),
    end_at: toIsoDate(task.end_at),
    next_run_at: toIsoDate(task.next_run_at),
    created_at: toIsoDate(task.created_at),
    updated_at: toIsoDate(task.updated_at)
  }
}

const ALLOWED_LLM_MODELS = new Set<string>([
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gemini-2.5-flash',
  'claude-sonnet-4-20250514'
])

function validateMetadata(meta: any): string | null {
  if (meta == null) return null
  if (typeof meta !== 'object' || Array.isArray(meta)) return 'metadata must be an object'
  const entries = Object.entries(meta)
  if (entries.length > 10) return 'metadata supports up to 10 key-value pairs'
  for (const [k, v] of entries) {
    if (typeof k !== 'string' || k.trim().length === 0 || k.length > 100) return 'metadata keys must be non-empty strings up to 100 chars'
    if (typeof v !== 'string' || v.length > 1000) return 'metadata values must be strings up to 1000 chars'
  }
  return null
}

function sanitizeUpdatePayload(input: any) {
  // Only include fields the provider supports for UPDATE to avoid errors
  const allowed = [
    'task',
    'schedule_type',
    'interval_minutes',
    'cron_expression',
    'start_at',
    'end_at',
    'is_active',
    'use_adblock',
    'use_proxy',
    'highlight_elements',
    'llm_model',
    'save_browser_data',
    'structured_output_json'
  ]
  const body: any = {}
  for (const k of allowed) if (k in input) body[k] = input[k]

  if (body.schedule_type === 'interval') delete body.cron_expression
  if (body.schedule_type === 'cron') delete body.interval_minutes

  const toIsoString = (v: any) => {
    if (!v) return undefined
    if (typeof v === 'string') {
      const d = new Date(v)
      if (!isNaN(d.getTime())) return d.toISOString()
      const m = v.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?$/)
      if (m) return new Date(`${v}Z`).toISOString()
      return undefined
    }
    if (v instanceof Date) return v.toISOString()
    return undefined
  }
  if (body.start_at) body.start_at = toIsoString(body.start_at)
  if (body.end_at) body.end_at = toIsoString(body.end_at)

  return body
}

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/scheduled-task/${params.taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    try {
      await dbConnect()
      const nt = normalizeTaskDates(data)
      await ScheduledTask.findOneAndUpdate(
        { id: nt.id },
        { $set: nt },
        { upsert: true }
      )
      // Merge local-only advanced fields into response
      const local = await ScheduledTask.findOne({ id: nt.id }).lean()
      if (local) {
        const advancedKeys = [
          'allowed_domains',
          'included_file_names',
          'secrets',
          'proxy_country_code',
          'browser_viewport_width',
          'browser_viewport_height',
          'max_agent_steps',
          'enable_public_share',
          'save_browser_data',
          'highlight_elements',
          'enable_recordings',
          'recording_quality',
          'recording_fps',
          'recording_resolution'
        ]
        const overlay: Record<string, any> = {}
        const localRecord = local as unknown as Record<string, any>
        for (const k of advancedKeys) if (localRecord[k] !== undefined) overlay[k] = localRecord[k]
        return NextResponse.json({ ...data, ...overlay })
      }
    } catch (e) {
      console.warn('Failed to persist/merge scheduled task to DB:', e)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Scheduled task fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const raw = await request.json()

    // Debug: incoming update payload (times only)
    try {
      const dbgIn = {
        schedule_type: raw?.schedule_type,
        interval_minutes: raw?.interval_minutes,
        cron_expression: raw?.cron_expression,
        start_at: raw?.start_at,
        end_at: raw?.end_at,
        is_active: raw?.is_active
      }
      console.log('[ScheduledTasks][UPDATE] Incoming (raw):', dbgIn)
    } catch {}

    const body = sanitizeUpdatePayload(raw)

    // Debug: sanitized body before sending
    try {
      const dbgSanitized = {
        schedule_type: body?.schedule_type,
        interval_minutes: body?.interval_minutes,
        cron_expression: body?.cron_expression,
        start_at: body?.start_at,
        end_at: body?.end_at,
        is_active: body?.is_active
      }
      console.log('[ScheduledTasks][UPDATE] Sanitized (to provider):', dbgSanitized)
    } catch {}

    // Fetch current provider state to send only changed fields
    let current: any | null = null
    try {
      const curRes = await fetch(`${API_BASE_URL}/scheduled-task/${params.taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      if (curRes.ok) current = await curRes.json()
    } catch {}

    const changed: any = {}
    const consider = [
      'task',
      'schedule_type',
      'interval_minutes',
      'cron_expression',
      'start_at',
      'end_at',
      'is_active',
      'use_adblock',
      'use_proxy',
      'highlight_elements',
      'llm_model',
      'save_browser_data',
      'structured_output_json'
    ] as const

    for (const k of consider) {
      if (body[k] === undefined) continue
      if (!current) { changed[k] = body[k]; continue }
      const curVal = (current as any)[k]
      const newVal = (body as any)[k]
      const bothDates = (v: any) => typeof v === 'string' && /\d{4}-\d{2}-\d{2}T/.test(v)
      if (bothDates(curVal) || bothDates(newVal)) {
        const a = curVal ? new Date(curVal).toISOString() : undefined
        const b = newVal ? new Date(newVal).toISOString() : undefined
        if (a !== b) changed[k] = body[k]
        continue
      }
      if (curVal !== newVal) changed[k] = body[k]
    }

    // If nothing changed, return current as success
    if (current && Object.keys(changed).length === 0) {
      return NextResponse.json(current)
    }

    let response = await fetch(`${API_BASE_URL}/scheduled-task/${params.taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.keys(changed).length ? changed : body)
    })

    if (!response.ok) {
      // Retry with the safest minimal payload if provider rejects optional fields
      try {
        const minimal: any = {}
        if (body.task) minimal.task = body.task
        if (body.schedule_type === 'interval' && body.interval_minutes) {
          minimal.schedule_type = 'interval'
          minimal.interval_minutes = body.interval_minutes
        }
        if (body.schedule_type === 'cron' && body.cron_expression) {
          minimal.schedule_type = 'cron'
          minimal.cron_expression = body.cron_expression
        }
        if (body.start_at) minimal.start_at = body.start_at
        if (body.end_at) minimal.end_at = body.end_at
        if (typeof body.is_active === 'boolean') minimal.is_active = body.is_active
        response = await fetch(`${API_BASE_URL}/scheduled-task/${params.taskId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(minimal)
        })
      } catch {}
      if (!response.ok) {
        const errorText = await response.text()
        return NextResponse.json(
          { error: `API Error: ${response.status} - ${errorText}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()

    // Debug: provider response after update
    try {
      const dbgProvider = {
        id: data?.id,
        start_at: data?.start_at,
        next_run_at: data?.next_run_at,
        end_at: data?.end_at,
        is_active: data?.is_active
      }
      console.log('[ScheduledTasks][UPDATE] Provider response:', dbgProvider)
    } catch {}
    try {
      await dbConnect()
      // Overlay any advanced fields provided by client (local-only) onto provider data
      const advancedOnlyKeys = [
        'allowed_domains',
        'included_file_names',
        'secrets',
        'proxy_country_code',
        'browser_viewport_width',
        'browser_viewport_height',
        'max_agent_steps',
        'enable_public_share',
        'save_browser_data',
        'highlight_elements',
        'enable_recordings',
        'recording_quality',
        'recording_fps',
        'recording_resolution',
        'browser_profile_id'
      ]
      const overlay: Record<string, any> = {}
      for (const k of advancedOnlyKeys) if (raw[k] !== undefined) overlay[k] = raw[k]

      const merged = { ...data, ...overlay }
      const nt = normalizeTaskDates(merged)
      await ScheduledTask.findOneAndUpdate(
        { id: nt.id },
        { $set: nt },
        { upsert: true }
      )

      // Debug: normalized record stored in DB
      try {
        const dbgDb = {
          id: nt.id,
          start_at: nt.start_at,
          next_run_at: nt.next_run_at,
          end_at: nt.end_at,
          is_active: nt.is_active
        }
        console.log('[ScheduledTasks][UPDATE] Stored (normalized):', dbgDb)
      } catch {}
      // Return merged so client sees advanced updates immediately
      return NextResponse.json(merged)
    } catch (e) {
      console.warn('Failed to persist scheduled task update to DB:', e)
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Scheduled task update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/scheduled-task/${params.taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    try {
      await dbConnect()
      await ScheduledTask.deleteOne({ id: params.taskId })
    } catch (e) {
      console.warn('Failed to delete scheduled task from DB:', e)
    }
    return NextResponse.json({})
  } catch (error) {
    console.error('Scheduled task deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

