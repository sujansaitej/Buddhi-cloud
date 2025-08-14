import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function GET(
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

    // console.log(`Fetching media for task: ${taskId}`)

    const response = await fetch(`${API_BASE_URL}/task/${taskId}/media`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Add cache control to prevent stale data
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Media API error for task ${taskId}:`, response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No media files found for this task. Media is only available for completed tasks.' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    // console.log(`Media data for task ${taskId}:`, data)
    
    // Ensure we always return a consistent structure
    return NextResponse.json({
      recordings: data.recordings || [],
      taskId: taskId
    })
  } catch (error) {
    console.error(`Task media error for task ${params.taskId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 