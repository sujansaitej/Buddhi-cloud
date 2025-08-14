'use client'

import React, { useState } from 'react'
import { WorkflowTask } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Info, ChevronDown, ChevronRight, Link, Variable } from 'lucide-react'

interface TaskSettingsProps {
  task: WorkflowTask
  onUpdate: (updates: Partial<WorkflowTask>) => void
}

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

function CollapsibleSection({ title, icon, children, defaultExpanded = true }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export default function TaskSettings({ task }: TaskSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <CollapsibleSection
        title="Basic Information"
        icon={<Info className="w-4 h-4 text-blue-600" />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Task Name</label>
            <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{task.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Task Type</label>
            <Badge variant="outline" className="text-xs px-2 py-1">
              {task.type}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{task.description}</p>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium text-gray-600">Task Instructions</label>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm font-mono text-gray-800 leading-relaxed">{task.taskInstructions}</p>
            <p className="text-xs text-gray-500 mt-2">
              Use {'{variableName}'} syntax to reference workflow variables
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Basic Settings */}
      <CollapsibleSection
        title="Basic Settings"
        icon={<Settings className="w-4 h-4 text-green-600" />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Timeout (seconds)</label>
            <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{task.timeout}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Max Retries</label>
            <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{task.maxRetries}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Advanced Settings removed in favor of universal workflow settings */}



      {/* Dependencies */}
      <CollapsibleSection
        title="Dependencies"
        icon={<Link className="w-4 h-4 text-orange-600" />}
        defaultExpanded={false}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Dependencies</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              {task.dependencies && task.dependencies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {task.dependencies.map((depId, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {depId}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No dependencies</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter task IDs separated by commas. Enter the IDs of tasks that must complete before this task.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Variables */}
      <CollapsibleSection
        title="Variables"
        icon={<Variable className="w-4 h-4 text-indigo-600" />}
        defaultExpanded={false}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Task Variables</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              {task.variables && Object.keys(task.variables || {}).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(task.variables || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No variables defined</p>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
} 