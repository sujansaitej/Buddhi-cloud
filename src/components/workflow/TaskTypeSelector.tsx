'use client'

import React, { useState } from 'react'
import { X, Search, Play, MousePointer, Type, Download, Upload, Camera, Clock, Code, Database, FileText, Globe, Settings } from 'lucide-react'
import { TaskType, TASK_TEMPLATES } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TaskTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: TaskType) => void
}

const TASK_TYPE_ICONS: Record<TaskType, React.ComponentType<any>> = {
  navigate: Globe,
  click: MousePointer,
  type: Type,
  extract: Database,
  wait: Clock,
  condition: Settings,
  loop: Play,
  'api-call': Code,
  'file-upload': Upload,
  'file-download': Download,
  screenshot: Camera,
  custom: Code
}

const TASK_TYPE_CATEGORIES = [
  {
    name: 'Navigation & Interaction',
    types: ['navigate', 'click', 'type'] as TaskType[]
  },
  {
    name: 'Data & Files',
    types: ['extract', 'file-upload', 'file-download'] as TaskType[]
  },
  {
    name: 'Control & Logic',
    types: ['wait', 'condition', 'loop'] as TaskType[]
  },
  {
    name: 'Advanced',
    types: ['api-call', 'screenshot', 'custom'] as TaskType[]
  }
]

export default function TaskTypeSelector({ isOpen, onClose, onSelect }: TaskTypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const filteredTypes = Object.entries(TASK_TEMPLATES).filter(([type, template]) => {
    const matchesSearch = type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSelect = (type: TaskType) => {
    onSelect(type)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
            <p className="text-sm text-gray-600">Select the type of task you want to add to your workflow</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search task types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Task Types Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {searchTerm ? (
            // Search Results
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTypes.map(([type, template]) => {
                const IconComponent = TASK_TYPE_ICONS[type as TaskType]
                return (
                  <Card
                    key={type}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-purple-300"
                    onClick={() => handleSelect(type as TaskType)}
                  >
                    <CardContent className="p-5 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2 text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{template.description}</p>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {type}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            // Categorized View
            <div className="space-y-6">
              {TASK_TYPE_CATEGORIES.map((category) => (
                <div key={category.name}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.types.map((type) => {
                      const template = TASK_TEMPLATES[type]
                      const IconComponent = TASK_TYPE_ICONS[type]
                      return (
                        <Card
                          key={type}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-purple-300"
                          onClick={() => handleSelect(type)}
                        >
                          <CardContent className="p-5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-3">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2 text-sm">{template.name}</h3>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{template.description}</p>
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              {type}
                            </Badge>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm && filteredTypes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No task types found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {searchTerm ? `${filteredTypes.length} task types found` : 'Select a task type to add to your workflow'}
            </p>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 