import { NextRequest, NextResponse } from 'next/server'
import { walletCredentialOperations } from '@/lib/wallet-database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const credential = await walletCredentialOperations.getCredentialById(id)
    
    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'Wallet credential not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      credential
    })
  } catch (error) {
    console.error('Error fetching wallet credential:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet credential' },
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

    const updatedCredential = await walletCredentialOperations.updateCredential(id, updateData)
    
    if (!updatedCredential) {
      return NextResponse.json(
        { success: false, error: 'Wallet credential not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      credential: updatedCredential,
      message: `Credential "${updatedCredential.name}" updated successfully`
    })
  } catch (error) {
    console.error('Error updating wallet credential:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet credential' },
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

    const deleted = await walletCredentialOperations.deleteCredential(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Wallet credential not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet credential deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting wallet credential:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete wallet credential' },
      { status: 500 }
    )
  }
} 