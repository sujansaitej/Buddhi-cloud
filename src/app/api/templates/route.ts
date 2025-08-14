import { NextRequest, NextResponse } from 'next/server'
import { getTemplates } from '@/lib/template-storage-mongo'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const difficulty = searchParams.get('difficulty') || undefined
    const search = searchParams.get('search') || undefined
    const isPublic = searchParams.has('isPublic') ? searchParams.get('isPublic') === 'true' : undefined
    const isFeatured = searchParams.has('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit') || '10', 10) : undefined

    const templates = await getTemplates({
      category,
      difficulty,
      search,
      isPublic,
      isFeatured,
      limit
    })

    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}