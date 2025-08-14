import { NextRequest, NextResponse } from 'next/server'
import { getTemplate, incrementTemplateUsage } from '@/lib/template-storage-mongo'
import HistoryService from '@/lib/history-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    
    if (!templateId) {
      return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 })
    }

    const template = await getTemplate(templateId)
    
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 })
    }

    // Increment usage count
    await incrementTemplateUsage(templateId)

    // Log template usage
    try {
      await HistoryService.logTemplateUsed(template.id, template.name, 'user', 'System')
    } catch {}

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error using template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to use template' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    if (!templateId) {
      return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 })
    }
    // Only increment usage and log; the client will redirect to /workflows?template=ID
    await incrementTemplateUsage(templateId)
    try {
      const template = await getTemplate(templateId)
      if (template) {
        await HistoryService.logTemplateUsed(template.id, template.name, 'user', 'System')
      }
    } catch {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error using template (POST):', error)
    return NextResponse.json(
      { success: false, error: 'Failed to use template' },
      { status: 500 }
    )
  }
}