import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured. Please set BROWSER_USE_API_KEY in your environment variables.' },
        { status: 401 }
      )
    }

    // Set default parameters for optimal task execution with recordings and screenshots
    const taskData = {
      // Required parameters
      task: body.task,
      
      // LLM Model - use the best available
      llm_model: body.llm_model || 'gpt-4o',
      
      // Browser settings for better automation
      use_adblock: body.use_adblock !== undefined ? body.use_adblock : true,
      use_proxy: body.use_proxy !== undefined ? body.use_proxy : true,
      proxy_country_code: body.proxy_country_code || 'us',
      highlight_elements: body.highlight_elements !== undefined ? body.highlight_elements : false,
      
      // Viewport settings
      browser_viewport_width: body.browser_viewport_width || 1280,
      browser_viewport_height: body.browser_viewport_height || 960,
      
      // Task execution settings
      max_agent_steps: body.max_agent_steps || 75,
      save_browser_data: body.save_browser_data !== undefined ? body.save_browser_data : true,
      
      // Sharing and output settings
      enable_public_share: body.enable_public_share !== undefined ? body.enable_public_share : false,
      
      // Enable recordings and screenshots by default
      enable_recordings: body.enable_recordings !== undefined ? body.enable_recordings : true,
      enable_screenshots: body.enable_screenshots !== undefined ? body.enable_screenshots : true,
      
      // Optional parameters
      ...(body.secrets && { secrets: body.secrets }),
      ...(body.allowed_domains && { allowed_domains: body.allowed_domains }),
      ...(body.browser_profile_id && { browser_profile_id: body.browser_profile_id }),
      ...(body.structured_output_json && { structured_output_json: body.structured_output_json }),
      ...(body.included_file_names && { included_file_names: body.included_file_names }),
      ...(body.metadata && { metadata: body.metadata }),
    }

    // console.log('Creating task with parameters:', taskData)

    // Call Browser Use API
    const response = await fetch(`${API_BASE_URL}/run-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Browser Use API error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Browser Use API key.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    // console.log('Task created successfully:', data.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 