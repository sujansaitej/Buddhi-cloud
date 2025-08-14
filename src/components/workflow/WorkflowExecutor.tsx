import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Workflow } from '@/types/workflow'
import { VariableInputForm } from './VariableInputForm'
import { Button } from '@/components/ui/button'
import { Play, AlertTriangle, X, Clock } from 'lucide-react'

interface WorkflowExecutorProps {
  workflow: Workflow
  onSuccess?: (taskId: string) => void
  onError?: (error: string) => void
  showScheduleButton?: boolean
  executeButtonClassName?: string
}

export function WorkflowExecutor({ workflow, onSuccess, onError, showScheduleButton = true, executeButtonClassName }: WorkflowExecutorProps) {
  const [showVariableForm, setShowVariableForm] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleExecute = async (submissionData: Record<string, any>) => {
    setExecuting(true)
    setError(null)

    // Extract variables and execution settings
    const { executionSettings, ...variables } = submissionData

    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workflowId: workflow.id, 
          variables,
          executionSettings: {
            proxy: executionSettings?.proxy || false,
            proxyCountry: executionSettings?.proxyCountry === 'none' ? '' : executionSettings?.proxyCountry || '',
            highlightElements: executionSettings?.highlightElements || false
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        onSuccess?.(data.taskId)
        
        // Call onSuccess callback with taskId
        // The parent component will handle navigation
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to execute workflow'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setExecuting(false)
      if (!error) {
        setShowVariableForm(false)
      }
    }
  }

  const handleCancel = () => {
    setShowVariableForm(false)
    setError(null)
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showVariableForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showVariableForm])

  const ModalContent = () => (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel()
        }
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Execute Workflow</h2>
                <p className="text-sm opacity-90">{workflow.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <VariableInputForm 
            workflow={workflow}
            onSubmit={handleExecute}
            onCancel={handleCancel}
            loading={executing}
          />
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Execution Failed
                  </h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {error}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-red-600 hover:bg-red-100 h-8 w-8 p-0 rounded-lg flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex gap-2 flex-wrap w-full">
      <Button
        size="sm"
        onClick={() => setShowVariableForm(true)}
        disabled={executing}
        className={`bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 rounded-lg shadow-lg font-semibold h-10 px-4 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${executeButtonClassName || ''}`}
      >
        <Play className="w-4 h-4 mr-2" />
        Execute
      </Button>
      {showScheduleButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            window.location.href = `/scheduled-tasks?workflowId=${encodeURIComponent(workflow.id)}`
          }}
          className="rounded-lg h-10 px-4"
        >
          <Clock className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      )}

      {showVariableForm && mounted && createPortal(
        <ModalContent />,
        document.body
      )}
    </div>
  )
}