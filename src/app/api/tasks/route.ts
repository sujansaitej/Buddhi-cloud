import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10' // Default to 10 as per documentation
    const status = searchParams.get('status') // Optional status filter
    const sortBy = searchParams.get('sortBy') || 'created_at' // Sort by field
    const sortOrder = searchParams.get('sortOrder') || 'desc' // Sort order
    
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('[TASKS_API] API key not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Validate pagination parameters
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    
    if (pageNum < 1) {
      return NextResponse.json(
        { error: 'Page number must be at least 1' },
        { status: 400 }
      )
    }
    
    if (limitNum < 1 || limitNum > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit
    })

    // Add optional filters
    if (status && status !== 'all') {
      queryParams.append('status', status)
    }

    const url = `${API_BASE_URL}/tasks?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[TASKS_API] Tasks API error:`, response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Log summary for debugging
    console.log(`[TASKS_API] Received ${data.tasks?.length || 0} tasks`)
    
    // Return the response exactly as per API documentation
    // No transformation needed - the API already returns the correct structure
    return NextResponse.json(data)
  } catch (error) {
    console.error('[TASKS_API] Tasks list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 