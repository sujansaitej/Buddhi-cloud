export interface WalletGroup {
  id: string
  name: string
  description?: string
  category: 'social' | 'email' | 'finance' | 'work' | 'personal' | 'other'
  credentials: WalletCredential[]
  createdAt: Date
  updatedAt: Date
}

export interface WalletCredential {
  id: string
  groupId: string
  name: string
  type: 'username' | 'email' | 'password' | 'api_key' | 'token' | 'url' | 'phone' | 'custom'
  value: string
  description?: string
  isRequired: boolean
  isSecret: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export type CreateWalletGroupRequest = {
  name: string
  description?: string
  category: WalletGroup['category']
}

export type UpdateWalletGroupRequest = Partial<CreateWalletGroupRequest>

export type CreateWalletCredentialRequest = {
  groupId: string
  name: string
  type: WalletCredential['type']
  value: string
  description?: string
  isRequired: boolean
  isSecret: boolean
  order: number
}

export type UpdateWalletCredentialRequest = Partial<Omit<CreateWalletCredentialRequest, 'groupId'>>

// Legacy types for backward compatibility (to be removed)
export interface Credential {
  id: string
  name: string
  type: 'email' | 'password' | 'api_key' | 'token' | 'username' | 'url' | 'custom'
  value: string
  description?: string
  tags: string[]
  isEncrypted: boolean
  createdAt: string
  updatedAt: string
}

export interface CredentialGroup {
  id: string
  name: string
  description?: string
  credentials: Credential[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateCredentialRequest {
  name: string
  type: Credential['type']
  value: string
  description?: string
  tags?: string[]
  groupId?: string
}

export interface UpdateCredentialRequest {
  name?: string
  type?: Credential['type']
  value?: string
  description?: string
  tags?: string[]
}

export interface CreateGroupRequest {
  name: string
  description?: string
  tags?: string[]
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
  tags?: string[]
} 