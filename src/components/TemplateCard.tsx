'use client'

import React from 'react'
import { Play, Clock, TrendingUp } from 'lucide-react'
import { Template } from '@/types'

interface TemplateCardProps {
  template: Template
  onUseTemplate: (template: Template) => void
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  business: Play,
  scraping: TrendingUp,
  social: Play,
  'e-commerce': Play
}

export default function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const CategoryIcon = categoryIcons[template.category] || Play

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Template Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <CategoryIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                {template.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{template.estimatedTime}min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Description */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {template.description}
      </p>

      {/* Template Preview */}
      {template.previewImage && (
        <div className="mb-6">
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={template.previewImage}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onUseTemplate(template)}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-md"
      >
        <Play className="w-4 h-4" />
        <span>Use Template</span>
      </button>
    </div>
  )
} 