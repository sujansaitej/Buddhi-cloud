import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import ScheduledTask from '@/models/ScheduledTask'

function toIsoDate(value: any): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    // If explicit timezone (Z or +/-HH:MM) or classic GMT string → trust native parse
    if (/Z|[+-]\d{2}:?\d{2}$/.test(value) || /GMT/.test(value)) {
      const d = new Date(value)
      return isNaN(d.getTime()) ? undefined : d
    }
    // If ISO-like without timezone (allow up to microseconds), treat as UTC by appending Z
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?$/.test(value)) {
      const d = new Date(`${value}Z`)
      return isNaN(d.getTime()) ? undefined : d
    }
    // Fallback to native parse
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

const ALLOWED_PROXY_COUNTRIES_SCHEDULED = new Set<string>([
  'us','uk','fr','it','jp','au','de','fi','ca','in'
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

function validateAdvanced(body: any, isCreate: boolean): string | null {
  if (body.llm_model && typeof body.llm_model === 'string' && !ALLOWED_LLM_MODELS.has(body.llm_model)) {
    return `llm_model is not supported`
  }
  if (body.use_proxy && body.proxy_country_code) {
    const cc = String(body.proxy_country_code).toLowerCase()
    if (!ALLOWED_PROXY_COUNTRIES_SCHEDULED.has(cc)) return 'proxy_country_code is invalid'
    body.proxy_country_code = cc
  }
  if (body.max_agent_steps != null) {
    const n = Number(body.max_agent_steps)
    if (!Number.isFinite(n) || n < 1 || n > 200) return 'max_agent_steps must be between 1 and 200'
  }
  if (body.browser_viewport_width != null) {
    const w = Number(body.browser_viewport_width)
    if (!Number.isFinite(w) || w < 800 || w > 3840) return 'browser_viewport_width must be between 800 and 3840'
  }
  if (body.browser_viewport_height != null) {
    const h = Number(body.browser_viewport_height)
    if (!Number.isFinite(h) || h < 600 || h > 2160) return 'browser_viewport_height must be between 600 and 2160'
  }
  if (body.enable_recordings) {
    if (body.recording_fps != null) {
      const fps = Number(body.recording_fps)
      if (!Number.isFinite(fps) || fps < 1 || fps > 60) return 'recording_fps must be between 1 and 60'
    }
    if (body.recording_quality && !['standard','high'].includes(String(body.recording_quality))) return 'recording_quality must be standard or high'
  }
  const metaErr = validateMetadata(body.metadata)
  if (metaErr) return metaErr
  return null
}

function sanitizeCreatePayload(input: any) {
  const allowed = [
    'task',
    'schedule_type',
    'interval_minutes',
    'cron_expression',
    'start_at',
    'end_at',
    'secrets',
    'allowed_domains',
    'save_browser_data',
    'structured_output_json',
    'llm_model',
    'use_adblock',
    'use_proxy',
    'proxy_country_code',
    'highlight_elements',
    // recording settings (forward where provider supports)
    'enable_recordings',
    'recording_quality',
    'recording_fps',
    'recording_resolution',
    'included_file_names',
    'browser_viewport_width',
    'browser_viewport_height',
    'max_agent_steps',
    'enable_public_share',
    'metadata',
    'browser_profile_id'
  ]

  const body: any = {}
  for (const k of allowed) if (k in input) body[k] = input[k]

  // Schedule field exclusivity
  if (body.schedule_type === 'interval') delete body.cron_expression
  if (body.schedule_type === 'cron') delete body.interval_minutes

  // Normalize datetimes to ISO string with Z
  const toIsoString = (v: any) => {
    if (!v) return undefined
    if (typeof v === 'string') {
      const d = new Date(v)
      if (!isNaN(d.getTime())) return d.toISOString()
      // bare ISO without tz
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

function ceilToNextMinute(date = new Date(), offsetSeconds = 15) {
  const t = date.getTime()
  const nextMinute = Math.ceil(t / 60000) * 60000
  return new Date(nextMinute + offsetSeconds * 1000)
}

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit
    })

    const url = `${API_BASE_URL}/scheduled-tasks?${queryParams.toString()}`

    const response = await fetch(url, {
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
    // Sync to DB, then merge local-only advanced fields into response
    try {
      await dbConnect()
      const ids: string[] = Array.isArray(data.tasks) ? data.tasks.map((t: any) => t.id) : []
      if (Array.isArray(data.tasks)) {
        for (const t of data.tasks) {
          const nt = normalizeTaskDates(t)
          await ScheduledTask.findOneAndUpdate(
            { id: nt.id },
            { $set: nt },
            { upsert: true }
          )
        }
      }
      // Merge: prefer provider values; overlay local advanced fields
      const localDocs = ids.length
        ? await ScheduledTask.find({ id: { $in: ids } }).lean()
        : []
      const idToLocal: Record<string, any> = {}
      for (const d of localDocs) idToLocal[d.id] = d
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
      const mergedTasks = Array.isArray(data.tasks)
        ? data.tasks.map((t: any) => {
            const local = idToLocal[t.id] || {}
            const overlay: Record<string, any> = {}
            // Prefer locally stored values for advanced/local-only fields
            for (const k of advancedKeys) if (local[k] !== undefined) overlay[k] = local[k]
            // Also prefer locally stored schedule timing fields if available (these reflect latest updates)
            for (const tk of ['start_at','end_at','next_run_at']) if (local[tk] !== undefined) overlay[tk] = local[tk]
            return { ...t, ...overlay }
          })
        : []
      return NextResponse.json({ ...data, tasks: mergedTasks })
    } catch (e) {
      console.warn('Failed to sync/merge scheduled tasks to DB:', e)
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Scheduled tasks fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const raw = await request.json()

    // Debug: incoming creation payload (times only)
    try {
      const dbgIn = {
        schedule_type: raw?.schedule_type,
        interval_minutes: raw?.interval_minutes,
        cron_expression: raw?.cron_expression,
        start_at: raw?.start_at,
        end_at: raw?.end_at
      }
      console.log('[ScheduledTasks][CREATE] Incoming (raw):', dbgIn)
    } catch {}
    
    // Validate required fields
    if (!raw.task) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      )
    }

    if (!raw.schedule_type) {
      return NextResponse.json(
        { error: 'Schedule type is required' },
        { status: 400 }
      )
    }

    if (raw.schedule_type === 'interval' && !raw.interval_minutes) {
      return NextResponse.json(
        { error: 'Interval minutes is required for interval schedule' },
        { status: 400 }
      )
    }

    if (raw.schedule_type === 'cron' && !raw.cron_expression) {
      return NextResponse.json(
        { error: 'Cron expression is required for cron schedule' },
        { status: 400 }
      )
    }

    // Prepare sanitized body to match API spec
    const createBody = sanitizeCreatePayload(raw)

    // Validate advanced and metadata constraints
    const advErr = validateAdvanced(createBody, true)
    if (advErr) {
      return NextResponse.json({ error: advErr }, { status: 400 })
    }
    if (!createBody.start_at) {
      createBody.start_at = new Date().toISOString()
    }

    // Guard/align timings for interval schedules
    try {
      const now = new Date()
      const start = new Date(createBody.start_at)
      if (createBody.schedule_type === 'interval') {
        const intervalMin = Number(createBody.interval_minutes || 0)
        if (!intervalMin || intervalMin < 1) {
          return NextResponse.json({ error: 'interval_minutes must be >= 1 for interval schedules' }, { status: 400 })
        }
        // If start is too close/past, align to next minute boundary + small offset
        if (isNaN(start.getTime()) || start.getTime() <= now.getTime() + 30_000) {
          const aligned = ceilToNextMinute(now, 15)
          createBody.start_at = aligned.toISOString()
          console.warn('[ScheduledTasks][CREATE] start_at aligned to', createBody.start_at)
        }
        if (createBody.end_at) {
          const end = new Date(createBody.end_at)
          const minWindowMs = (intervalMin + 1) * 60_000 // require at least one full interval + 1 min
          if (isNaN(end.getTime()) || end.getTime() < new Date(createBody.start_at).getTime() + minWindowMs) {
            // Auto-extend end_at to start + 2 intervals for reliability
            const fixed = new Date(new Date(createBody.start_at).getTime() + (intervalMin * 2) * 60_000)
            createBody.end_at = fixed.toISOString()
            console.warn('[ScheduledTasks][CREATE] end_at auto-extended to', createBody.end_at)
          }
        }
      }
    } catch {}

    // Debug: sanitized payload before sending to provider
    try {
      const dbgSanitized = {
        schedule_type: createBody.schedule_type,
        interval_minutes: createBody.interval_minutes,
        cron_expression: createBody.cron_expression,
        start_at: createBody.start_at,
        end_at: createBody.end_at
      }
      console.log('[ScheduledTasks][CREATE] Sanitized (to provider):', dbgSanitized)
    } catch {}

    const response = await fetch(`${API_BASE_URL}/scheduled-task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Do NOT send is_active on create; API enables by default
      body: JSON.stringify(createBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Fetch the full scheduled task details and persist
    try {
      await dbConnect()
      const detailRes = await fetch(`${API_BASE_URL}/scheduled-task/${data.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      })
      const detail = detailRes.ok ? await detailRes.json() : null
      // Debug: provider detail response (times only)
      try {
        if (detail) {
          const dbgDetail = {
            id: detail?.id,
            start_at: detail?.start_at,
            next_run_at: detail?.next_run_at,
            end_at: detail?.end_at
          }
          console.log('[ScheduledTasks][CREATE] Provider detail:', dbgDetail)
        }
      } catch {}

      let record = normalizeTaskDates(detail || { id: data.id, ...createBody })

      // Overlay local-only advanced fields onto record (provider may ignore them)
      const advancedKeys = [
        'allowed_domains',
        'included_file_names',
        'secrets',
        'proxy_country_code',
        'browser_viewport_width',
        'browser_viewport_height',
        'max_agent_steps',
        'enable_public_share',
        'enable_recordings',
        'recording_quality',
        'recording_fps',
        'recording_resolution',
        'browser_profile_id'
      ]
      try {
        const overlay: Record<string, any> = {}
        for (const k of advancedKeys) if (createBody[k] !== undefined && (record as any)[k] === undefined) overlay[k] = createBody[k]
        record = { ...(record as any), ...overlay }
      } catch {}

      // If provider computed next_run_at <= now, push start forward once (interval only)
      try {
        const now = new Date()
        if (record?.schedule_type === 'interval' && record?.next_run_at && record.next_run_at.getTime() <= now.getTime() + 5_000) {
          const aligned = ceilToNextMinute(now, 15).toISOString()
          console.warn('[ScheduledTasks][CREATE] next_run_at was in past/too soon; adjusting start_at to', aligned)
          const fixRes = await fetch(`${API_BASE_URL}/scheduled-task/${data.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ start_at: aligned })
          })
          if (fixRes.ok) {
            const fixed = await fixRes.json()
            record = normalizeTaskDates(fixed)
          }
        }
      } catch {}
      await ScheduledTask.findOneAndUpdate(
        { id: record.id },
        { $set: record },
        { upsert: true }
      )

      // Debug: normalized record stored in DB (times only)
      try {
        const dbgDb = {
          id: record.id,
          start_at: record.start_at,
          next_run_at: record.next_run_at,
          end_at: record.end_at
        }
        console.log('[ScheduledTasks][CREATE] Stored (normalized):', dbgDb)
      } catch {}
    } catch (e) {
      console.warn('Failed to persist scheduled task to DB:', e)
    }

    // Return provider data as-is; UI fetches merged data on next GET
    return NextResponse.json(data)
  } catch (error) {
    console.error('Scheduled task creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

