import { NextRequest, NextResponse } from 'next/server'
import { getTemplate } from '@/lib/template-storage-mongo'

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

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}