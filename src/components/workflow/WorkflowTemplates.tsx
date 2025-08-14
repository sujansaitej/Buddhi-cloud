'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Download, 
  Star, 
  Clock, 
  Users, 
  Zap,
  CheckCircle,
  Play,
  FolderOpen
} from 'lucide-react'
import { WorkflowTemplate } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface WorkflowTemplatesProps {
  onTemplateSelected: (template: WorkflowTemplate) => void
  onBack: () => void
}

const SAMPLE_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Automate email tasks including login, sending, and organizing emails',
    category: 'automation',
    difficulty: 'intermediate',
    tasks: [
      {
        id: 'task1',
        name: 'Login to Email',
        description: 'Navigate to email provider and login',
        type: 'navigate',
        taskInstructions: 'Navigate to Gmail and login with provided credentials',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: ['gmail.com']
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Send Automated Reply',
        description: 'Send automated replies to specific emails',
        type: 'custom',
        taskInstructions: 'Find unread emails and send automated replies based on templates',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 15,
          allowedDomains: ['gmail.com']
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 120,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'email',
        type: 'string',
        defaultValue: '',
        description: 'Email address for login',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'password',
        type: 'string',
        defaultValue: '',
        description: 'Password for login',
        isRequired: true,
        isSecret: true
      }
    ],
    previewImage: '/templates/email-automation.png',
    estimatedTime: 300,
    tags: ['email', 'automation', 'gmail'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'data-scraping',
    name: 'E-commerce Data Scraping',
    description: 'Extract product information from e-commerce websites',
    category: 'data-extraction',
    difficulty: 'advanced',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Product Page',
        description: 'Navigate to the target e-commerce website',
        type: 'navigate',
        taskInstructions: 'Navigate to the specified e-commerce website product page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Extract Product Data',
        description: 'Extract product information from the page',
        type: 'extract',
        taskInstructions: 'Extract product name, price, description, and images from the page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'productUrl',
        type: 'string',
        defaultValue: '',
        description: 'URL of the product page to scrape',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/data-scraping.png',
    estimatedTime: 180,
    tags: ['scraping', 'e-commerce', 'data'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'form-filling',
    name: 'Contact Form Automation',
    description: 'Automatically fill and submit contact forms on multiple websites',
    category: 'form-filling',
    difficulty: 'beginner',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Contact Page',
        description: 'Navigate to the contact page of the target website',
        type: 'navigate',
        taskInstructions: 'Navigate to the contact page of the specified website',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Fill Contact Form',
        description: 'Fill out the contact form with provided information',
        type: 'type',
        taskInstructions: 'Fill out the contact form with name, email, and message',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task3',
        name: 'Submit Form',
        description: 'Submit the filled contact form',
        type: 'click',
        taskInstructions: 'Click the submit button to send the contact form',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: ['task2'],
        conditions: [],
        order: 3,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'websiteUrl',
        type: 'string',
        defaultValue: '',
        description: 'URL of the website with contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactName',
        type: 'string',
        defaultValue: '',
        description: 'Name to use in the contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactEmail',
        type: 'string',
        defaultValue: '',
        description: 'Email to use in the contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactMessage',
        type: 'string',
        defaultValue: '',
        description: 'Message to send in the contact form',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/form-filling.png',
    estimatedTime: 120,
    tags: ['forms', 'automation', 'contact'],
    author: 'Nizhal AI',
    version: '1.0'
  }
]

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'automation', label: 'Automation' },
  { value: 'data-extraction', label: 'Data Extraction' },
  { value: 'form-filling', label: 'Form Filling' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'testing', label: 'Testing' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'e-commerce', label: 'E-commerce' }
]

const DIFFICULTIES = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

export default function WorkflowTemplates({ onTemplateSelected, onBack }: WorkflowTemplatesProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/workflow/templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-blue-100 text-blue-800'
      case 'data-extraction': return 'bg-purple-100 text-purple-800'
      case 'form-filling': return 'bg-orange-100 text-orange-800'
      case 'monitoring': return 'bg-green-100 text-green-800'
      case 'testing': return 'bg-red-100 text-red-800'
      case 'social-media': return 'bg-pink-100 text-pink-800'
      case 'e-commerce': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Workflow Templates</h1>
            <p className="text-gray-600">Choose from pre-built templates to get started quickly</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
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
          <SelectTrigger className="w-48">
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
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{template.estimatedTime}s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span>{template.tasks.length} tasks</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  by {template.author} • v{template.version}
                </div>
                <Button 
                  onClick={() => onTemplateSelected(template)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
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
  )
} 
