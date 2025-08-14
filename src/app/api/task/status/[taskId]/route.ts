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
      console.error('[STATUS] API key not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Use the correct endpoint for task status only
    const url = `${API_BASE_URL}/task/${taskId}/status`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[STATUS] Task status API error for ${taskId}:`, response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    // The status endpoint should return just the status string, but let's handle both cases
    const responseText = await response.text()
    
    let status: string
    
    // Try to parse as JSON first (in case API returns JSON)
    try {
      const jsonResponse = JSON.parse(responseText)
      status = jsonResponse.status || jsonResponse
    } catch {
      // If not JSON, use as plain text
      status = responseText
    }
    
    const trimmedStatus = status.trim()
    
    // Return just the status string as per API documentation
    return new NextResponse(trimmedStatus, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    })
  } catch (error) {
    console.error(`[STATUS] Task status error for ${params.taskId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 