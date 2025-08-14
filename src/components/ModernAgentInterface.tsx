'use client'

import React, { useState, useEffect } from 'react'
import { Send, Bot, User, FileText, Download, Loader2, Square, Monitor, ExternalLink, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import { useTask } from '@/context/TaskContext'
import { getAppConfig } from '@/config/automation-tasks'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTaskExecution } from '@/hooks/useTaskExecution'

export default function ModernAgentInterface() {
  const { state, dispatch, stopTask } = useTask()
  const [input, setInput] = useState('')
  const [isStopping, setIsStopping] = useState(false)
  const [showLiveBrowser, setShowLiveBrowser] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [messages, setMessages] = useState<Array<{
    id: string
    type: 'user' | 'bot' | 'system'
    content: string
    files?: any[]
  }>>([])

  const appConfig = getAppConfig()

  // Initialize task execution hook
  useTaskExecution()

  const handleStopTask = async () => {
    if (isStopping) return
    try {
      setIsStopping(true)
      await stopTask()
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: '✅ Task stopped successfully! The automation has been terminated.'
      }])
    } catch (error) {
      console.error('Failed to stop task:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: '⚠️ Failed to stop task on server, but local execution has stopped.'
      }])
    } finally {
      setIsStopping(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      // console.log('🚀 Starting automation task for:', input.trim())
      
      const response = await fetch('/api/task/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInstructions: input.trim()
        }),
      })

      if (!response.ok) throw new Error('Failed to start automation')

      const data = await response.json()
      dispatch({ type: 'START_TASK', taskId: data.taskId })

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Starting automation...'
      }])

    } catch (error) {
      console.error('Failed to start automation:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error starting the automation. Please try again.'
      }])
    }
  }

  // Auto-show live browser when available
  useEffect(() => {
    if (state.liveUrl && !showLiveBrowser) {
      setShowLiveBrowser(true)
      setIframeError(false)
    }
  }, [state.liveUrl])

  // Update messages when task completes
  useEffect(() => {
    if (state.taskStatus === 'finished' && state.executionSummary) {
      const botResponse = {
        id: (Date.now() + 2).toString(),
        type: 'bot' as const,
        content: state.executionSummary,
        files: state.generatedFiles
      }
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.type !== 'system')
        return [...filteredMessages, botResponse]
      })
    }
  }, [state.taskStatus, state.executionSummary, state.generatedFiles])

  // Update system message when steps change
  useEffect(() => {
    if (state.isRunning && state.steps.length > 0) {
      const currentStep = state.steps[state.steps.length - 1]
      const stepMessage = `Step ${currentStep.step}: ${currentStep.next_goal || 'Processing...'}`
      
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.type !== 'system')
        return [...filteredMessages, {
          id: `system-${Date.now()}`,
          type: 'system',
          content: stepMessage
        }]
      })
    }
  }, [state.steps, state.isRunning])

  const handleFileDownload = (file: any) => {
    window.open(file.url, '_blank')
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isRunning) {
        e.preventDefault()
        handleStopTask()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.isRunning])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header */}
          <div className="bg-white/90 border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Buddi Flow
                  </h1>
                  <p className="text-xs text-gray-600">AI Browser Automation Agent</p>
                </div>
              </div>
              
              {state.liveUrl && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowLiveBrowser(!showLiveBrowser)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>{showLiveBrowser ? 'Hide' : 'Show'} Browser</span>
                  </button>
                  <button
                    onClick={() => state.liveUrl && window.open(state.liveUrl, '_blank')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex h-[700px]">
            
            {/* Chat Section */}
            <div className={`flex flex-col ${showLiveBrowser ? 'w-2/5' : 'w-full'} transition-all duration-300`}>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 messages-container">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Sparkles className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Buddi Flow</h3>
                                         <p className="text-gray-600 max-w-md mx-auto mb-6 text-base leading-relaxed">
                       Your intelligent browser automation companion. Automate any web task with simple instructions.
                     </p>
                                         <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 max-w-sm mx-auto">
                       <p className="font-semibold mb-2 text-gray-700">Try asking me to:</p>
                       <div className="space-y-1.5">
                         <p className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                           <span>"Go to Amazon and search for wireless headphones"</span>
                         </p>
                         <p className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                           <span>"Visit GitHub and search for React components"</span>
                         </p>
                         <p className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                           <span>"Take a screenshot of the CNN homepage"</span>
                         </p>
                       </div>
                     </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl flex items-start space-x-3 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                          : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200'
                      }`}>
                        <div className="text-sm leading-relaxed">
                          {message.type === 'bot' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <span>{message.content}</span>
                          )}
                        </div>
                        
                        {/* Files */}
                        {message.files && message.files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs opacity-75 font-medium">Generated Files:</p>
                            {message.files.map((file) => (
                              <div key={file.id} className="flex items-center justify-between bg-white/20 rounded-lg p-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-3 h-3" />
                                  <span className="text-xs font-medium">{file.name}</span>
                                </div>
                                <button
                                  onClick={() => handleFileDownload(file)}
                                  className="text-xs bg-white/30 hover:bg-white/50 p-1.5 rounded transition-all duration-200"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Section */}
              <div className="border-t border-gray-200/50 p-6">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                                         <input
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Describe what you want me to do on the web..."
                       disabled={state.isRunning}
                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 text-base"
                     />
                  </div>
                  
                  {state.isRunning ? (
                    <button
                      type="button"
                      onClick={handleStopTask}
                      disabled={isStopping}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-red-400 disabled:to-pink-400 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-sm"
                    >
                      {isStopping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      <span className="font-medium text-sm">{isStopping ? 'Stopping...' : 'Stop'}</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim() || state.isRunning}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-sm disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span className="font-medium text-sm">Send</span>
                    </button>
                  )}
                </form>
                
                {state.isRunning && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center justify-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span>Automation is running...</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Esc</kbd> to stop</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Browser Section */}
            {showLiveBrowser && state.liveUrl && (
              <div className="w-3/5 border-l border-gray-200/50 flex flex-col">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-sm font-semibold text-gray-700">Live Browser View</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => state.liveUrl && window.open(state.liveUrl, '_blank')}
                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-white transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-100 relative">
                  {iframeError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <div className="text-center p-6">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Browser View Unavailable</h3>
                        <p className="text-gray-500 text-sm mb-4">Unable to load the live browser view.</p>
                        <button
                          onClick={() => state.liveUrl && window.open(state.liveUrl, '_blank')}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Open in New Tab
                        </button>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={state.liveUrl}
                      className="w-full h-full border-0"
                      title="Live Browser View"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                      onError={handleIframeError}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 