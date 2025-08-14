import { NextRequest, NextResponse } from 'next/server'
import { resetTemplates } from '@/lib/template-storage-mongo'
import { ENHANCED_TEMPLATES } from '@/lib/templates-enhanced'

export async function POST(request: NextRequest) {
  try {
    // Optional: allow passing custom templates in body
    let templates = ENHANCED_TEMPLATES
    try {
      const body = await request.json()
      if (Array.isArray(body?.templates) && body.templates.length > 0) {
        templates = body.templates
      }
    } catch {}

    const count = await resetTemplates(templates)
    return NextResponse.json({ success: true, message: 'Templates reset successfully', count })
  } catch (error) {
    console.error('Error resetting templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset templates' },
      { status: 500 }
    )
  }
}



