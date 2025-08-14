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

    // Use the correct endpoint for full task details
    const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Task details API error for ${taskId}:`, response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    // console.log(`Task ${taskId} details retrieved successfully`)
    // console.log(`Task ${taskId} steps count:`, data.steps?.length || 0)
    if (data.steps && data.steps.length > 0) {
      // console.log(`Task ${taskId} first step:`, data.steps[0])
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Task details error for ${params.taskId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 