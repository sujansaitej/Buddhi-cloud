'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle,
  ExternalLink,
  FileText,
  Image,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useTaskUpdates, useTaskActions, useTasks, apiUtils } from '@/hooks/useApi'

interface TaskDetailsProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
}

export default function TaskDetails({ taskId, isOpen, onClose }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'live' | 'files' | 'steps' | 'recordings' | 'screenshots'>('overview')
  const [copied, setCopied] = useState<string | null>(null)
  const [recordings, setRecordings] = useState<any[]>([])
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [correctedTask, setCorrectedTask] = useState<any>(null)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  
  // Use manual refresh instead of polling to avoid constant UI updates
  const { task, loading, error, refetch } = useTaskUpdates(taskId, false) // No polling, manual refresh only
  const { stopTask, pauseTask, resumeTask, loading: actionLoading } = useTaskActions()

  // Get the correct status from tasks list to handle API inconsistencies
  const { data: tasksData } = useTasks(1, 50)
  const tasks = tasksData?.tasks || []
  const listTask = tasks.find((t: any) => t.id === taskId)

  // Correct task status if there's a mismatch with the list
  useEffect(() => {
    if (task && listTask && task.status !== listTask.status) {
      // console.log(`Status mismatch detected for task ${taskId}:`)
      // console.log(`- Details API: ${task.status}`)
      // console.log(`- List API: ${listTask.status}`)
      
      // Use the status from the list (more reliable for finished/stopped tasks)
      const corrected = { ...task, status: listTask.status }
      setCorrectedTask(corrected)
    } else if (task) {
      setCorrectedTask(task)
    }
  }, [task, listTask, taskId])

  // Handle stopped tasks specifically
  useEffect(() => {
    const currentTask = correctedTask || task
    if (currentTask) {
      // Ensure stopped tasks are displayed correctly
      if (currentTask.status === 'stopped' && listTask?.status === 'stopped') {
        // console.log(`Task ${taskId} is confirmed as stopped`)
        if (currentTask.status !== 'stopped') {
          const corrected = { ...currentTask, status: 'stopped' }
          setCorrectedTask(corrected)
        }
      }
      // Ensure finished tasks are displayed correctly
      else if (currentTask.status === 'finished' && listTask?.status === 'finished') {
        // console.log(`Task ${taskId} is confirmed as finished`)
        if (currentTask.status !== 'finished') {
          const corrected = { ...currentTask, status: 'finished' }
          setCorrectedTask(corrected)
        }
      }
    }
  }, [correctedTask, task, listTask, taskId])

  // Debug logging for button visibility and steps
  useEffect(() => {
    const currentTask = correctedTask || task
    if (currentTask) {
      // console.log(`Task ${taskId} status: ${currentTask.status}`)
      // console.log(`Should show pause button: ${currentTask.status === 'running' || currentTask.status === 'started'}`)
      // console.log(`Should show resume button: ${currentTask.status === 'paused'}`)
      
      // Debug steps data
      if (currentTask.steps) {
        // console.log(`Task ${taskId} has ${currentTask.steps.length} steps:`, currentTask.steps)
        if (currentTask.steps.length > 0) {
          // console.log(`Task ${taskId} first step structure:`, Object.keys(currentTask.steps[0]))
          // console.log(`Task ${taskId} first step data:`, currentTask.steps[0])
        }
      } else {
        // console.log(`Task ${taskId} has no steps data`)
      }
    }
  }, [correctedTask, task, taskId])

  // Load media when task is finished and media hasn't been loaded yet
  useEffect(() => {
    const currentTask = correctedTask || task
    if (currentTask?.status === 'finished' && !loadingMedia && recordings.length === 0 && screenshots.length === 0) {
      loadTaskMedia()
    }
  }, [correctedTask?.status, task?.status, taskId, loadingMedia, recordings.length, screenshots.length])

  // Also load media when task status changes to finished
  useEffect(() => {
    const currentTask = correctedTask || task
    if (currentTask?.status === 'finished' && !loadingMedia) {
      loadTaskMedia()
    }
  }, [correctedTask?.status, task?.status])

  const loadTaskMedia = async () => {
    setLoadingMedia(true)
    setMediaError(null)
    
    try {
      // console.log(`Loading media for task ${taskId}...`)
      
      // Load recordings
      const recordingsResponse = await fetch(`/api/task/media/${taskId}`)
      if (recordingsResponse.ok) {
        const recordingsData = await recordingsResponse.json()
        // Convert array of URLs to array of objects with url property
        const formattedRecordings = (recordingsData.recordings || []).map((url: string) => ({ url }))
        setRecordings(formattedRecordings)
        // console.log(`Loaded ${formattedRecordings.length} recordings`)
      } else {
        const errorData = await recordingsResponse.json()
        console.warn(`Recordings not available: ${errorData.error}`)
        // Don't set error for recordings as they might not be enabled
      }

      // Load screenshots
      const screenshotsResponse = await fetch(`/api/task/screenshots/${taskId}`)
      if (screenshotsResponse.ok) {
        const screenshotsData = await screenshotsResponse.json()
        // Convert array of URLs to array of objects with url property
        const formattedScreenshots = (screenshotsData.screenshots || []).map((url: string) => ({ url }))
        setScreenshots(formattedScreenshots)
        // console.log(`Loaded ${formattedScreenshots.length} screenshots`)
      } else {
        const errorData = await screenshotsResponse.json()
        console.warn(`Screenshots not available: ${errorData.error}`)
        // Don't set error for screenshots as they might not be enabled
      }

      // Only set error if both recordings and screenshots failed to load
      // Note: We can't use recordings.length and screenshots.length here as they're the old values
      // The error will be handled by the UI when the arrays are empty
    } catch (error) {
      console.error('Failed to load task media:', error)
      setMediaError('Failed to load media files. Please try again.')
    } finally {
      setLoadingMedia(false)
    }
  }

  if (!isOpen) return null

  const handleAction = async (action: 'stop' | 'pause' | 'resume') => {
    console.log(`[TASK_DETAILS] Starting ${action} action for task ${taskId}...`)
    try {
      switch (action) {
        case 'stop':
          console.log('[TASK_DETAILS] Calling stopTask...')
          await stopTask(taskId)
          break
        case 'pause':
          console.log('[TASK_DETAILS] Calling pauseTask...')
          await pauseTask(taskId)
          break
        case 'resume':
          console.log('[TASK_DETAILS] Calling resumeTask...')
          await resumeTask(taskId)
          break
      }
      
      console.log(`[TASK_DETAILS] ${action} action completed successfully`)
      
      // Force a refresh of task data after action
      console.log(`[TASK_DETAILS] Task ${action} completed, refreshing data...`)
      
      // Clear any cached data to force fresh fetch
      try {
        localStorage.removeItem(`task_${taskId}_details`)
        localStorage.removeItem(`task_${taskId}_lastUpdate`)
        console.log('[TASK_DETAILS] Cleared cached data')
      } catch (storageError) {
        // Ignore storage errors
      }
      
      // Add a small delay to allow the API to process the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('[TASK_DETAILS] Delay completed, refetching...')
      
      // Refetch task data
      refetch()

      // Secondary refetch to catch eventual consistency
      setTimeout(() => {
        refetch()
      }, 2000)
      
    } catch (error) {
      console.error(`[TASK_DETAILS] Failed to ${action} task:`, error)
      // Show user-friendly error message
      alert(`Failed to ${action} task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleReRun = async () => {
    const taskToUse = correctedTask || task
    if (!taskToUse) {
      alert('Task data not available. Please try again.')
      return
    }

    try {
      // Create a new task with the same parameters
      const response = await fetch('/api/task/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskToUse.task,
          llm_model: 'gpt-4o',
          use_adblock: true,
          use_proxy: true,
          proxy_country_code: 'us',
          highlight_elements: false,
          browser_viewport_width: 1280,
          browser_viewport_height: 960,
          max_agent_steps: 75,
          enable_public_share: false
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        alert(`Task re-run successfully! New task ID: ${newTask.id}`)
        onClose() // Close the details modal
      } else {
        const error = await response.json()
        alert(`Failed to re-run task: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to re-run task:', error)
      alert('Failed to re-run task')
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />
      case 'finished':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentTask = correctedTask || task
  
  if (error || !currentTask) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Task</h2>
            <p className="text-gray-600 mb-4">{error || 'Task not found'}</p>
            <div className="text-xs text-gray-500 mt-2">
              Task ID: {taskId}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {getStatusIcon(currentTask.status)}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Task {currentTask.id}</h2>
              <p className="text-sm text-gray-500">
                Status: {apiUtils.formatTaskStatus(currentTask.status)}
              </p>
            </div>
          </div>
          
                     <div className="flex items-center space-x-2">
            {/* Refresh Button */}
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Task Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Action Buttons - Only show for appropriate status */}
            {(currentTask.status === 'running' || currentTask.status === 'started') && (
               <>
                 <button
                   onClick={() => handleAction('pause')}
                   disabled={actionLoading}
                   className="px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center space-x-1"
                 >
                   <Pause className="w-4 h-4" />
                   <span>Pause</span>
                 </button>
                 <button
                   onClick={() => handleAction('stop')}
                   disabled={actionLoading}
                   className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-1"
                 >
                   <Square className="w-4 h-4" />
                   <span>Stop</span>
                 </button>
               </>
             )}
             
             {currentTask.status === 'paused' && (
               <>
                 <button
                   onClick={() => handleAction('resume')}
                   disabled={actionLoading}
                   className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-1"
                 >
                   <Play className="w-4 h-4" />
                   <span>Resume</span>
                 </button>
                 <button
                   onClick={() => handleAction('stop')}
                   disabled={actionLoading}
                   className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-1"
                 >
                   <Square className="w-4 h-4" />
                   <span>Stop</span>
                 </button>
               </>
             )}
             
             {/* Re-run button for finished/failed/stopped tasks */}
             {(currentTask.status === 'finished' || currentTask.status === 'failed' || currentTask.status === 'stopped') && (
               <button
                 onClick={() => handleReRun()}
                 disabled={actionLoading}
                 className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-1"
               >
                 <Play className="w-4 h-4" />
                 <span>Re-run</span>
               </button>
             )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'live', label: 'Live View', icon: Play },
              { id: 'files', label: 'Files', icon: FileText },
              { id: 'steps', label: 'Steps', icon: Clock },
              { id: 'recordings', label: 'Recordings', icon: Play },
              { id: 'screenshots', label: 'Screenshots', icon: Image }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Task Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{currentTask.task}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Task Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">{new Date(currentTask.created_at).toLocaleString()}</span>
                    </div>
                    {currentTask.finished_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Finished:</span>
                        <span className="text-gray-900">{new Date(currentTask.finished_at).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-900">{apiUtils.getTaskDuration(currentTask.created_at, currentTask.finished_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Steps:</span>
                      <span className="text-gray-900">{currentTask.steps?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    {currentTask.live_url && (
                      <a
                        href={currentTask.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Live Browser</span>
                      </a>
                    )}
                    {currentTask.public_share_url && (
                      <button
                        onClick={() => copyToClipboard(currentTask.public_share_url!, 'share')}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Copy Share URL</span>
                        {copied === 'share' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {currentTask.output && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Task Output</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{currentTask.output}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

                     {/* Live View Tab */}
           {activeTab === 'live' && currentTask.live_url && (
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-4">Live Browser View (Read-Only)</h3>
               <div className="bg-gray-100 rounded-lg p-4">
                 <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <p className="text-sm text-blue-700">
                     <strong>Note:</strong> This is a read-only view of the browser session. You cannot interact with the page.
                   </p>
                 </div>
                 <iframe
                   src={currentTask.live_url}
                   className="w-full h-96 border-0 rounded-lg pointer-events-none"
                   title="Live Task Execution (Read-Only)"
                   sandbox="allow-scripts allow-same-origin"
                   style={{ pointerEvents: 'none' }}
                 />
               </div>
             </div>
           )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Files</h3>
              {(currentTask.output_files && currentTask.output_files.length > 0) || 
               (currentTask.metadata && currentTask.metadata.output_files && currentTask.metadata.output_files.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(currentTask.output_files || currentTask.metadata?.output_files || []).map((fileName: string, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{fileName}</span>
                      </div>
                      <button
                        onClick={async () => {
                          setDownloadingFiles(prev => new Set(prev).add(fileName))
                          try {
                            const response = await fetch(`/api/task/files/${currentTask.id}/${fileName}`)
                            const data = await response.json()
                            
                            if (response.ok && data.download_url) {
                              // Create a temporary link to trigger download
                              const link = document.createElement('a')
                              link.href = data.download_url
                              link.download = fileName
                              link.target = '_blank'
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              
                              // Show success feedback
                              // console.log(`Download started for ${fileName}`)
                            } else {
                              // Show error message to user
                              const errorMessage = data.error || 'Failed to get download URL'
                              console.error('Download error:', errorMessage)
                              alert(`Download failed: ${errorMessage}`)
                            }
                          } catch (error) {
                            console.error('Download error:', error)
                            alert('Download failed: Network error')
                          } finally {
                            setDownloadingFiles(prev => {
                              const newSet = new Set(prev)
                              newSet.delete(fileName)
                              return newSet
                            })
                          }
                        }}
                        disabled={downloadingFiles.has(fileName)}
                        className={`flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors ${
                          downloadingFiles.has(fileName)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        {downloadingFiles.has(fileName) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No files generated yet</p>
                </div>
              )}
            </div>
          )}

                     {/* Steps Tab */}
           {activeTab === 'steps' && (
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-4">Execution Steps</h3>
               {currentTask.steps && currentTask.steps.length > 0 ? (
                 <div className="space-y-4">
                   {currentTask.steps.map((step: any, index: number) => (
                     <div key={step.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                             <span className="text-white text-sm font-medium">{step.step || step.step_number || index + 1}</span>
                           </div>
                           <div>
                             <h4 className="text-sm font-semibold text-gray-900">Step {step.step || step.step_number || index + 1}</h4>
                             {step.url && (
                               <a
                                 href={step.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                               >
                                 <ExternalLink className="w-3 h-3" />
                                 <span>View Page</span>
                               </a>
                             )}
                           </div>
                         </div>
                       </div>
                       
                       {/* Step Details - Handle multiple possible field names */}
                       {step.evaluation_previous_goal && (
                         <div className="mb-3">
                           <h5 className="text-xs font-medium text-gray-700 mb-1">Previous Goal Assessment:</h5>
                           <div className="bg-white rounded p-3 border border-gray-200">
                             <p className="text-sm text-gray-800">{step.evaluation_previous_goal}</p>
                           </div>
                         </div>
                       )}
                       
                       {step.next_goal && (
                         <div className="mb-3">
                           <h5 className="text-xs font-medium text-gray-700 mb-1">Next Goal:</h5>
                           <div className="bg-blue-50 rounded p-3 border border-blue-200">
                             <p className="text-sm text-blue-800 font-medium">{step.next_goal}</p>
                           </div>
                         </div>
                       )}
                       
                       {/* Action performed - handle different field names */}
                       {(step.action_performed || step.action || step.details || step.description) && (
                         <div className="mb-3">
                           <h5 className="text-xs font-medium text-gray-700 mb-1">Action Performed:</h5>
                           <div className="bg-green-50 rounded p-3 border border-green-200">
                             <p className="text-sm text-green-800">
                               {step.action_performed || step.action || step.details || step.description}
                             </p>
                           </div>
                         </div>
                       )}
                       
                       {/* Duration if available */}
                       {step.duration && (
                         <div className="mb-3">
                           <h5 className="text-xs font-medium text-gray-700 mb-1">Duration:</h5>
                           <div className="bg-gray-100 rounded p-2">
                             <p className="text-sm text-gray-600">{Math.round(step.duration)}ms</p>
                           </div>
                         </div>
                       )}
                       
                       {/* Error if any */}
                       {step.error && (
                         <div className="mb-3">
                           <h5 className="text-xs font-medium text-red-700 mb-1">Error:</h5>
                           <div className="bg-red-50 rounded p-3 border border-red-200">
                             <p className="text-sm text-red-800">{step.error}</p>
                           </div>
                         </div>
                       )}
                       
                       {/* URL Information */}
                       {step.url && (
                         <div className="text-xs text-gray-500">
                           <span className="font-medium">URL:</span> {step.url}
                         </div>
                       )}
                       
                       {/* Screenshot if available */}
                       {step.screenshot_url && (
                         <div className="mt-3">
                           <a
                             href={step.screenshot_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                           >
                             <Image className="w-4 h-4" />
                             <span>View Screenshot</span>
                           </a>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No steps recorded yet</p>
                   <p className="text-sm text-gray-400 mt-2">
                     Steps will appear here as the task executes
                   </p>
                   <p className="text-xs text-gray-400 mt-1">
                     Each step shows the evaluation of the previous goal and the next goal to achieve
                   </p>
                 </div>
               )}
             </div>
           )}

          {/* Recordings Tab */}
          {activeTab === 'recordings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Recordings</h3>
              {loadingMedia ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading recordings...</p>
                </div>
              ) : mediaError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-500">{mediaError}</p>
                  <button
                    onClick={loadTaskMedia}
                    className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : recordings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordings.map((recording, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Play className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Recording {index + 1}</span>
                      </div>
                      <video
                        controls
                        className="w-full h-48 object-cover rounded-lg mb-2"
                        src={recording.url}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <button
                        onClick={() => window.open(recording.url, '_blank')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
                             ) : (
                 <div className="text-center py-8">
                   <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No recordings available</p>
                   <p className="text-sm text-gray-400 mt-2">
                     Recordings are only available for completed tasks with recording enabled
                   </p>
                   <p className="text-xs text-gray-400 mt-1">
                     Make sure to enable recordings when creating tasks
                   </p>
                 </div>
               )}
            </div>
          )}

          {/* Screenshots Tab */}
          {activeTab === 'screenshots' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Screenshots</h3>
              {loadingMedia ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading screenshots...</p>
                </div>
              ) : mediaError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-500">{mediaError}</p>
                  <button
                    onClick={loadTaskMedia}
                    className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : screenshots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Screenshot {index + 1}</span>
                      </div>
                      <img
                        src={screenshot.url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <button
                        onClick={() => window.open(screenshot.url, '_blank')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
                             ) : (
                 <div className="text-center py-8">
                   <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No screenshots available</p>
                   <p className="text-sm text-gray-400 mt-2">
                     Screenshots are only available for completed tasks with screenshots enabled
                   </p>
                   <p className="text-xs text-gray-400 mt-1">
                     Make sure to enable screenshots when creating tasks
                   </p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 