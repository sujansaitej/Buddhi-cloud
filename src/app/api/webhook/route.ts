import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your_webhook_secret_here'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const timestamp = request.headers.get('X-Browser-Use-Timestamp')
    const signature = request.headers.get('X-Browser-Use-Signature')

    // Verify webhook signature
    if (timestamp && signature) {
      const message = `${timestamp}.${JSON.stringify(body, Object.keys(body).sort())}`
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(message)
        .digest('hex')

      if (signature !== expectedSignature) {
        console.error('Webhook signature verification failed')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Handle different webhook event types
    switch (body.type) {
      case 'agent.task.status_update':
        await handleTaskStatusUpdate(body.payload)
        break
      case 'test':
        // console.log('Webhook test received:', body)
        break
      default:
        // console.log('Unknown webhook event type:', body.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleTaskStatusUpdate(payload: any) {
  const { task_id, status, session_id, metadata } = payload
  
  // console.log('Task status update:', {
  //   taskId: task_id,
  //   status,
  //   sessionId: session_id,
  //   metadata
  // })

  // Here you can implement real-time updates to your frontend
  // For example, using WebSockets, Server-Sent Events, or polling
  // For now, we'll just log the update
  
  // You could also store the update in a database for persistence
  // or emit it to connected clients via WebSocket
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
} 