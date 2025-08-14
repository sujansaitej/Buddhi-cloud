'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, Timer, Repeat, Settings, Shield, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScheduledTaskResponse } from '@/lib/api'

interface EditScheduledTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (taskData: any) => Promise<void>
  task: ScheduledTaskResponse
}

const LLM_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
]

const PROXY_COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fi', name: 'Finland', flag: '🇫🇮' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
]

const SCHEDULE_PRESETS = [
  { label: 'Every 15 minutes', type: 'interval', value: 15 },
  { label: 'Every 30 minutes', type: 'interval', value: 30 },
  { label: 'Every hour', type: 'interval', value: 60 },
  { label: 'Every 6 hours', type: 'interval', value: 360 },
  { label: 'Every 12 hours', type: 'interval', value: 720 },
  { label: 'Daily at 9 AM', type: 'cron', value: '0 9 * * *' },
  { label: 'Daily at 6 PM', type: 'cron', value: '0 18 * * *' },
  { label: 'Weekly on Monday', type: 'cron', value: '0 9 * * 1' },
  { label: 'Monthly on 1st', type: 'cron', value: '0 9 1 * *' },
]

export default function EditScheduledTaskModal({
  isOpen,
  onClose,
  onSave,
  task
}: EditScheduledTaskModalProps) {
  const [formData, setFormData] = useState({
    task: '',
    schedule_type: 'interval' as 'interval' | 'cron',
    interval_minutes: 60,
    cron_expression: '',
    start_at: '',
    end_at: '',
    is_active: true,
    llm_model: 'gpt-4o',
    use_adblock: true,
    use_proxy: true,
    proxy_country_code: 'us',
    highlight_elements: true,
    save_browser_data: false,
    // Recording settings
    enable_recordings: false,
    recording_quality: 'standard' as 'standard' | 'high',
    recording_fps: 15,
    recording_resolution: '1280x960',
    // Viewport & agent
    browser_viewport_width: 1280,
    browser_viewport_height: 960,
    max_agent_steps: 75,
    // Sharing
    enable_public_share: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(true)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [nextRuns, setNextRuns] = useState<string[]>([])

  const formatLocalReadable = (localInput: string) => {
    if (!localInput) return ''
    const d = new Date(localInput)
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }
  // Advanced free-form inputs
  const [allowedDomains, setAllowedDomains] = useState('')
  const [includedFiles, setIncludedFiles] = useState('')
  const [secretsJson, setSecretsJson] = useState('')
  const [structuredOutputJson, setStructuredOutputJson] = useState('')
  const [metadataJson, setMetadataJson] = useState('')

  useEffect(() => {
    if (task) {
      // Convert to local datetime format (YYYY-MM-DDTHH:mm) for input fields
      const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return ''
        // Treat provider times without timezone as UTC
        const hasTz = /Z|[+-]\d{2}:?\d{2}$/.test(dateStr)
        const isoLike = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?)$/.test(dateStr)
        const d = hasTz ? new Date(dateStr) : (isoLike ? new Date(`${dateStr}Z`) : new Date(dateStr))
        const pad = (n: number) => String(n).padStart(2, '0')
        const yyyy = d.getFullYear()
        const mm = pad(d.getMonth() + 1)
        const dd = pad(d.getDate())
        const hh = pad(d.getHours())
        const mi = pad(d.getMinutes())
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
      }

      setFormData({
        task: task.task,
        schedule_type: task.schedule_type,
        interval_minutes: task.interval_minutes || 60,
        cron_expression: task.cron_expression || '',
        start_at: formatDateForInput(task.start_at),
        end_at: formatDateForInput(task.end_at || ''),
        is_active: task.is_active,
        llm_model: task.llm_model,
        use_adblock: task.use_adblock,
        use_proxy: task.use_proxy,
        highlight_elements: (task as any).highlight_elements ?? false,
        save_browser_data: task.save_browser_data,
        enable_recordings: (task as any).enable_recordings || false,
        recording_quality: (task as any).recording_quality || 'standard',
        recording_fps: (task as any).recording_fps || 15,
        recording_resolution: (task as any).recording_resolution || '1280x960',
        proxy_country_code: (task as any).proxy_country_code || 'us',
        browser_viewport_width: (task as any).browser_viewport_width || 1280,
        browser_viewport_height: (task as any).browser_viewport_height || 960,
        max_agent_steps: (task as any).max_agent_steps || 75,
        enable_public_share: (task as any).enable_public_share || false,
      })
      // Free-form collections if present on task
      try {
        const ad = (task as any).allowed_domains
        if (Array.isArray(ad)) setAllowedDomains(ad.join(', '))
      } catch {}
      try {
        const inc = (task as any).included_file_names
        if (Array.isArray(inc)) setIncludedFiles(inc.join(', '))
      } catch {}
      try {
        const secrets = (task as any).secrets
        if (secrets && typeof secrets === 'object') setSecretsJson(JSON.stringify(secrets, null, 2))
      } catch {}
      try {
        const so = (task as any).structured_output_json
        if (typeof so === 'string') setStructuredOutputJson(so)
      } catch {}
      try {
        const md = (task as any).metadata
        if (md && typeof md === 'object') setMetadataJson(JSON.stringify(md, null, 2))
      } catch {}
      setShowAdvanced(true)
    }
  }, [task])

  // Compute next run previews for interval in Edit
  useEffect(() => {
    if (formData.schedule_type !== 'interval') { setNextRuns([]); return }
    const interval = Number(formData.interval_minutes || 0)
    const startStr = formData.start_at
    if (!interval || !startStr) { setNextRuns([]); return }
    const start = new Date(startStr)
    const now = new Date()
    let t = new Date(start)
    while (t.getTime() < now.getTime()) {
      t = new Date(t.getTime() + interval * 60_000)
    }
    const runs: string[] = []
    for (let i = 0; i < 3; i++) {
      runs.push(t.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }))
      t = new Date(t.getTime() + interval * 60_000)
    }
    setNextRuns(runs)
  }, [formData.schedule_type, formData.interval_minutes, formData.start_at])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.task.trim()) {
      newErrors.task = 'Task description is required'
    }

    if (formData.schedule_type === 'interval') {
      if (!formData.interval_minutes || formData.interval_minutes < 1) {
        newErrors.interval_minutes = 'Interval must be at least 1 minute'
      }
    } else {
      if (!formData.cron_expression.trim()) {
        newErrors.cron_expression = 'Cron expression is required'
      }
    }

    if (formData.start_at && new Date(formData.start_at) <= new Date()) {
      // Only validate if we're changing the start time to something in the past
      const originalStartTime = new Date(task.start_at)
      const newStartTime = new Date(formData.start_at)
      if (newStartTime.getTime() !== originalStartTime.getTime()) {
        newErrors.start_at = 'Start time must be in the future'
      }
    }

    if (formData.end_at && formData.start_at && new Date(formData.end_at) <= new Date(formData.start_at)) {
      newErrors.end_at = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const submitData: any = { ...formData }
      
      // Only include relevant schedule field
      if (submitData.schedule_type === 'interval') {
        delete (submitData as any).cron_expression
      } else {
        delete (submitData as any).interval_minutes
      }

      // Convert datetime-local back to ISO string
      if (submitData.start_at && typeof submitData.start_at === 'string' && submitData.start_at.length <= 16) {
        submitData.start_at = new Date(submitData.start_at).toISOString()
      }
      if (submitData.end_at && typeof submitData.end_at === 'string' && submitData.end_at.length <= 16) {
        submitData.end_at = new Date(submitData.end_at).toISOString()
      }

      // Advanced arrays/objects
      if (allowedDomains && allowedDomains.trim()) {
        submitData.allowed_domains = allowedDomains.split(',').map((s: string) => s.trim()).filter(Boolean)
      } else {
        // Explicitly clear if empty
        submitData.allowed_domains = []
      }
      if (includedFiles && includedFiles.trim()) {
        submitData.included_file_names = includedFiles.split(',').map((s: string) => s.trim()).filter(Boolean)
      }
      if (secretsJson && secretsJson.trim()) {
        try { submitData.secrets = JSON.parse(secretsJson) } catch {}
      }
      if (metadataJson && metadataJson.trim()) {
        try { submitData.metadata = JSON.parse(metadataJson) } catch {}
      }
      if (structuredOutputJson && structuredOutputJson.trim()) {
        submitData.structured_output_json = structuredOutputJson
      }

      await onSave(submitData)
    } catch (error) {
      console.error('Error updating scheduled task:', error)
      setErrors({ submit: 'Failed to update scheduled task. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-xl rounded-2xl">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 md:top-3 md:right-3 h-10 w-10 md:h-11 md:w-11 p-0 rounded-full hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm"
        >
          <X className="w-5 h-5" />
        </Button>
        <CardHeader className="space-y-0 pb-2 pr-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Edit Scheduled Task</CardTitle>
              <p className="text-xs text-gray-500">Create a recurring execution for a custom task or a workflow</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Description *
              </label>
              <Textarea
                value={formData.task}
                onChange={(e) => handleInputChange('task', e.target.value)}
                placeholder="Describe what you want the AI to do..."
                rows={4}
                className={errors.task ? 'border-red-500' : ''}
              />
              {errors.task && (
                <p className="text-red-500 text-sm mt-1">{errors.task}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Task Status</p>
                <p className="text-xs text-gray-600">Enable or disable this scheduled task</p>
              </div>
              <Button
                type="button"
                variant={formData.is_active ? "gradient" : "outline"}
                size="sm"
                onClick={() => handleInputChange('is_active', !formData.is_active)}
              >
                {formData.is_active ? 'Active' : 'Inactive'}
              </Button>
            </div>

            {/* Schedule Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Configuration
              </h3>
              <p className="text-xs text-gray-600 -mt-2">Times shown in your local timezone ({timeZone}). Choose Interval for every-X-minutes schedules, or Cron for precise times.</p>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Presets
                </label>
                <Select onValueChange={(preset) => {
                  const selected = SCHEDULE_PRESETS.find(p => p.label === preset)
                  if (!selected) return
                  if (selected.type === 'interval') {
                    handleInputChange('schedule_type', 'interval')
                    handleInputChange('interval_minutes', selected.value as number)
                    handleInputChange('cron_expression', '')
                  } else {
                    handleInputChange('schedule_type', 'cron')
                    handleInputChange('cron_expression', selected.value as string)
                    handleInputChange('interval_minutes', 60)
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a preset or configure manually" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_PRESETS.map((preset) => (
                      <SelectItem key={preset.label} value={preset.label}>
                        <span className="flex items-center">
                          {preset.type === 'interval' ? (
                            <Timer className="w-3 h-3 mr-2" />
                          ) : (
                            <Repeat className="w-3 h-3 mr-2" />
                          )}
                          {preset.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Type
                </label>
            <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.schedule_type === 'interval' ? "gradient" : "outline"}
                    onClick={() => handleInputChange('schedule_type', 'interval')}
                    className="flex items-center justify-center"
                  >
                    <Timer className="w-4 h-4 mr-2" />
                    Interval
                  </Button>
                  <Button
                    type="button"
                    variant={formData.schedule_type === 'cron' ? "gradient" : "outline"}
                    onClick={() => handleInputChange('schedule_type', 'cron')}
                    className="flex items-center justify-center"
                  >
                    <Repeat className="w-4 h-4 mr-2" />
                    Cron
                  </Button>
                </div>
              </div>

              {/* Schedule Details */}
              {formData.schedule_type === 'interval' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interval (minutes) *
                  </label>
                  <Input
                    type="number"
                    value={formData.interval_minutes}
                    onChange={(e) => handleInputChange('interval_minutes', parseInt(e.target.value) || 0)}
                    min={1}
                    placeholder="60"
                    className={errors.interval_minutes ? 'border-red-500' : ''}
                  />
                  {errors.interval_minutes && (
                    <p className="text-red-500 text-sm mt-1">{errors.interval_minutes}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Task will run every {formData.interval_minutes} minute{formData.interval_minutes !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cron Expression *
                  </label>
                  <Input
                    value={formData.cron_expression}
                    onChange={(e) => handleInputChange('cron_expression', e.target.value)}
                    placeholder="0 9 * * *"
                    className={errors.cron_expression ? 'border-red-500' : ''}
                  />
                  {errors.cron_expression && (
                    <p className="text-red-500 text-sm mt-1">{errors.cron_expression}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Format: minute hour day month weekday (e.g., "0 9 * * *" = daily at 9 AM)
                  </p>
                </div>
              )}

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.start_at}
                    onChange={(e) => handleInputChange('start_at', e.target.value)}
                    className={errors.start_at ? 'border-red-500' : ''}
                  />
                  {errors.start_at && (
                    <p className="text-red-500 text-xs mt-1">{errors.start_at}</p>
                  )}
                  {!errors.start_at && (
                    <p className="text-xs text-gray-600 mt-1">This is saved as UTC on the server. Local: {formatLocalReadable(formData.start_at)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.end_at}
                    onChange={(e) => handleInputChange('end_at', e.target.value)}
                    className={errors.end_at ? 'border-red-500' : ''}
                  />
                  {errors.end_at && (
                    <p className="text-red-500 text-xs mt-1">{errors.end_at}</p>
                  )}
                  {!errors.end_at && (
                    <p className="text-xs text-gray-600 mt-1">{formData.end_at ? `Local: ${formatLocalReadable(formData.end_at)}` : 'Leave empty to run indefinitely.'}</p>
                  )}
                </div>
              </div>

              {formData.schedule_type === 'interval' && nextRuns.length > 0 && (
                <div className="text-xs text-gray-700">
                  <span className="font-medium">Next runs:</span> {nextRuns.join(' • ')}
                </div>
              )}
            </div>

            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Task Settings</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Model
                </label>
                <Select value={formData.llm_model} onValueChange={(value) => handleInputChange('llm_model', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LLM_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showAdvanced && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  {/* Browser Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm font-medium">Ad Blocker</span>
                      </div>
                      <Button
                        type="button"
                        variant={formData.use_adblock ? "gradient" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('use_adblock', !formData.use_adblock)}
                      >
                        {formData.use_adblock ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe2 className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm font-medium">Proxy</span>
                      </div>
                      <Button
                        type="button"
                        variant={formData.use_proxy ? "gradient" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('use_proxy', !formData.use_proxy)}
                      >
                        {formData.use_proxy ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    {formData.use_proxy && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proxy Country
                        </label>
                        <Select 
                          value={formData.proxy_country_code} 
                          onValueChange={(value) => handleInputChange('proxy_country_code', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROXY_COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center">
                                  <span className="mr-2">{country.flag}</span>
                                  {country.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Viewport */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Viewport Width</label>
                        <Input
                          type="number"
                          value={(formData as any).browser_viewport_width || 1280}
                          onChange={(e) => handleInputChange('browser_viewport_width', parseInt(e.target.value) || 1280)}
                          min={320}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Viewport Height</label>
                        <Input
                          type="number"
                          value={(formData as any).browser_viewport_height || 960}
                          onChange={(e) => handleInputChange('browser_viewport_height', parseInt(e.target.value) || 960)}
                          min={240}
                        />
                      </div>
                    </div>

                    {/* Highlight Elements */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm font-medium">Highlight Elements</span>
                      </div>
                      <Button
                        type="button"
                        variant={formData.highlight_elements ? "gradient" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('highlight_elements', !formData.highlight_elements)}
                      >
                        {formData.highlight_elements ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm font-medium">Save Browser Data</span>
                      </div>
                      <Button
                        type="button"
                        variant={formData.save_browser_data ? "gradient" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('save_browser_data', !formData.save_browser_data)}
                      >
                        {formData.save_browser_data ? 'Yes' : 'No'}
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Agent Steps
                      </label>
                      <Input
                        type="number"
                        value={(formData as any).max_agent_steps}
                        onChange={(e) => handleInputChange('max_agent_steps', parseInt(e.target.value) || 75)}
                        min={1}
                        max={200}
                      />
                    </div>
                  </div>

                  {/* Recording */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Recording</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Enable Recordings</span>
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.enable_recordings ? 'default' : 'outline'}
                        onClick={() => handleInputChange('enable_recordings', !formData.enable_recordings)}
                      >
                        {formData.enable_recordings ? 'On' : 'Off'}
                      </Button>
                    </div>
                    {formData.enable_recordings && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Quality</label>
                          <Select value={(formData as any).recording_quality || 'standard'} onValueChange={(v) => handleInputChange('recording_quality', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">FPS</label>
                          <Input type="number" value={(formData as any).recording_fps || 15} onChange={(e) => handleInputChange('recording_fps', parseInt(e.target.value) || 15)} min={1} max={60} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Resolution</label>
                          <Input value={(formData as any).recording_resolution || '1280x960'} onChange={(e) => handleInputChange('recording_resolution', e.target.value)} placeholder="1280x960" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sharing */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Enable Public Share</span>
                    <Button type="button" size="sm" variant={(formData as any).enable_public_share ? 'gradient' : 'outline'} onClick={() => handleInputChange('enable_public_share', !(formData as any).enable_public_share)}>
                      {(formData as any).enable_public_share ? 'On' : 'Off'}
                    </Button>
                  </div>

                  {/* Structured Output */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Structured Output JSON (optional)</label>
                    <Textarea rows={4} value={structuredOutputJson} onChange={(e) => setStructuredOutputJson(e.target.value)} placeholder='{"type":"object","properties":{...}}' className={errors.structured_output_json ? 'border-red-500' : ''} />
                    {errors.structured_output_json && <p className="text-red-500 text-xs mt-1">{errors.structured_output_json}</p>}
                  </div>

                  {/* Allowed Domains & Files */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Domains (comma separated)</label>
                      <Input value={allowedDomains} onChange={(e) => setAllowedDomains(e.target.value)} placeholder="example.com, *.site.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Included Files (comma separated)</label>
                      <Input value={includedFiles} onChange={(e) => setIncludedFiles(e.target.value)} placeholder="file1.txt, data.csv" />
                    </div>
                  </div>

                  {/* Secrets & Metadata */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secrets JSON (optional)</label>
                      <Textarea rows={4} value={secretsJson} onChange={(e) => setSecretsJson(e.target.value)} placeholder='{"apiKey":"..."}' className={errors.secretsJson ? 'border-red-500' : ''} />
                      {errors.secretsJson && <p className="text-red-500 text-xs mt-1">{errors.secretsJson}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Metadata JSON (optional)</label>
                      <Textarea rows={4} value={metadataJson} onChange={(e) => setMetadataJson(e.target.value)} placeholder='{"campaign":"q4","team":"growth"}' className={errors.metadataJson ? 'border-red-500' : ''} />
                      {errors.metadataJson && <p className="text-red-500 text-xs mt-1">{errors.metadataJson}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Errors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="gradient"
                className="px-6"
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


