import mongoose from 'mongoose'
import { WalletGroup, WalletCredential } from '@/types/wallet'

// Wallet Group Schema
const walletGroupSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['social', 'email', 'finance', 'work', 'personal', 'other'],
    required: true,
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Wallet Credential Schema
const walletCredentialSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  groupId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['username', 'email', 'password', 'api_key', 'token', 'url', 'phone', 'custom'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create models
const WalletGroupModel = mongoose.models.WalletGroup || mongoose.model('WalletGroup', walletGroupSchema)
const WalletCredentialModel = mongoose.models.WalletCredential || mongoose.model('WalletCredential', walletCredentialSchema)

// Database connection
let isConnected = false

const connectToDatabase = async () => {
  if (isConnected) {
    return
  }

  try {
    const mongoUri = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/buddhidemo'
    await mongoose.connect(mongoUri)
    isConnected = true
    console.log('✅ Connected to MongoDB for Wallet Database')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Wallet Group Operations
export const walletGroupOperations = {
  // Create a new wallet group
  async createGroup(groupData: Omit<WalletGroup, 'id' | 'createdAt' | 'updatedAt' | 'credentials'>): Promise<WalletGroup> {
    await connectToDatabase()
    
    const id = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const group = new WalletGroupModel({
      ...groupData,
      id
    })
    
    const savedGroup = await group.save()
    return {
      ...savedGroup.toObject(),
      credentials: []
    }
  },

  // Get all wallet groups with their credentials
  async getAllGroups(): Promise<WalletGroup[]> {
    await connectToDatabase()
    
    const groups = await WalletGroupModel.find().sort({ createdAt: -1 })
    const credentials = await WalletCredentialModel.find().sort({ order: 1 })
    
    return groups.map(group => {
      const groupCredentials = credentials.filter(cred => cred.groupId === group.id)
      return {
        ...group.toObject(),
        credentials: groupCredentials.map(cred => cred.toObject())
      }
    })
  },

  // Get a single wallet group by ID
  async getGroupById(id: string): Promise<WalletGroup | null> {
    await connectToDatabase()
    
    const group = await WalletGroupModel.findOne({ id })
    if (!group) return null
    
    const credentials = await WalletCredentialModel.find({ groupId: id }).sort({ order: 1 })
    
    return {
      ...group.toObject(),
      credentials: credentials.map(cred => cred.toObject())
    }
  },

  // Update a wallet group
  async updateGroup(id: string, updateData: Partial<WalletGroup>): Promise<WalletGroup | null> {
    await connectToDatabase()
    
    const group = await WalletGroupModel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )
    
    if (!group) return null
    
    const credentials = await WalletCredentialModel.find({ groupId: id }).sort({ order: 1 })
    
    return {
      ...group.toObject(),
      credentials: credentials.map(cred => cred.toObject())
    }
  },

  // Delete a wallet group and all its credentials
  async deleteGroup(id: string): Promise<boolean> {
    await connectToDatabase()
    
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
      // Delete all credentials in the group
      await WalletCredentialModel.deleteMany({ groupId: id }).session(session)
      
      // Delete the group
      const result = await WalletGroupModel.deleteOne({ id }).session(session)
      
      await session.commitTransaction()
      return result.deletedCount > 0
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}

// Wallet Credential Operations
export const walletCredentialOperations = {
  // Create a new credential
  async createCredential(credentialData: Omit<WalletCredential, 'id' | 'createdAt' | 'updatedAt'>): Promise<WalletCredential> {
    await connectToDatabase()
    
    const id = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const credential = new WalletCredentialModel({
      ...credentialData,
      id
    })
    
    const savedCredential = await credential.save()
    return savedCredential.toObject()
  },

  // Get all credentials for a group
  async getCredentialsByGroupId(groupId: string): Promise<WalletCredential[]> {
    await connectToDatabase()
    
    const credentials = await WalletCredentialModel.find({ groupId }).sort({ order: 1 })
    return credentials.map(cred => cred.toObject())
  },

  // Get all credentials
  async getAllCredentials(): Promise<WalletCredential[]> {
    await connectToDatabase()
    
    const credentials = await WalletCredentialModel.find().sort({ order: 1 })
    return credentials.map(cred => cred.toObject())
  },

  // Get a single credential by ID
  async getCredentialById(id: string): Promise<WalletCredential | null> {
    await connectToDatabase()
    
    const credential = await WalletCredentialModel.findOne({ id })
    return credential ? credential.toObject() : null
  },

  // Update a credential
  async updateCredential(id: string, updateData: Partial<WalletCredential>): Promise<WalletCredential | null> {
    await connectToDatabase()
    
    const credential = await WalletCredentialModel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )
    
    return credential ? credential.toObject() : null
  },

  // Delete a credential
  async deleteCredential(id: string): Promise<boolean> {
    await connectToDatabase()
    
    const result = await WalletCredentialModel.deleteOne({ id })
    return result.deletedCount > 0
  },

  // Update credential order
  async updateCredentialOrder(credentialId: string, newOrder: number): Promise<boolean> {
    await connectToDatabase()
    
    const result = await WalletCredentialModel.updateOne(
      { id: credentialId },
      { order: newOrder, updatedAt: new Date() }
    )
    
    return result.modifiedCount > 0
  }
}

// Utility functions
export const walletUtils = {
  // Generate a unique ID
  generateId: (prefix: string = 'item'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // Validate group data
  validateGroupData: (data: any): boolean => {
    return !!(data.name && data.category)
  },

  // Validate credential data
  validateCredentialData: (data: any): boolean => {
    return !!(data.groupId && data.name && data.type && data.value !== undefined)
  },

  // Get database stats
  async getStats() {
    await connectToDatabase()
    
    const groupCount = await WalletGroupModel.countDocuments()
    const credentialCount = await WalletCredentialModel.countDocuments()
    
    return {
      groups: groupCount,
      credentials: credentialCount
    }
  }
}

export default {
  walletGroupOperations,
  walletCredentialOperations,
  walletUtils,
  connectToDatabase
} 