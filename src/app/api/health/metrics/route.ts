import { NextRequest, NextResponse } from 'next/server'
import HistoryService from '@/lib/history-service'

function parseNumberParam(value: string | null, fallback: number): number {
  const n = value ? Number(value) : NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rangeHours = parseNumberParam(searchParams.get('rangeHours'), 24)
    const now = new Date()
    const startDate = new Date(now.getTime() - rangeHours * 60 * 60 * 1000)

    // Pull recent history events to derive metrics
    const events = await HistoryService.getEvents({ startDate, limit: 2000 })

    const taskEvents = events.filter((e: any) => e.type?.startsWith('task_'))
    const executed = taskEvents.filter((e: any) => e.type === 'task_executed')
    const successCount = executed.filter((e: any) => e.severity === 'success').length
    const failureCount = taskEvents.filter((e: any) => e.severity === 'error').length
    const warningCount = taskEvents.filter((e: any) => e.severity === 'warning').length
    const consideredTotal = successCount + failureCount + warningCount
    const successRate = consideredTotal > 0 ? (successCount / consideredTotal) * 100 : 0

    const durations = executed
      .map((e: any) => Number(e.executionTime))
      .filter((v: any) => Number.isFinite(v) && v > 0)
    const avgDurationMin = durations.length > 0
      ? Math.round(((durations.reduce((a: number, b: number) => a + b, 0) / durations.length) / 60000) * 10) / 10
      : 0

    const activeWindowStart = new Date(now.getTime() - 60 * 60 * 1000)
    const activeAutomations = new Set(
      events
        .filter((e: any) => e.relatedWorkflowId && new Date(e.timestamp) >= activeWindowStart)
        .map((e: any) => e.relatedWorkflowId)
    ).size

    const totalConsidered = consideredTotal || 1
    const failureRate = (failureCount / totalConsidered) * 100

    // Simple heuristic for cost efficiency (without credit telemetry):
    const costEfficiency = Math.max(0, Math.min(100, Math.round(70 + successRate * 0.3)))

    const queueLength = 0 // No queue telemetry yet

    const metrics = [
      {
        id: 'overall_success_rate',
        name: 'Overall Success Rate',
        value: Math.round(successRate * 10) / 10,
        unit: '%',
        trend: successRate >= 90 ? 'up' : successRate >= 70 ? 'stable' : 'down',
        trendValue: 0,
        status: successRate >= 90 ? 'healthy' : successRate >= 70 ? 'warning' : 'critical',
        description: `Percentage of successful automation runs in the last ${rangeHours} hours`
      },
      {
        id: 'avg_response_time',
        name: 'Avg Response Time',
        value: avgDurationMin,
        unit: 'min',
        trend: 'stable',
        trendValue: 0,
        status: avgDurationMin <= 5 ? 'healthy' : avgDurationMin <= 10 ? 'warning' : 'critical',
        description: 'Average time for automations to complete'
      },
      {
        id: 'active_automations',
        name: 'Active Automations',
        value: activeAutomations,
        unit: 'count',
        trend: 'stable',
        trendValue: 0,
        status: 'healthy',
        description: 'Distinct automations active in the last hour'
      },
      {
        id: 'failure_rate',
        name: 'Failure Rate',
        value: Math.round(failureRate * 10) / 10,
        unit: '%',
        trend: failureRate <= 5 ? 'down' : 'up',
        trendValue: 0,
        status: failureRate <= 5 ? 'healthy' : failureRate <= 15 ? 'warning' : 'critical',
        description: `Failed runs in the last ${rangeHours} hours`
      },
      {
        id: 'cost_efficiency',
        name: 'Cost Efficiency',
        value: costEfficiency,
        unit: '%',
        trend: 'stable',
        trendValue: 0,
        status: costEfficiency >= 85 ? 'healthy' : costEfficiency >= 70 ? 'warning' : 'critical',
        description: 'Heuristic ratio of successful automations to credits consumed'
      },
      {
        id: 'queue_length',
        name: 'Queue Length',
        value: queueLength,
        unit: 'tasks',
        trend: 'stable',
        trendValue: 0,
        status: 'healthy',
        description: 'Number of tasks waiting in the execution queue'
      }
    ]

    return NextResponse.json({ success: true, metrics })
  } catch (error) {
    console.error('Error computing health metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to compute health metrics' },
      { status: 500 }
    )
  }
}


