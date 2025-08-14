import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string; fileName: string } }
) {
  try {
    const { taskId, fileName } = params

    const browserUseApiKey = process.env.BROWSER_USE_API_KEY
    if (!browserUseApiKey || browserUseApiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'Browser Use API key not configured' },
        { status: 401 }
      )
    }

    // Get file download URL from Browser Use API
    const response = await fetch(
      `https://api.browser-use.com/api/v1/task/${taskId}/output-file/${fileName}`,
      {
        headers: {
          'Authorization': `Bearer ${browserUseApiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Browser Use API error:', errorData)
      
      // Provide more specific error messages
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'File not found or task does not exist' },
          { status: 404 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: 'Access denied - file may be expired or unavailable' },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          { error: `Failed to get file download URL: ${errorData}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    
    // Return only the download_url as per API documentation
    return NextResponse.json({ 
      download_url: data.download_url
    })

  } catch (error) {
    console.error('Error getting file download URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 