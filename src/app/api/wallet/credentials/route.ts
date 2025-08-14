import { NextRequest, NextResponse } from 'next/server'
import { walletCredentialOperations, walletUtils } from '@/lib/wallet-database'
import { CreateWalletCredentialRequest } from '@/types/wallet'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (groupId) {
      // Get credentials for a specific group
      const credentials = await walletCredentialOperations.getCredentialsByGroupId(groupId)
      return NextResponse.json({
        success: true,
        credentials
      })
    }

    // Get all credentials (this might be expensive, consider pagination)
    const credentials = await walletCredentialOperations.getAllCredentials()
    return NextResponse.json({
      success: true,
      credentials
    })
  } catch (error) {
    console.error('Error fetching wallet credentials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet credentials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { groupId, name, type, value, description, isRequired, isSecret, order } = body

    const credentialData: CreateWalletCredentialRequest = {
      groupId,
      name,
      type,
      value,
      description,
      isRequired: isRequired ?? false,
      isSecret: isSecret ?? false,
      order: order ?? 0
    }

    if (!walletUtils.validateCredentialData(credentialData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid credential data' },
        { status: 400 }
      )
    }

    const credential = await walletCredentialOperations.createCredential(credentialData)
    
    return NextResponse.json({
      success: true,
      credential,
      message: `Credential "${credential.name}" created successfully`
    })
  } catch (error) {
    console.error('Error creating wallet credential:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet credential' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Credential ID is required' },
        { status: 400 }
      )
    }

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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    console.log('DELETE credential request received for ID:', id)

    if (!id) {
      console.log('DELETE credential failed: No ID provided')
      return NextResponse.json(
        { success: false, error: 'Credential ID is required' },
        { status: 400 }
      )
    }

    console.log('Attempting to delete credential from database...')
    const deleted = await walletCredentialOperations.deleteCredential(id)
    
    console.log('Delete operation result:', deleted)
    
    if (!deleted) {
      console.log('DELETE credential failed: Credential not found')
      return NextResponse.json(
        { success: false, error: 'Wallet credential not found' },
        { status: 404 }
      )
    }

    console.log('DELETE credential successful')
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