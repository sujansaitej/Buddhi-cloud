import { NextRequest, NextResponse } from 'next/server'
import HistoryService from '@/lib/history-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const severity = searchParams.get('severity') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined

    const events = await HistoryService.getEvents({
      startDate,
      severity,
      limit,
      // prioritize task/workflow related events for alerts
      tags: undefined
    })

    // Map history events to alert shape expected by UI
    const alerts = events.map((e: any) => ({
      id: e.id,
      type:
        e.severity === 'error' ? 'failure' :
        e.severity === 'warning' ? 'performance' : 'anomaly',
      severity: e.severity === 'error' ? 'high' : e.severity === 'warning' ? 'medium' : 'low',
      title: e.title,
      description: e.description,
      timestamp: e.timestamp,
      automationId: e.relatedWorkflowId || e.relatedTaskId,
      automationName: e.metadata?.workflowName || e.metadata?.taskId || undefined
    }))

    return NextResponse.json({ success: true, alerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}


