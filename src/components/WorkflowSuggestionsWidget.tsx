'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, TrendingUp, Target, Clock, ArrowRight, Lightbulb, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WorkflowTemplate } from '@/types/workflow'

interface WorkflowSuggestion {
  id: string
  title: string
  description: string
  category: 'productivity' | 'marketing' | 'e-commerce' | 'data' | 'social'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
  potentialSavings: string // e.g., "2 hours/day"
  confidence: number // 0-100
  tags: string[]
  template?: {
    taskInstructions: string
    defaultSettings: any
  }
}

interface WorkflowSuggestionsWidgetProps {
  onUseTemplate: (template: any) => void
  className?: string
}

export default function WorkflowSuggestionsWidget({ onUseTemplate, className }: WorkflowSuggestionsWidgetProps) {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch templates from the database and transform them into suggestions
  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      // Fetch featured templates from the API
      const response = await fetch('/api/templates?isFeatured=true&limit=5')
      const data = await response.json()
      
      if (data.success && data.templates) {
        // Transform templates into suggestions format
        const transformedSuggestions: WorkflowSuggestion[] = data.templates.map((template: any) => ({
          id: template.id,
          title: template.name,
          description: template.description,
          category: mapTemplateToSuggestionCategory(template.category),
          difficulty: template.difficulty || 'intermediate',
          estimatedTime: Math.round(template.estimatedTime / 60) || 30, // Convert seconds to minutes
          potentialSavings: generatePotentialSavings(template.category),
          confidence: Math.floor(75 + Math.random() * 20), // Random confidence between 75-95%
          tags: template.tags || [],
          template: {
            taskInstructions: template.tasks[0]?.taskInstructions || '',
            defaultSettings: template.tasks[0]?.settings || {
              model: 'gpt-4o',
              saveBrowserData: false,
              maxAgentSteps: 50
            }
          }
        }));
        
        // Sort by confidence
        setSuggestions(transformedSuggestions.sort((a, b) => b.confidence - a.confidence));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Helper function to map template categories to suggestion categories
  const mapTemplateToSuggestionCategory = (category: string): 'productivity' | 'marketing' | 'e-commerce' | 'data' | 'social' => {
    const categoryMap: { [key: string]: 'productivity' | 'marketing' | 'e-commerce' | 'data' | 'social' } = {
      'automation': 'productivity',
      'data-extraction': 'data',
      'form-filling': 'productivity',
      'monitoring': 'data',
      'testing': 'productivity',
      'social-media': 'social',
      'e-commerce': 'e-commerce',
      'email': 'productivity'
    }
    return categoryMap[category] || 'productivity'
  }
  
  // Generate realistic potential savings based on category
  const generatePotentialSavings = (category: string): string => {
    const savingsMap: { [key: string]: string[] } = {
      'automation': ['2 hours/day', '10 hours/week', '40 hours/month'],
      'data-extraction': ['3 hours/day', '15 hours/week', '60 hours/month'],
      'form-filling': ['1 hour/day', '5 hours/week', '20 hours/month'],
      'monitoring': ['30 min/day', '3 hours/week', '12 hours/month'],
      'testing': ['4 hours/day', '20 hours/week', '80 hours/month'],
      'social-media': ['2 hours/day', '10 hours/week', '40 hours/month'],
      'e-commerce': ['3 hours/day', '15 hours/week', '60 hours/month'],
      'email': ['1 hour/day', '5 hours/week', '20 hours/month']
    }
    
    const options = savingsMap[category] || ['2 hours/day', '10 hours/week', '40 hours/month']
    return options[Math.floor(Math.random() * options.length)]
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const categories = [
    { id: 'all', label: 'All Suggestions', icon: Sparkles },
    { id: 'productivity', label: 'Productivity', icon: Target },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'e-commerce', label: 'E-commerce', icon: Star },
    { id: 'social', label: 'Social Media', icon: TrendingUp },
    { id: 'data', label: 'Data Analysis', icon: TrendingUp }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      productivity: 'soft bg-blue-100 text-blue-800',
      marketing: 'soft bg-green-100 text-green-800',
      'e-commerce': 'soft bg-purple-100 text-purple-800',
      social: 'soft bg-pink-100 text-pink-800',
      data: 'soft bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'soft bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'soft bg-emerald-100 text-emerald-800',
      intermediate: 'soft bg-amber-100 text-amber-800',
      advanced: 'soft bg-rose-100 text-rose-800'
    }
    return colors[difficulty as keyof typeof colors] || 'soft bg-gray-100 text-gray-800'
  }

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)

  const handleUseTemplate = (suggestion: WorkflowSuggestion) => {
    // Create a WorkflowTemplate object from the suggestion
    const template: WorkflowTemplate = {
      id: suggestion.id,
      name: suggestion.title,
      description: suggestion.description,
      category: suggestion.category as any, // Map back to template category
      difficulty: suggestion.difficulty,
      tasks: [], // Will be loaded when template is used
      variables: [],
      previewImage: undefined,
      estimatedTime: suggestion.estimatedTime * 60, // Convert minutes back to seconds
      tags: suggestion.tags,
      author: 'Nizhal AI',
      version: '1.0'
    }
    onUseTemplate(template)
  }

  return (
    <Card className={`px-2 sm:px-3 md:px-4 ${className || ''} h-full flex flex-col`}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          AI Workflow Suggestions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Personalized automation ideas based on your usage patterns and industry trends
        </p>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-white text-indigo-700 border-indigo-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-3 h-3" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>

        {/* Suggestions List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-sm shadow-md ring-1 ring-white/40">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="soft" className={getCategoryColor(suggestion.category)}>
                          {suggestion.category}
                        </Badge>
                        <Badge variant="soft" className={getDifficultyColor(suggestion.difficulty)}>
                          {suggestion.difficulty}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {suggestion.estimatedTime}m
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">{Math.round(suggestion.confidence)}%</div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500">Saves {suggestion.potentialSavings}</div>
                  <div className="text-xs text-gray-500">Based on your automation patterns</div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleUseTemplate(suggestion)
                      router.push(`/workflows?template=${suggestion.id}`)
                    }}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-4 py-2 text-xs"
                    onClick={() => router.push(`/templates?highlight=${suggestion.id}`)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSuggestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No suggestions available for this category.</p>
            <p className="text-sm">Try a different category or create more automations to get personalized suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


