import { NextRequest, NextResponse } from 'next/server'
import { walletGroupOperations, walletUtils } from '@/lib/wallet-database'
import { CreateWalletGroupRequest, UpdateWalletGroupRequest } from '@/types/wallet'

export async function GET() {
  try {
    const groups = await walletGroupOperations.getAllGroups()
    
    return NextResponse.json({
      success: true,
      groups
    })
  } catch (error) {
    console.error('Error fetching wallet groups:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet groups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category } = body

    const groupData: CreateWalletGroupRequest = {
      name,
      description,
      category: category || 'other'
    }

    if (!walletUtils.validateGroupData(groupData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid group data' },
        { status: 400 }
      )
    }

    const group = await walletGroupOperations.createGroup(groupData)
    
    return NextResponse.json({
      success: true,
      group,
      message: `Wallet group "${group.name}" created successfully`
    })
  } catch (error) {
    console.error('Error creating wallet group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet group' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, category } = body

    const updateData: UpdateWalletGroupRequest = {
      name,
      description,
      category
    }

    const group = await walletGroupOperations.updateGroup(id, updateData)
    
    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      group,
      message: `Wallet group "${group.name}" updated successfully`
    })
  } catch (error) {
    console.error('Error updating wallet group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet group' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    const success = await walletGroupOperations.deleteGroup(id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
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