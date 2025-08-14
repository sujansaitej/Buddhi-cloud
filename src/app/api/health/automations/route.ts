import { NextRequest, NextResponse } from 'next/server'
import { getWorkflows } from '@/lib/workflow-storage-mongo'
import HistoryService from '@/lib/history-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rangeHours = searchParams.get('rangeHours') ? parseInt(searchParams.get('rangeHours')!) : 24
    const now = new Date()
    const startDate = new Date(now.getTime() - rangeHours * 60 * 60 * 1000)

    const [workflows, events] = await Promise.all([
      getWorkflows(),
      HistoryService.getEvents({ startDate, limit: 5000 })
    ])

    // Compute per-workflow performance
    const byWorkflow: Record<string, { name: string; success: number; fail: number; runs: number; lastRun?: Date; durations: number[] }> = {}

    for (const wf of workflows) {
      byWorkflow[wf.id] = {
        name: wf.name,
        success: 0,
        fail: 0,
        runs: 0,
        lastRun: undefined,
        durations: []
      }
    }

    for (const e of events as any[]) {
      const workflowId = e.relatedWorkflowId
      if (!workflowId || !byWorkflow[workflowId]) continue
      const bucket = byWorkflow[workflowId]
      if (e.type === 'task_executed') {
        bucket.runs += 1
        if (e.severity === 'success') bucket.success += 1
        if (e.severity === 'error') bucket.fail += 1
        const t = new Date(e.timestamp)
        if (!bucket.lastRun || bucket.lastRun < t) bucket.lastRun = t
        if (e.executionTime && Number.isFinite(Number(e.executionTime))) {
          bucket.durations.push(Number(e.executionTime))
        }
      }
    }

    const automations = Object.entries(byWorkflow).map(([automationId, v]) => {
      const successRate = v.runs > 0 ? Math.round((v.success / v.runs) * 1000) / 10 : 0
      const avgMs = v.durations.length > 0 ? v.durations.reduce((a, b) => a + b, 0) / v.durations.length : 0
      const avgMin = Math.round((avgMs / 60000) * 10) / 10
      return {
        automationId,
        name: v.name,
        successRate,
        avgDuration: avgMin,
        lastRun: (v.lastRun || now).toISOString(),
        status: v.fail > 0 && v.fail >= v.success ? 'failed' : v.success > 0 ? 'success' : 'paused',
        runsToday: v.runs
      }
    })

    // Sort by runs desc and limit to top 20
    automations.sort((a, b) => b.runsToday - a.runsToday)

    return NextResponse.json({ success: true, automations: automations.slice(0, 20) })
  } catch (error) {
    console.error('Error computing automation performance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to compute automation performance' },
      { status: 500 }
    )
  }
}


