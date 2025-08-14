import { NextResponse } from 'next/server'
import { getTemplates } from '@/lib/template-storage-mongo'

export async function GET() {
  try {
    const templates = await getTemplates()
    
    return NextResponse.json({
      success: true,
      message: 'Templates system is working!',
      templatesCount: templates.length,
      templates: templates.slice(0, 2) // Return first 2 templates for testing
    })
  } catch (error) {
    console.error('Error testing templates:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Templates system test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 