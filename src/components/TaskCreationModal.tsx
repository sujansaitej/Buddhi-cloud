'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Settings, Play, FileText, Globe, Shield, Monitor } from 'lucide-react'
import { useTaskActions } from '@/hooks/useApi'
import { apiService, BrowserProfileResponse } from '@/lib/api'

interface TaskCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated: (taskId: string) => void
  template?: {
    taskInstructions: string
    defaultSettings?: any
  }
}

export default function TaskCreationModal({ isOpen, onClose, onTaskCreated, template }: TaskCreationModalProps) {
  const [step, setStep] = useState(1)
  const [taskInstructions, setTaskInstructions] = useState(template?.taskInstructions || '')
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [browserProfiles, setBrowserProfiles] = useState<BrowserProfileResponse[]>([])
  const [settings, setSettings] = useState({
    model: 'gpt-4o',
    saveBrowserData: false,
    publicSharing: false,
    viewportWidth: 1280,
    viewportHeight: 960,
    adBlocker: true,
    proxy: true,
    proxyCountry: 'us',
    highlightElements: false,
    maxAgentSteps: 75,
    allowedDomains: [] as string[],
    browserProfileId: undefined as string | undefined,
    enableRecordings: true,
    enableScreenshots: true
  })

  const { createTask, loading, error } = useTaskActions()

  // Fetch browser profiles
  useEffect(() => {
    const fetchBrowserProfiles = async () => {
      try {
        const response = await apiService.getBrowserProfiles(1, 50)
        setBrowserProfiles(response.profiles || [])
      } catch (error) {
        console.error('Error fetching browser profiles:', error)
      }
    }

    if (isOpen) {
      fetchBrowserProfiles()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!taskInstructions.trim()) {
      return
    }

    try {
      const result = await createTask({
        task: taskInstructions,
        save_browser_data: settings.saveBrowserData,
        llm_model: settings.model,
        use_adblock: settings.adBlocker,
        use_proxy: settings.proxy,
        proxy_country_code: settings.proxyCountry,
        highlight_elements: settings.highlightElements,
        browser_viewport_width: settings.viewportWidth,
        browser_viewport_height: settings.viewportHeight,
        max_agent_steps: settings.maxAgentSteps,
        enable_public_share: settings.publicSharing,
        enable_recordings: settings.enableRecordings,
        enable_screenshots: settings.enableScreenshots,
        allowed_domains: settings.allowedDomains.length > 0 ? settings.allowedDomains : undefined,
        browser_profile_id: settings.browserProfileId
      })

      onTaskCreated(result.id)
      onClose()
      resetForm()
    } catch (err) {
      console.error('Failed to create task:', err)
      // Show error to user
      alert(`Failed to create task: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const resetForm = () => {
    setStep(1)
    setTaskInstructions('')
    setShowAdvancedSettings(false)
    setSettings({
      model: 'gpt-4o',
      saveBrowserData: false,
      publicSharing: false,
      viewportWidth: 1280,
      viewportHeight: 960,
      adBlocker: true,
      proxy: true,
      proxyCountry: 'us',
      highlightElements: false,
      maxAgentSteps: 75,
      allowedDomains: [],
      browserProfileId: undefined,
      enableRecordings: true,
      enableScreenshots: true
    })
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Task Instructions */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="taskInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Instructions
                </label>
                <textarea
                  id="taskInstructions"
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  placeholder="Describe what you want the AI agent to do (e.g., 'Go to Google and search for the latest news about AI')"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!taskInstructions.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Browser Profile and Advanced Settings */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Browser Profile Selection - Always visible */}
              <div>
                <label htmlFor="browserProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="inline w-4 h-4 mr-1" />
                  Browser Profile
                </label>
                <select
                  id="browserProfile"
                  value={settings.browserProfileId || ''}
                  onChange={(e) => setSettings({ ...settings, browserProfileId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Default Profile</option>
                  {browserProfiles.map((profile) => (
                    <option key={profile.profile_id} value={profile.profile_id}>
                      {profile.profile_name}
                      {profile.description && ` - ${profile.description}`}
                    </option>
                  ))}
                </select>
                {browserProfiles.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-1">
                    No custom profiles found. <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => window.open('/browser-profiles', '_blank')}>Create one</span> to customize browser settings.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Select a browser profile to use for this task. Browser profiles allow you to persist cookies and settings.
                  </p>
                )}
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4" />
                  <span>Advanced Settings</span>
                  {showAdvancedSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showAdvancedSettings && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  {/* AI Model */}
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                      AI Model
                    </label>
                    <select
                      id="model"
                      value={settings.model}
                      onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="gpt-4o">GPT-4o (Recommended)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4.1">GPT-4.1</option>
                      <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                    </select>
                  </div>

                  {/* Browser Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.adBlocker}
                          onChange={(e) => setSettings({ ...settings, adBlocker: e.target.checked })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Ad Blocker</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.proxy}
                          onChange={(e) => setSettings({ ...settings, proxy: e.target.checked })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Use Proxy</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.highlightElements}
                          onChange={(e) => setSettings({ ...settings, highlightElements: e.target.checked })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Highlight Elements</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.saveBrowserData}
                          onChange={(e) => setSettings({ ...settings, saveBrowserData: e.target.checked })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Save Browser Data</span>
                      </label>
                    </div>
                  </div>

                  {/* Browser Profile Selection moved to main section */}

                  {/* Proxy Country */}
                  {settings.proxy && (
                    <div>
                      <label htmlFor="proxyCountry" className="block text-sm font-medium text-gray-700 mb-2">
                        Proxy Country
                      </label>
                      <select
                        id="proxyCountry"
                        value={settings.proxyCountry}
                        onChange={(e) => setSettings({ ...settings, proxyCountry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="fr">France</option>
                        <option value="it">Italy</option>
                        <option value="jp">Japan</option>
                        <option value="au">Australia</option>
                        <option value="de">Germany</option>
                        <option value="fi">Finland</option>
                        <option value="ca">Canada</option>
                        <option value="in">India</option>
                      </select>
                    </div>
                  )}

                  {/* Viewport Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="viewportWidth" className="block text-sm font-medium text-gray-700 mb-2">
                        Viewport Width
                      </label>
                      <input
                        type="number"
                        id="viewportWidth"
                        value={settings.viewportWidth}
                        onChange={(e) => setSettings({ ...settings, viewportWidth: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="800"
                        max="1920"
                      />
                    </div>
                    <div>
                      <label htmlFor="viewportHeight" className="block text-sm font-medium text-gray-700 mb-2">
                        Viewport Height
                      </label>
                      <input
                        type="number"
                        id="viewportHeight"
                        value={settings.viewportHeight}
                        onChange={(e) => setSettings({ ...settings, viewportHeight: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="600"
                        max="1080"
                      />
                    </div>
                  </div>

                  {/* Max Agent Steps */}
                  <div>
                    <label htmlFor="maxAgentSteps" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Agent Steps
                    </label>
                    <input
                      type="number"
                      id="maxAgentSteps"
                      value={settings.maxAgentSteps}
                      onChange={(e) => setSettings({ ...settings, maxAgentSteps: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="10"
                      max="200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum number of steps the agent can take (10-200)</p>
                  </div>

                  {/* Public Sharing */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.publicSharing}
                        onChange={(e) => setSettings({ ...settings, publicSharing: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Public Sharing</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Allow others to view task execution without authentication</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 