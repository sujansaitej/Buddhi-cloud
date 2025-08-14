'use client'

import React from 'react'
import { WorkflowTask } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TaskEditorProps {
  task: WorkflowTask
  onUpdate: (updates: Partial<WorkflowTask>) => void
}

export default function TaskEditor({ task, onUpdate }: TaskEditorProps) {
  const handleChange = (field: keyof WorkflowTask, value: any) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <Input
              value={task.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={task.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task Type</label>
            <Badge variant="outline">{task.type}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Task Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Task Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">Instructions</label>
            <Textarea
              value={task.taskInstructions}
              onChange={(e) => handleChange('taskInstructions', e.target.value)}
              placeholder="Enter detailed instructions for this task"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use {'{variableName}'} syntax to reference workflow variables
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Task Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
              <Input
                type="number"
                value={task.timeout}
                onChange={(e) => handleChange('timeout', parseInt(e.target.value))}
                min="10"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Retries</label>
              <Input
                type="number"
                value={task.maxRetries}
                onChange={(e) => handleChange('maxRetries', parseInt(e.target.value))}
                min="0"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">Dependencies</label>
            <Input
              value={(task.dependencies || []).join(', ')}
              onChange={(e) => 
                handleChange('dependencies', e.target.value.split(',').map(s => s.trim()))
              }
              placeholder="Enter task IDs separated by commas"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the IDs of tasks that must complete before this task
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 