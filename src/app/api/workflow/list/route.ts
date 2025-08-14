import { NextRequest, NextResponse } from 'next/server'
import { getWorkflows } from '@/lib/workflow-storage-mongo'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let workflows = await getWorkflows()

    // Apply filters if provided
    if (category) {
      workflows = workflows.filter(w => w.category === category)
    }
    if (status) {
      workflows = workflows.filter(w => w.status === status)
    }

    return NextResponse.json({
      success: true,
      workflows,
      total: workflows.length
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
} 