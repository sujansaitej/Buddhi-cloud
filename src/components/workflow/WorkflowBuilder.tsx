'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Save, 
  Eye,
  ArrowUp,
  ArrowDown,
  Copy,
  GripVertical,
  FileText,
  Globe
} from 'lucide-react'
import { 
  Workflow, 
  WorkflowTask, 
  TaskType, 
  TASK_TEMPLATES 
} from '@/types/workflow'
import TaskEditor from './TaskEditor'
import TaskSettings from './TaskSettings'
import TaskTypeSelector from './TaskTypeSelector'
import WorkflowAdvancedSettings from './WorkflowAdvancedSettings'
import WorkflowUniversalSettings from './WorkflowUniversalSettings'
import { getDefaultUniversalSettings, normalizeWorkflowSettings, normalizeTaskSettings } from '@/lib/workflow-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WorkflowBuilderProps {
  workflow: Workflow
  onSave: (workflow: Workflow) => void
  onPreview: (workflow: Workflow) => void
}

type SettingsTab = 'task' | 'universal'

export default function WorkflowBuilder({
  workflow,
  onSave,
  onPreview
}: WorkflowBuilderProps) {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(workflow)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [showTaskTypeSelector, setShowTaskTypeSelector] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('task')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [workflowSettings, setWorkflowSettings] = useState(() => {
    // Initialize with workflow settings if available, otherwise use defaults
    if (workflow.settings) {
      return normalizeWorkflowSettings(workflow.settings)
    }
    // Use default settings for new workflows
    return getDefaultUniversalSettings()
  })

  // Update currentWorkflow when workflow prop changes (for editing)
  useEffect(() => {
    setCurrentWorkflow(workflow)
    setSelectedTaskId(null)
    setIsEditing(false)
    
    // Sync workflowSettings with workflow.settings
    if (workflow.settings) {
      setWorkflowSettings(normalizeWorkflowSettings(workflow.settings))
    }
  }, [workflow.id, workflow.settings]) // Update when workflow ID or settings change

  const addTask = useCallback((type: TaskType, position?: number) => {
    const template = TASK_TEMPLATES[type]
    const newTask: WorkflowTask = {
      id: `task_${Date.now()}`,
      name: template.name,
      description: template.description,
      type,
      taskInstructions: template.template,
      settings: normalizeTaskSettings(workflowSettings),
      dependencies: [],
      conditions: [],
      order: position !== undefined ? position : currentWorkflow.tasks.length + 1,
      retryCount: 0,
      maxRetries: 3,
      timeout: 30,
      variables: {}
    }

    const updatedTasks = [...currentWorkflow.tasks]
    if (position !== undefined) {
      updatedTasks.splice(position, 0, newTask)
      // Update order for subsequent tasks
      for (let i = position + 1; i < updatedTasks.length; i++) {
        updatedTasks[i].order = i + 1
      }
    } else {
      updatedTasks.push(newTask)
    }

    const updatedWorkflow = {
      ...currentWorkflow,
      tasks: updatedTasks
    }

    setCurrentWorkflow(updatedWorkflow)
    setSelectedTaskId(newTask.id)
    setIsEditing(true)
    setActiveSettingsTab('task')
    setHasUnsavedChanges(true)
  }, [currentWorkflow])

  const updateTask = useCallback((taskId: string, updates: Partial<WorkflowTask>) => {
    const updatedTasks = currentWorkflow.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    )

    setCurrentWorkflow({
      ...currentWorkflow,
      tasks: updatedTasks
    })
    setHasUnsavedChanges(true)
  }, [currentWorkflow])

  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = currentWorkflow.tasks.filter(task => task.id !== taskId)
    setCurrentWorkflow({
      ...currentWorkflow,
      tasks: updatedTasks
    })
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null)
      setIsEditing(false)
    }
    setHasUnsavedChanges(true)
  }, [currentWorkflow, selectedTaskId])

  const duplicateTask = useCallback((taskId: string) => {
    const taskToDuplicate = currentWorkflow.tasks.find(task => task.id === taskId)
    if (!taskToDuplicate) return

    const duplicatedTask: WorkflowTask = {
      ...taskToDuplicate,
      id: `task_${Date.now()}`,
      name: `${taskToDuplicate.name} (Copy)`,
      order: taskToDuplicate.order + 1
    }

    const updatedTasks = [...currentWorkflow.tasks]
    const insertIndex = updatedTasks.findIndex(task => task.id === taskId) + 1
    updatedTasks.splice(insertIndex, 0, duplicatedTask)

    // Update order for subsequent tasks
    for (let i = insertIndex + 1; i < updatedTasks.length; i++) {
      updatedTasks[i].order = i + 1
    }

    setCurrentWorkflow({
      ...currentWorkflow,
      tasks: updatedTasks
    })
    setHasUnsavedChanges(true)
  }, [currentWorkflow])

  const moveTask = useCallback((fromIndex: number, toIndex: number) => {
    const updatedTasks = [...currentWorkflow.tasks]
    const [movedTask] = updatedTasks.splice(fromIndex, 1)
    updatedTasks.splice(toIndex, 0, movedTask)

    // Update order for all tasks
    updatedTasks.forEach((task, index) => {
      task.order = index + 1
    })

    setCurrentWorkflow({
      ...currentWorkflow,
      tasks: updatedTasks
    })
    setHasUnsavedChanges(true)
  }, [currentWorkflow])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== dropIndex) {
      moveTask(dragIndex, dropIndex)
    }
    setDragIndex(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Ensure universal settings are saved with the workflow
      const workflowToSave = {
        ...currentWorkflow,
        settings: normalizeWorkflowSettings({
          ...currentWorkflow.settings,
          ...workflowSettings
        })
      }
      
      console.log('Saving workflow with settings:', {
        currentWorkflowSettings: currentWorkflow.settings,
        workflowSettings: workflowSettings,
        mergedSettings: workflowToSave.settings
      })
      
      await onSave(workflowToSave)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleWorkflowSettingsChange = (settings: any) => {
    console.log('Workflow settings changed:', settings)
    setWorkflowSettings(settings)
    // Update workflow-level settings with normalized settings
    const updatedSettings = normalizeWorkflowSettings({
      ...currentWorkflow.settings,
      ...settings
    })
    
    setCurrentWorkflow({
      ...currentWorkflow,
      settings: updatedSettings
    })
    setHasUnsavedChanges(true)
    console.log('Current workflow settings updated:', updatedSettings)
  }

  const handleApplyToAllTasks = (settings: any) => {
    const updatedTasks = currentWorkflow.tasks.map(task => ({
      ...task,
      settings: normalizeTaskSettings({
        ...task.settings, 
        ...settings
      })
    }))
    
    setCurrentWorkflow({
      ...currentWorkflow,
      tasks: updatedTasks
    })
    setHasUnsavedChanges(true)
  }

  const selectedTask = currentWorkflow.tasks.find(task => task.id === selectedTaskId)

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'task':
        return selectedTask ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isEditing ? (
              <TaskEditor
                task={selectedTask}
                onUpdate={(updates) => updateTask(selectedTask.id, updates)}
              />
            ) : (
              <TaskSettings
                task={selectedTask}
                onUpdate={(updates) => updateTask(selectedTask.id, updates)}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center text-gray-500 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium mb-3">Select a Task</h3>
              <p className="text-gray-600 mb-4">
                Choose a task from the left panel to configure its settings and parameters.
              </p>
            </div>
          </div>
        )
      
      case 'universal':
        return (
          <div className="space-y-6">
            <WorkflowUniversalSettings
              settings={workflowSettings}
              onSettingsChange={handleWorkflowSettingsChange}
              onApplyToAllTasks={handleApplyToAllTasks}
            />
          </div>
        )
      

      
      default:
        return null
    }
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Left Panel - Task List */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-sm relative z-10">
        <div className="flex flex-col h-full">
          {/* Task List Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Workflow Tasks</h2>
                <p className="text-xs text-gray-600 mt-1">
                  {currentWorkflow.tasks.length} task{currentWorkflow.tasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(currentWorkflow)}
                  className="hover:bg-gray-100 text-xs h-9"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {currentWorkflow.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Add your first task to get started</p>
                  <Button
                    variant="outline"
                    onClick={() => setShowTaskTypeSelector(true)}
                    className="border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Task
                  </Button>
                </div>
              ) : (
                currentWorkflow.tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`relative p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTaskId === task.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${dragIndex === index ? 'opacity-50' : ''}`}
                    onClick={() => {
                      setSelectedTaskId(task.id)
                      setIsEditing(false)
                      setActiveSettingsTab('task')
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{task.order}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">{task.name}</h3>
                        <p className="text-xs text-gray-500 truncate mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs bg-gray-100 px-2 py-0.5">
                            {task.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateTask(task.id)
                          }}
                          className="hover:bg-gray-100 h-9 w-9 p-0"
                        >
                          <Copy className="w-5 h-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                          className="hover:bg-red-50 hover:text-red-600 h-9 w-9 p-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Task Button */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              variant="outline"
              className="w-full border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
              onClick={() => setShowTaskTypeSelector(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Settings & Configuration */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Settings Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTask ? `Task: ${selectedTask.name}` : 'Workflow Settings'}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedTask ? selectedTask.description : 'Configure workflow-wide settings and parameters'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Unsaved changes</span>
                </div>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg font-medium shadow-lg ${
                  hasUnsavedChanges 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save Workflow'}
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={activeSettingsTab === 'task' ? "default" : "outline"}
              onClick={() => setActiveSettingsTab('task')}
              className={`flex items-center gap-2 ${
                activeSettingsTab === 'task' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Task Settings
            </Button>
            <Button
              size="sm"
              variant={activeSettingsTab === 'universal' ? "default" : "outline"}
              onClick={() => setActiveSettingsTab('universal')}
              className={`flex items-center gap-2 ${
                activeSettingsTab === 'universal' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              Universal Settings
            </Button>

          </div>
        </div>
        
        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSettingsTab === 'task' && selectedTask && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : ""}
                >
                  {isEditing ? 'View Mode' : 'Edit Mode'}
                </Button>
              </div>
            </div>
          )}
          
          {renderSettingsContent()}
        </div>
      </div>

      {/* Task Type Selector Modal */}
      {showTaskTypeSelector && (
        <div className="fixed inset-0 z-50">
          <TaskTypeSelector
            isOpen={showTaskTypeSelector}
            onClose={() => setShowTaskTypeSelector(false)}
            onSelect={(type) => {
              addTask(type)
              setShowTaskTypeSelector(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
