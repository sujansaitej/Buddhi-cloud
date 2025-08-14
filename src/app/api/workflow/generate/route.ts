import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, category, complexity } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const result = await geminiService.generateWorkflow({
      prompt,
      category,
      complexity
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.message || 'Failed to generate workflow',
          success: false 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      workflow: result.workflow,
      message: result.message
    })

  } catch (error) {
    console.error('Error generating workflow:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate workflow',
        success: false 
      },
      { status: 500 }
    )
  }
} 