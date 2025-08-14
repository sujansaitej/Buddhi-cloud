import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    const apiKey = process.env.BROWSER_USE_API_KEY

    console.log(`[RESUME] Starting resume request for task: ${taskId}`)

    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('[RESUME] API key not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Ensure taskId is properly encoded and passed as query parameter
    const encodedTaskId = encodeURIComponent(taskId)
    const url = `${API_BASE_URL}/resume-task?task_id=${encodedTaskId}`
    
    console.log(`[RESUME] Resuming task ${taskId} with URL: ${url}`)
    console.log(`[RESUME] Encoded taskId: ${encodedTaskId}`)

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })

    console.log(`[RESUME] Response status: ${response.status}`)
    console.log(`[RESUME] Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[RESUME] Resume task API error for ${taskId}:`, response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log(`[RESUME] Response body:`, responseText)
    console.log(`[RESUME] Task ${taskId} resumed successfully`)
    
    // The endpoint returns an empty response body with 200 status
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[RESUME] Resume task error for ${params.taskId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 