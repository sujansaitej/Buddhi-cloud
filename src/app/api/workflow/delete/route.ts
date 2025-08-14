import { NextRequest, NextResponse } from 'next/server'
import { deleteWorkflow, getWorkflows } from '@/lib/workflow-storage-mongo'
import HistoryService from '@/lib/history-service'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Try to capture workflow name pre-deletion for history log
    let workflowName: string | undefined
    try {
      const list = await getWorkflows()
      const wf = list.find((w) => w.id === id)
      if (wf) workflowName = wf.name
    } catch {}

    const success = await deleteWorkflow(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Log history
    try {
      await HistoryService.logWorkflowDeleted(
        id,
        workflowName || id,
        'user',
        'System'
      )
    } catch (e) {
      console.warn('Failed to log workflow deletion event:', e)
    }

    return NextResponse.json({ success: true, message: 'Workflow deleted successfully' })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
} 