import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/balance`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Prevent caching
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // console.log('Raw balance response from Browser Use API:', data)
    
    // Convert balance to number if it's a string (as per API documentation)
    if (data.balance && typeof data.balance === 'string') {
      data.balance = parseFloat(data.balance)
    }
    
    // console.log('Processed balance data:', data)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Balance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 