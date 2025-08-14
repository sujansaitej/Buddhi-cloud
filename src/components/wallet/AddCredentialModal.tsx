import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WalletGroup } from '@/types/wallet'

interface AddCredentialModalProps {
  group: WalletGroup
  onClose: () => void
  onAdd: (data: any) => void
}

export function AddCredentialModal({ group, onClose, onAdd }: AddCredentialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom' as const,
    value: '',
    description: '',
    isRequired: false,
    isSecret: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      groupId: group.id
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Credential</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Adding to: <span className="font-medium">{group.name}</span></p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credential Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Username, API Key, Password"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="api_key">API Key</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value *
            </label>
            <Input
              type={formData.isSecret ? 'password' : 'text'}
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Enter credential value"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description (optional)"
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isRequired" className="text-sm text-gray-700">
                Required
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSecret"
                checked={formData.isSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, isSecret: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isSecret" className="text-sm text-gray-700">
                Secret (hide value)
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Credential
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 