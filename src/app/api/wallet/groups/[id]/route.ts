import { NextRequest, NextResponse } from 'next/server'
import { walletGroupOperations } from '@/lib/wallet-database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const group = await walletGroupOperations.getGroupById(id)
    
    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Wallet group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      group
    })
  } catch (error) {
    console.error('Error fetching wallet group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet group' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updateData = await request.json()

    const updatedGroup = await walletGroupOperations.updateGroup(id, updateData)
    
    if (!updatedGroup) {
      return NextResponse.json(
        { success: false, error: 'Wallet group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      group: updatedGroup,
      message: `Wallet group "${updatedGroup.name}" updated successfully`
    })
  } catch (error) {
    console.error('Error updating wallet group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet group' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const deleted = await walletGroupOperations.deleteGroup(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Wallet group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet group deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting wallet group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete wallet group' },
      { status: 500 }
    )
  }
} 