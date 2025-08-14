import { NextRequest, NextResponse } from 'next/server'
import { updateWorkflow } from '@/lib/workflow-storage-mongo'
import { normalizeWorkflowSettings } from '@/lib/workflow-utils'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Normalize settings if they are being updated
    if (updates.settings) {
      updates.settings = normalizeWorkflowSettings(updates.settings)
    }

    const workflow = await updateWorkflow(id, updates)

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow updated successfully'
    })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
} 