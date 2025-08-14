'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Copy, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  X,
  Key,
  Mail,
  Lock,
  Globe,
  User,
  
  Shield,
  CreditCard,
  Smartphone,
  Database,
  ShieldCheck,
  KeyRound
} from 'lucide-react'
import { WalletGroup, WalletCredential } from '@/types/wallet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Sidebar from '@/components/Sidebar'
import PageHeader from '@/components/PageHeader'
import { AddGroupModal } from '@/components/wallet/AddGroupModal'
import { EditGroupModal } from '@/components/wallet/EditGroupModal'
import { EditCredentialModal } from '@/components/wallet/EditCredentialModal'
import { AddCredentialModal } from '@/components/wallet/AddCredentialModal'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
 

export default function WalletPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [groups, setGroups] = useState<WalletGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'updated'>('name')
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [showAddCredential, setShowAddCredential] = useState<WalletGroup | null>(null)
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  const [editingGroup, setEditingGroup] = useState<WalletGroup | null>(null)
  const [editingCredential, setEditingCredential] = useState<WalletCredential | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/wallet/groups')
      if (response.ok) {
        const data = await response.json()
        const newGroups: WalletGroup[] = data.groups || []
        setGroups(newGroups)
        setExpandedGroupId(prev => newGroups.some(g => g.id === prev) ? prev : null)
      } else {
        setGroups([])
        setExpandedGroupId(null)
      }
    } catch (error) {
      console.error('Error fetching wallet groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

  const handleAddGroup = async (groupData: any) => {
    try {
      const response = await fetch('/api/wallet/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      })

      if (response.ok) {
        await fetchGroups()
        setShowAddGroup(false)
      }
    } catch (error) {
      console.error('Error adding wallet group:', error)
    }
  }

  const handleUpdateGroup = async (id: string, updateData: any) => {
    try {
      const response = await fetch('/api/wallet/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      if (response.ok) {
        await fetchGroups()
        setEditingGroup(null)
      }
    } catch (error) {
      console.error('Error updating wallet group:', error)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group and all its credentials?')) {
      return
    }

    try {
      const response = await fetch('/api/wallet/groups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        await fetchGroups()
      }
    } catch (error) {
      console.error('Error deleting wallet group:', error)
    }
  }

  const handleAddCredential = async (credentialData: any) => {
    try {
      const response = await fetch('/api/wallet/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialData)
      })

      if (response.ok) {
        await fetchGroups()
        setShowAddCredential(null)
      }
    } catch (error) {
      console.error('Error adding credential:', error)
    }
  }

  const handleUpdateCredential = async (id: string, updateData: any) => {
    try {
      const response = await fetch('/api/wallet/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      if (response.ok) {
        await fetchGroups()
        setEditingCredential(null)
      }
    } catch (error) {
      console.error('Error updating credential:', error)
    }
  }

  const handleDeleteCredential = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) {
      return
    }

    try {
      console.log('Attempting to delete credential with ID:', id)
      const response = await fetch('/api/wallet/credentials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      console.log('Delete response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Delete successful:', result)
        await fetchGroups()
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        alert(`Failed to delete credential: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting credential:', error)
      alert('Failed to delete credential. Please try again.')
    }
  }

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroupId(prev => (prev === groupId ? null : groupId))
  }

  const getTypeIcon = (type: string) => {
    const iconClass = 'w-5 h-5 text-white'
    switch (type) {
      case 'username': return <User className={iconClass} />
      case 'email': return <Mail className={iconClass} />
      case 'password': return <Lock className={iconClass} />
      case 'api_key': return <KeyRound className={iconClass} />
      case 'token': return <ShieldCheck className={iconClass} />
      case 'url': return <Globe className={iconClass} />
      case 'phone': return <Smartphone className={iconClass} />
      default: return <Database className={iconClass} />
    }
  }

  const getTypeColor = (type: string) => {
    // Modern, brand-aligned gradients with subtle ring for contrast
    switch (type) {
      case 'username': return 'bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white ring-1 ring-white/40'
      case 'email': return 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white ring-1 ring-white/40'
      case 'password': return 'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white ring-1 ring-white/40'
      case 'api_key': return 'bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white ring-1 ring-white/40'
      case 'token': return 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white ring-1 ring-white/40'
      case 'url': return 'bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 text-white ring-1 ring-white/40'
      case 'phone': return 'bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 text-white ring-1 ring-white/40'
      default: return 'bg-gradient-to-br from-gray-200 to-gray-300 text-white ring-1 ring-white/40'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social': return 'border-l-blue-500 bg-blue-50'
      case 'email': return 'border-l-green-500 bg-green-50'
      case 'finance': return 'border-l-purple-500 bg-purple-50'
      case 'work': return 'border-l-orange-500 bg-orange-50'
      case 'personal': return 'border-l-pink-500 bg-pink-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return <User className="w-8 h-8 text-white" />
      case 'email': return <Mail className="w-8 h-8 text-white" />
      case 'finance': return <CreditCard className="w-8 h-8 text-white" />
      case 'work': return <Database className="w-8 h-8 text-white" />
      case 'personal': return <Shield className="w-8 h-8 text-white" />
      default: return <Key className="w-8 h-8 text-white" />
    }
  }

  const filteredGroups = groups.filter(group => {
    const groupName = (group.name || '').toLowerCase()
    const groupDesc = (group.description || '').toLowerCase()
    const term = (searchTerm || '').toLowerCase()
    const creds = group.credentials || []
    const matchesSearch = groupName.includes(term) ||
      groupDesc.includes(term) ||
      creds.some(cred => {
        const credName = (cred.name || '').toLowerCase()
        const credValue = (cred.value || '').toLowerCase()
        return credName.includes(term) || credValue.includes(term)
      })
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory
    // Type filter applies to credentials existence
    const matchesType = selectedType === 'all' || (group.credentials || []).some(c => c.type === selectedType)
    return matchesSearch && matchesCategory && matchesType
  }).sort((a,b)=> sortBy==='name' ? a.name.localeCompare(b.name) : (new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime()))

  const categories = Array.from(new Set(groups.map(g => g.category)))

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="wallet" onNavigate={(page) => {
        if (page === 'wallet') return
        router.push(`/${page}`)
      }} user={user} />
      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Credential Wallet"
          subtitle="Securely manage your credentials"
          icon={<Key className="w-5 h-5 text-white" />}
          actions={(
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden" role="group" aria-label="Density">
                <button
                  onClick={() => setDensity('comfortable')}
                  className={`px-3 py-2 text-xs ${density==='comfortable' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-pressed={density==='comfortable'}
                >Comfortable</button>
                <button
                  onClick={() => setDensity('compact')}
                  className={`px-3 py-2 text-xs border-l border-gray-200 ${density==='compact' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-pressed={density==='compact'}
                >Compact</button>
              </div>
              <Button 
                onClick={() => setShowAddGroup(true)}
                variant="gradient"
                className="px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </div>
          )}
        />

        {/* Search and Filters */}
        <div className={`max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 ${density==='compact' ? 'text-[13px]' : ''}`}>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10 pointer-events-none" />
                  <Input
                    placeholder="Search groups and credentials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all duration-200"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40 h-10 bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all duration-200">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48 h-10 bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all duration-200">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {['username','email','password','api_key','token','url','phone'].map(t => (
                      <SelectItem key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g, (s)=>s.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v:any)=> setSortBy(v)}>
                  <SelectTrigger className="w-full sm:w-40 h-10 bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all duration-200">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort: Name</SelectItem>
                    <SelectItem value="updated">Sort: Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 ${density==='compact' ? 'space-y-3' : ''}`}>
          {/* Wallet Groups */}
          <div>
                         {filteredGroups.length === 0 ? (
               <Card className="bg-white shadow-sm border border-gray-200">
                 <CardContent className="p-8 text-center">
                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Key className="w-6 h-6 text-indigo-600" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No wallet groups found</h3>
                   <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                     {searchTerm || selectedCategory !== 'all'
                       ? 'Try adjusting your filters to find what you\'re looking for'
                       : 'Get started by creating your first wallet group to organize your credentials'
                     }
                   </p>
                   {!searchTerm && selectedCategory === 'all' && (
                     <Button 
                       onClick={() => setShowAddGroup(true)}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                     >
                       <Plus className="w-4 h-4 mr-2" />
                       Create First Group
                     </Button>
                   )}
                 </CardContent>
               </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroups.map((group, index) => {
                  const groupKey = String(group.id || (group as any)._id || index)
                  const isExpanded = expandedGroupId === groupKey
                  const hasCredentials = group.credentials.length > 0

                  return (
                    <div key={groupKey} className={`relative group rounded-2xl p-4 border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}>
                      {/* Decorative background */}
                      <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
                      {/* Card Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                              <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg ring-2 ring-white/20">
                                {getCategoryIcon(group.category)}
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                              {group.description && (
                                <p className="text-gray-600 text-sm">{group.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-indigo-500 text-white border-indigo-600 font-semibold capitalize text-xs">
                              {group.category}
                            </Badge>
                            <Badge className="bg-purple-500 text-white border-purple-600 font-semibold text-xs">
                              {group.credentials.length}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleGroupExpansion(groupKey)}
                              className="hover:bg-gray-100 rounded-lg transition-all duration-200 h-10 w-10 p-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingGroup(group)}
                              className="hover:bg-gray-100 rounded-lg transition-all duration-200 h-10 w-10 p-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 h-10 w-10 p-0 focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="space-y-3 animate-fade-in-up">
                            {hasCredentials ? (
                              group.credentials.map(credential => (
                                <div key={credential.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className={`w-12 h-12 ${getTypeColor(credential.type)} rounded-xl flex items-center justify-center shadow-md`}> 
                                        {getTypeIcon(credential.type)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-semibold text-gray-900 text-sm">{credential.name}</span>
                                          {credential.isRequired && (
                                            <Badge className="bg-red-500 text-white border-red-600 font-semibold text-xs">Required</Badge>
                                          )}
                                          {credential.isSecret && (
                                            <Badge className="bg-orange-500 text-white border-orange-600 font-semibold text-xs">Secret</Badge>
                                          )}
                                        </div>
                                        {credential.description && (
                                          <p className="text-xs text-gray-600 mt-1">{credential.description}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-200/50 max-w-[50%] md:max-w-[60%]">
                                        <span className="text-xs font-mono text-gray-700 truncate">
                                          {credential.isSecret && !showValues[credential.id] ? '••••••••' : credential.value}
                                        </span>
                                        {credential.isSecret && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleShowValue(credential.id)}
                                            className="h-6 w-6 p-0 hover:bg-gray-200 rounded transition-all duration-200"
                                          >
                                            {showValues[credential.id] ? (
                                              <EyeOff className="w-4 h-4" />
                                            ) : (
                                              <Eye className="w-4 h-4" />
                                            )}
                                          </Button>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(credential.value || '', credential.id)}
                                        className="h-9 w-9 p-0 hover:bg-gray-100 rounded transition-all duration-200"
                                        disabled={!credential.value}
                                        title={credential.value ? 'Copy value' : 'No value to copy'}
                                      >
                                        {copiedId === credential.id ? (
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingCredential(credential)}
                                        className="h-9 w-9 p-0 hover:bg-gray-100 rounded transition-all duration-200"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteCredential(credential.id)}
                                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No credentials in this group yet</p>
                              </div>
                            )}

                            <div className="pt-1">
                              <Button
                                onClick={() => setShowAddCredential(group)}
                                variant="gradient"
                                className="w-full py-2 rounded-lg text-sm"
                              >
                                <Plus className="w-3 h-3 mr-2" />
                                Add Credential
                              </Button>
                            </div>
                          </div>
                        )}
                        {/* Wallet-like footer detail */}
                        <div className="mt-3 text-[10px] uppercase tracking-widest text-gray-400">
                          ID •••• {group.id.slice(-4)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddGroup && (
          <AddGroupModal
            onClose={() => setShowAddGroup(false)}
            onAdd={handleAddGroup}
          />
        )}

        {editingGroup && (
          <EditGroupModal
            group={editingGroup}
            onClose={() => setEditingGroup(null)}
            onUpdate={handleUpdateGroup}
          />
        )}

        {showAddCredential && (
          <AddCredentialModal
            group={showAddCredential}
            onClose={() => setShowAddCredential(null)}
            onAdd={handleAddCredential}
          />
        )}

        {editingCredential && (
          <EditCredentialModal
            credential={editingCredential}
            onClose={() => setEditingCredential(null)}
            onUpdate={handleUpdateCredential}
          />
        )}
      </div>
    </div>
  )
} 