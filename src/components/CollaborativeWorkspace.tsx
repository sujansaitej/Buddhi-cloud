'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Share2, 
  MessageSquare, 
  Eye, 
  Edit, 
  Star, 
  Clock, 
  Download,
  ThumbsUp,
  GitBranch,
  UserPlus,
  Settings,
  Crown,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  lastActive: string
  contributionsCount: number
}

interface SharedWorkflow {
  id: string
  name: string
  description: string
  category: string
  author: TeamMember
  collaborators: TeamMember[]
  isPublic: boolean
  stars: number
  downloads: number
  lastModified: string
  version: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  comments: WorkflowComment[]
}

interface WorkflowComment {
  id: string
  author: TeamMember
  content: string
  timestamp: string
  type: 'general' | 'suggestion' | 'issue'
}

interface WorkspaceStats {
  totalWorkflows: number
  activeCollaborators: number
  sharedWorkflows: number
  totalDownloads: number
}

interface CollaborativeWorkspaceProps {
  className?: string
}

export default function CollaborativeWorkspace({ className }: CollaborativeWorkspaceProps) {
  const [workflows, setWorkflows] = useState<SharedWorkflow[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<WorkspaceStats>({
    totalWorkflows: 0,
    activeCollaborators: 0,
    sharedWorkflows: 0,
    totalDownloads: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<SharedWorkflow | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [inviting, setInviting] = useState(false)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<'general' | 'suggestion' | 'issue'>('general')

  // Load data from API or local storage
  const loadData = async () => {
    try {
      // Try to load from API first
      const [workflowsResponse, membersResponse] = await Promise.all([
        fetch('/api/workflows?shared=true'),
        fetch('/api/team/members')
      ])
      
      if (workflowsResponse.ok && membersResponse.ok) {
        const workflowsData = await workflowsResponse.json()
        const membersData = await membersResponse.json()
        
        if (workflowsData.success && membersData.success) {
          setWorkflows(workflowsData.workflows || [])
          setTeamMembers(membersData.members || [])
        } else {
          // Fallback to mock data if API fails
          generateMockData()
        }
      } else {
        // Fallback to mock data if API fails
        generateMockData()
      }
    } catch (error) {
      console.error('Error loading collaborative data:', error)
      // Fallback to mock data
      generateMockData()
    }
  }

  // Mock data generation (fallback)
  const generateMockData = () => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@company.com',
        role: 'owner',
        lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        contributionsCount: 15
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        email: 'mike@company.com',
        role: 'admin',
        lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        contributionsCount: 8
      },
      {
        id: '3',
        name: 'Emily Watson',
        email: 'emily@company.com',
        role: 'editor',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        contributionsCount: 12
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@company.com',
        role: 'viewer',
        lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        contributionsCount: 3
      }
    ]

    const mockWorkflows: SharedWorkflow[] = [
      {
        id: '1',
        name: 'Lead Qualification Pipeline',
        description: 'Automated lead research and qualification process for B2B sales teams',
        category: 'Sales',
        author: mockTeamMembers[0],
        collaborators: [mockTeamMembers[1], mockTeamMembers[2]],
        isPublic: true,
        stars: 24,
        downloads: 156,
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        version: '2.1.0',
        tags: ['Lead Generation', 'Sales', 'CRM'],
        status: 'published',
        comments: [
          {
            id: '1',
            author: mockTeamMembers[1],
            content: 'Great workflow! Could we add LinkedIn profile analysis as well?',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: 'suggestion'
          }
        ]
      },
      {
        id: '2',
        name: 'E-commerce Price Monitor',
        description: 'Comprehensive price monitoring across multiple platforms with automated alerts',
        category: 'E-commerce',
        author: mockTeamMembers[2],
        collaborators: [mockTeamMembers[0]],
        isPublic: false,
        stars: 18,
        downloads: 89,
        lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        version: '1.5.2',
        tags: ['Pricing', 'Monitoring', 'E-commerce'],
        status: 'published',
        comments: []
      },
      {
        id: '3',
        name: 'Social Media Content Analyzer',
        description: 'Analyze competitor content and generate insights for social media strategy',
        category: 'Marketing',
        author: mockTeamMembers[1],
        collaborators: [mockTeamMembers[2], mockTeamMembers[3]],
        isPublic: true,
        stars: 31,
        downloads: 203,
        lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        version: '3.0.1',
        tags: ['Social Media', 'Analytics', 'Content'],
        status: 'published',
        comments: [
          {
            id: '2',
            author: mockTeamMembers[3],
            content: 'This has been incredibly useful for our marketing team!',
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            type: 'general'
          }
        ]
      }
    ]

    setTeamMembers(mockTeamMembers)
    setWorkflows(mockWorkflows)
    setStats({
      totalWorkflows: mockWorkflows.length,
      activeCollaborators: mockTeamMembers.filter(m => 
        new Date(m.lastActive).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      sharedWorkflows: mockWorkflows.filter(w => w.isPublic).length,
      totalDownloads: mockWorkflows.reduce((sum, w) => sum + w.downloads, 0)
    })
  }

  useEffect(() => {
    loadData().finally(() => {
      setLoading(false)
    })
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-500" />
      case 'admin': return <Shield className="w-3 h-3 text-blue-500" />
      case 'editor': return <Edit className="w-3 h-3 text-green-500" />
      case 'viewer': return <Eye className="w-3 h-3 text-gray-500" />
      default: return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'editor': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const handleStarWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, stars: w.stars + 1 } : w
    ))
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return
    
    setInviting(true)
    try {
      // In a real app, this would send an API request
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      })
      
      if (response.ok) {
        // Reset form and close modal
        setInviteEmail('')
        setInviteRole('viewer')
        setShowInviteModal(false)
        // Optionally refresh team members
        // await loadData()
      }
    } catch (error) {
      console.error('Error inviting member:', error)
    } finally {
      setInviting(false)
    }
  }

  const handleAddComment = async (workflowId: string) => {
    if (!newComment.trim()) return
    
    try {
      // In a real app, this would send an API request
      const response = await fetch(`/api/workflows/${workflowId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newComment, 
          type: commentType 
        })
      })
      
      if (response.ok) {
        // Add comment to local state
        const commentData = await response.json()
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? {
            ...w,
            comments: [...w.comments, commentData.comment]
          } : w
        ))
        setNewComment('')
        setCommentType('general')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const toggleComments = (workflowId: string) => {
    setShowComments(showComments === workflowId ? null : workflowId)
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Users className="w-6 h-6 mr-2 text-indigo-600" />
            Collaborative Workspace
          </CardTitle>
          <p className="text-sm text-gray-600">Collaborate on automation workflows with your team</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</p>
                </div>
                <GitBranch className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Collaborators</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCollaborators}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shared Workflows</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sharedWorkflows}</p>
                </div>
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Body rows inside the card */}
        <div className="space-y-6">
          {/* Row A: Shared workflows (full width) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="w-5 h-5 mr-2" />
                Shared Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                      </div>
                      <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center"><span>by {workflow.author.name}</span></div>
                      <div className="flex items-center"><Clock className="w-3 h-3 mr-1" />{formatTimeAgo(workflow.lastModified)}</div>
                      <div className="flex items-center"><span>v{workflow.version}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {workflow.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center"><Star className="w-4 h-4 mr-1" />{workflow.stars}</div>
                        <div className="flex items-center"><Download className="w-4 h-4 mr-1" />{workflow.downloads}</div>
                        <div className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" />{workflow.comments.length}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleStarWorkflow(workflow.id)}><Star className="w-3 h-3 mr-1" />Star</Button>
                        <Button size="sm" variant="outline" onClick={() => toggleComments(workflow.id)}><MessageSquare className="w-3 h-3 mr-1" />{workflow.comments.length} Comments</Button>
                        <Button size="sm" variant="outline"><Eye className="w-3 h-3 mr-1" />View</Button>
                      </div>
                    </div>
                    {showComments === workflow.id && (
                      <div className="mt-4 pt-4 border-top border-gray-200">
                        <div className="space-y-3 mb-3">
                          {workflow.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{comment.author.name.charAt(0)}</div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                                  <Badge variant="outline" className={`text-xs ${comment.type === 'suggestion' ? 'bg-blue-50 text-blue-700 border-blue-200' : comment.type === 'issue' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{comment.type}</Badge>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <select value={commentType} onChange={(e) => setCommentType(e.target.value as any)} className="px-2 py-1 text-xs border border-gray-300 rounded">
                              <option value="general">General</option>
                              <option value="suggestion">Suggestion</option>
                              <option value="issue">Issue</option>
                            </select>
                          </div>
                          <div className="flex space-x-2">
                            <Input placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 text-sm" />
                            <Button size="sm" onClick={() => handleAddComment(workflow.id)} disabled={!newComment.trim()}>Comment</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Row B: Team Members (full width) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2" />Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">{member.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getRoleColor(member.role)} variant="outline">{member.role}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(member.lastActive)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input 
                  type="email" 
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteEmail('')
                    setInviteRole('viewer')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleInviteMember}
                  disabled={inviting || !inviteEmail.trim()}
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}


