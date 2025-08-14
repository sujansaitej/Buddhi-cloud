import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Ensure taskId is properly encoded and passed as query parameter
    const encodedTaskId = encodeURIComponent(taskId)
    const url = `${API_BASE_URL}/stop-task?task_id=${encodedTaskId}`
    
    console.log(`Stopping task ${taskId} with URL: ${url}`)

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Stop task API error for ${taskId}:`, response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    console.log(`Task ${taskId} stopped successfully`)
    
    // The endpoint returns an empty response body with 200 status
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Stop task error for ${params.taskId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 