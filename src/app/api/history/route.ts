import { NextRequest, NextResponse } from 'next/server'
import HistoryService from '@/lib/history-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const type = searchParams.get('type') || undefined
    const userId = searchParams.get('userId') || undefined
    const severity = searchParams.get('severity') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    const relatedWorkflowId = searchParams.get('relatedWorkflowId') || undefined
    const relatedTaskId = searchParams.get('relatedTaskId') || undefined
    const tags = searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Validate date parameters
    if (startDate && isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid startDate parameter' },
        { status: 400 }
      )
    }

    if (endDate && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid endDate parameter' },
        { status: 400 }
      )
    }

    // Build filters object
    const filters = {
      type,
      userId,
      severity,
      startDate,
      endDate,
      relatedWorkflowId,
      relatedTaskId,
      tags,
      limit,
      offset
    }

    // Fetch events
    const events = await HistoryService.getEvents(filters)

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      filters
    })
  } catch (error) {
    console.error('Error fetching history events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { type, title, description, userId, userName } = body
    
    if (!type || !title || !description || !userId || !userName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, title, description, userId, userName' },
        { status: 400 }
      )
    }

    // Create the history event
    const event = await HistoryService.createEvent(body)

    return NextResponse.json({
      success: true,
      event,
      message: 'History event created successfully'
    })
  } catch (error) {
    console.error('Error creating history event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create history event' },
      { status: 500 }
    )
  }
}
