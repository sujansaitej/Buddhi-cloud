'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import PageHeader from '@/components/PageHeader'
import { useUser } from '@/contexts/UserContext'
import { useSettings } from '@/contexts/SettingsContext'
import { WorkflowTemplate } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Star, 
  Clock, 
  Zap,
  FolderOpen,
  Search,
  Download,
  Filter,
  Database,
  FileText,
  Eye,
  TestTube,
  Share2,
  ShoppingCart,
  Mail
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'automation', label: 'Automation' },
  { value: 'data-extraction', label: 'Data Extraction' },
  { value: 'form-filling', label: 'Form Filling' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'testing', label: 'Testing' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'email', label: 'Email' }
]

const DIFFICULTIES = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

export default function TemplatesPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isUsingTemplate, setIsUsingTemplate] = useState<string | null>(null)
  const { updateUiDensity } = useSettings() as any
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('uiDensity') as any) || 'comfortable' } catch { return 'comfortable' }
  })
  const [quickView, setQuickView] = useState<WorkflowTemplate | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, selectedDifficulty])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/templates?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchTemplates()
  }

  const handleUseTemplate = async (template: WorkflowTemplate) => {
    try {
      setIsUsingTemplate(template.id)
      
      const response = await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'user' })
      })

      if (response.ok) {
        // Directly navigate by template id so the workflow page loads and converts it
        window.location.href = `/workflows?template=${template.id}`
      }
    } catch (error) {
      console.error('Error using template:', error)
    } finally {
      setIsUsingTemplate(null)
    }
  }

  // Persist density across app
  useEffect(() => {
    try { localStorage.setItem('uiDensity', density) } catch {}
  }, [density])

  const cardPadding = density === 'compact' ? 'p-4' : 'p-6'
  const gridGap = density === 'compact' ? 'gap-3' : 'gap-4'

  const filteredTemplates = templates.filter(template => {
    if (searchTerm) {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      if (!matchesSearch) return false
    }
    
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false
    }
    
    if (selectedDifficulty !== 'all' && template.difficulty !== selectedDifficulty) {
      return false
    }
    
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-300 text-green-900 border-green-400 font-medium'
      case 'intermediate': return 'bg-yellow-300 text-yellow-900 border-yellow-400 font-medium'
      case 'advanced': return 'bg-red-300 text-red-900 border-red-400 font-medium'
      default: return 'bg-gray-300 text-gray-900 border-gray-400 font-medium'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automation': return <Zap className="w-8 h-8 text-white" />
      case 'data-extraction': return <Database className="w-8 h-8 text-white" />
      case 'form-filling': return <FileText className="w-8 h-8 text-white" />
      case 'monitoring': return <Eye className="w-8 h-8 text-white" />
      case 'testing': return <TestTube className="w-8 h-8 text-white" />
      case 'social-media': return <Share2 className="w-8 h-8 text-white" />
      case 'e-commerce': return <ShoppingCart className="w-8 h-8 text-white" />
      case 'email': return <Mail className="w-8 h-8 text-white" />
      default: return <FileText className="w-8 h-8 text-white" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-blue-300 text-blue-900 border-blue-400 font-medium'
      case 'data-extraction': return 'bg-purple-300 text-purple-900 border-purple-400 font-medium'
      case 'form-filling': return 'bg-orange-300 text-orange-900 border-orange-400 font-medium'
      case 'monitoring': return 'bg-green-300 text-green-900 border-green-400 font-medium'
      case 'testing': return 'bg-red-300 text-red-900 border-red-400 font-medium'
      case 'social-media': return 'bg-pink-300 text-pink-900 border-pink-400 font-medium'
      case 'e-commerce': return 'bg-indigo-300 text-indigo-900 border-indigo-400 font-medium'
      case 'email': return 'bg-cyan-300 text-cyan-900 border-cyan-400 font-medium'
      default: return 'bg-gray-300 text-gray-900 border-gray-400 font-medium'
    }
  }

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
    <>
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage="templates"
        onNavigate={(page) => router.push(`/${page}`)}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Templates"
          subtitle="Pre-built automation workflows"
          icon={<Zap className="w-5 h-5 text-white" />}
          actions={(
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
          )}
        />
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4">
          <div className="space-y-4">

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10 pointer-events-none" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-48 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSearch}
                    variant="outline"
                    className="flex items-center gap-2 h-10 px-5 bg-white border-gray-200 hover:bg-gray-50 rounded-lg"
                  >
                    <Filter className="w-5 h-5" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading templates...</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridGap}`}>
                {filteredTemplates.map((template) => (
                  <div key={template.id} className={`group relative bg-white border border-gray-200 rounded-2xl ${cardPadding} hover:shadow-lg transition-[box-shadow,transform] duration-200 overflow-hidden`}>
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                             <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                               {getCategoryIcon(template.category)}
                             </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                              {template.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{template.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${getCategoryColor(template.category)} rounded-full px-3 py-1 text-xs`}>
                          {template.category}
                        </Badge>
                        <Badge className={`${getDifficultyColor(template.difficulty)} rounded-full px-3 py-1 text-xs`}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{template.estimatedTime}s</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{template.tasks.length} tasks</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-gray-50/80 border-gray-200">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50/80 border-gray-200">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                       <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          by {template.author} • v{template.version}
                        </div>
                        <Button 
                          onClick={() => handleUseTemplate(template)}
                          size="sm"
                          disabled={isUsingTemplate === template.id}
                          variant="gradient"
                          className="px-4"
                        >
                          {isUsingTemplate === template.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Use Template
                            </>
                          )}
                        </Button>
                      </div>
                       <div className="mt-2">
                         <button
                           className="text-xs text-indigo-600 hover:text-indigo-800"
                           onClick={() => setQuickView(template)}
                           aria-label="Quick view"
                         >Quick view</button>
                       </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}

            {filteredTemplates.length === 0 && !isLoading && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    {quickView && (
      <div className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true" onClick={() => setQuickView(null)}>
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e)=>e.stopPropagation()}>
          <div className="p-5 border-b border-gray-200 flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
              {getCategoryIcon(quickView.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{quickView.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getCategoryColor(quickView.category)} rounded-full px-3 py-1 text-xs`}>{quickView.category}</Badge>
                <Badge className={`${getDifficultyColor(quickView.difficulty)} rounded-full px-3 py-1 text-xs`}>{quickView.difficulty}</Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {quickView.estimatedTime}s</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3" /> {quickView.tasks.length} tasks</span>
              </div>
            </div>
            <button onClick={()=>setQuickView(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">×</button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">{quickView.description}</p>
            {quickView.variables && quickView.variables.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Inputs</h4>
                <div className="flex flex-wrap gap-2">
                  {quickView.variables.map((v:any) => (
                    <Badge key={v.name} variant="outline" className="text-xs bg-gray-50 border-gray-200">{v.name}</Badge>
                  ))}
                </div>
              </div>
            )}
            {quickView.tasks && quickView.tasks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Steps</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 max-h-48 overflow-y-auto">
                  {quickView.tasks.slice(0, 12).map((t:any, i:number) => (
                    <li key={i} className="truncate" title={t.action || t.name}>{t.name || t.action || 'Step'}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-gray-200 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={()=>setQuickView(null)}>Close</Button>
            <Button variant="gradient" onClick={()=>{ handleUseTemplate(quickView); setQuickView(null) }}>
              <Download className="w-4 h-4 mr-2" /> Use Template
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
} 