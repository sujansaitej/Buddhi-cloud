'use client'

import React, { useState, useEffect } from 'react'
import { X, Search, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { WalletGroup, WalletCredential } from '@/types/wallet'

interface WalletCredentialSelectorProps {
  variableName: string
  variableType: string
  onSelect: (credential: WalletCredential) => void
  onCancel: () => void
  currentValue?: string
}

export function WalletCredentialSelector({ 
  variableName, 
  variableType, 
  onSelect, 
  onCancel,
  currentValue 
}: WalletCredentialSelectorProps) {
  const [groups, setGroups] = useState<WalletGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWalletGroups()
  }, [])

  const fetchWalletGroups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/wallet/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])
      }
    } catch (error) {
      console.error('Error fetching wallet groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get relevant credentials based on variable type and name
  const getRelevantCredentials = () => {
    const allCredentials = groups.flatMap(group => 
      group.credentials.map(cred => ({ ...cred, groupName: group.name }))
    )

    return allCredentials.filter(cred => {
      // Enhanced matching logic
      const nameLower = variableName.toLowerCase()
      const credNameLower = cred.name.toLowerCase()
      const credTypeLower = cred.type.toLowerCase()
      
      // Type matching (exact match or partial match)
      const matchesType = credTypeLower === variableType.toLowerCase() ||
                         credTypeLower.includes(variableType.toLowerCase()) ||
                         variableType.toLowerCase().includes(credTypeLower)
      
      // Name matching (more flexible)
      const matchesName = credNameLower.includes(nameLower) ||
                         nameLower.includes(credNameLower) ||
                         // Check for common patterns
                         (nameLower.includes('email') && credTypeLower === 'email') ||
                         (nameLower.includes('password') && credTypeLower === 'password') ||
                         (nameLower.includes('username') && credTypeLower === 'username') ||
                         (nameLower.includes('api') && credTypeLower === 'api_key') ||
                         (nameLower.includes('token') && credTypeLower === 'token')
      
      // Search term matching
      const matchesSearch = searchTerm === '' || 
                           credNameLower.includes(searchTerm.toLowerCase()) ||
                           cred.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cred.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credTypeLower.includes(searchTerm.toLowerCase())

      // Debug logging for credential matching
      if (process.env.NODE_ENV === 'development') {
        console.log(`Credential matching for "${variableName}" (${variableType}):`, {
          credential: cred.name,
          type: cred.type,
          matchesType,
          matchesName,
          matchesSearch,
          searchTerm
        })
      }

      return (matchesType || matchesName) && matchesSearch
    }).sort((a, b) => {
      // Sort by relevance: exact type matches first, then name matches
      const aTypeMatch = a.type.toLowerCase() === variableType.toLowerCase()
      const bTypeMatch = b.type.toLowerCase() === variableType.toLowerCase()
      
      if (aTypeMatch && !bTypeMatch) return -1
      if (!aTypeMatch && bTypeMatch) return 1
      
      // Then sort by name similarity
      const aNameSimilarity = a.name.toLowerCase().includes(variableName.toLowerCase()) ? 1 : 0
      const bNameSimilarity = b.name.toLowerCase().includes(variableName.toLowerCase()) ? 1 : 0
      
      if (aNameSimilarity && !bNameSimilarity) return -1
      if (!aNameSimilarity && bNameSimilarity) return 1
      
      return 0
    })
  }

  const relevantCredentials = getRelevantCredentials()

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'username': return '👤'
      case 'email': return '📧'
      case 'password': return '🔒'
      case 'api_key': return '🔑'
      case 'token': return '🎫'
      case 'url': return '🌐'
      case 'phone': return '📱'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'username': return 'bg-blue-100 text-blue-700'
      case 'email': return 'bg-green-100 text-green-700'
      case 'password': return 'bg-red-100 text-red-700'
      case 'api_key': return 'bg-purple-100 text-purple-700'
      case 'token': return 'bg-orange-100 text-orange-700'
      case 'url': return 'bg-indigo-100 text-indigo-700'
      case 'phone': return 'bg-teal-100 text-teal-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Select from Wallet</h2>
            <p className="text-gray-600 text-sm">Choose a credential for: <span className="font-medium">{variableName}</span></p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search credentials, groups, or values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Credentials List */}
        <div className="overflow-y-auto max-h-[60vh] space-y-2">
          {relevantCredentials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No matching credentials found</p>
              <p className="text-sm">Try adjusting your search or add credentials to your wallet</p>
            </div>
          ) : (
            relevantCredentials.map(credential => (
              <div 
                key={credential.id} 
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  currentValue === credential.value ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-10 h-10 ${getTypeColor(credential.type)} rounded-lg flex items-center justify-center text-lg`}>
                    {getTypeIcon(credential.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 truncate">{credential.name}</span>
                      <Badge className={`text-xs ${getTypeColor(credential.type)}`}>
                        {credential.type}
                      </Badge>
                      <span className="text-xs text-gray-500">({credential.groupName})</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-mono text-gray-700">
                        {credential.isSecret && !showValues[credential.id] ? '••••••••' : credential.value}
                      </span>
                      {credential.isSecret && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleShowValue(credential.id)}
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                          {showValues[credential.id] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    {credential.description && (
                      <p className="text-xs text-gray-500 mt-1">{credential.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentValue === credential.value && (
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  )}
                  <Button
                    onClick={() => onSelect(credential)}
                    variant={currentValue === credential.value ? "outline" : "default"}
                    size="sm"
                  >
                    {currentValue === credential.value ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
} 