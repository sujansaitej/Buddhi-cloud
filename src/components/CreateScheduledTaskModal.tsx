'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, Timer, Repeat, Settings, Shield, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VariableInputForm } from '@/components/workflow/VariableInputForm'

interface CreateScheduledTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (taskData: any) => Promise<void>
  defaultMode?: 'custom' | 'workflow'
  defaultWorkflowId?: string
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

export default function CreateScheduledTaskModal({
  isOpen,
  onClose,
  onSave,
  defaultMode = 'custom',
  defaultWorkflowId
}: CreateScheduledTaskModalProps) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [nextRuns, setNextRuns] = useState<string[]>([])
  const [mode, setMode] = useState<'custom' | 'workflow'>(defaultMode)
  const [workflows, setWorkflows] = useState<any[]>([])
  const [workflowsLoading, setWorkflowsLoading] = useState(false)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | ''>(defaultWorkflowId || '')
  const [variablesJson, setVariablesJson] = useState('')
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null)
  const [collectedVariables, setCollectedVariables] = useState<Record<string, any>>({})
  const [execProxy, setExecProxy] = useState(false)
  const [execProxyCountry, setExecProxyCountry] = useState('none')
  const [execHighlight, setExecHighlight] = useState(false)
  const [formData, setFormData] = useState({
    task: '',
    schedule_type: 'interval' as 'interval' | 'cron',
    interval_minutes: 60,
    cron_expression: '',
    start_at: '',
    end_at: '',
    llm_model: 'gpt-4o',
    use_adblock: true,
    use_proxy: true,
    proxy_country_code: 'us',
    highlight_elements: false,
    save_browser_data: false,
    max_agent_steps: 75,
    // Recording settings
    enable_recordings: false,
    recording_quality: 'standard' as 'standard' | 'high',
    recording_fps: 15,
    recording_resolution: '1280x960',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  // Advanced free-form inputs
  const [allowedDomains, setAllowedDomains] = useState('')
  const [includedFiles, setIncludedFiles] = useState('')
  const [secretsJson, setSecretsJson] = useState('')
  const [structuredOutputJson, setStructuredOutputJson] = useState('')
  const [metadataJson, setMetadataJson] = useState('')

  const formatLocalReadable = (localInput: string) => {
    if (!localInput) return ''
    const d = new Date(localInput)
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }

  useEffect(() => {
    // Preload workflows when entering workflow mode
    if (!isOpen) return
    if (mode !== 'workflow') return
    let mounted = true
    ;(async () => {
      try {
        setWorkflowsLoading(true)
        const res = await fetch('/api/workflow/list', { cache: 'no-store' })
        const data = await res.json()
        if (mounted && data?.success && Array.isArray(data.workflows)) {
          setWorkflows(data.workflows)
          // If defaultWorkflowId provided, ensure selected
          if (defaultWorkflowId) setSelectedWorkflowId(defaultWorkflowId)
        }
      } catch (e) {
        console.error('Failed to load workflows:', e)
      } finally {
        if (mounted) setWorkflowsLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [isOpen, mode, defaultWorkflowId])

  useEffect(() => {
    if (mode !== 'workflow') return
    const wf = workflows.find(w => w.id === selectedWorkflowId)
    setSelectedWorkflow(wf || null)
    setCollectedVariables({})
  }, [mode, workflows, selectedWorkflowId])

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

  const handlePresetChange = (preset: string) => {
    const selected = SCHEDULE_PRESETS.find(p => p.label === preset)
    if (selected) {
      if (selected.type === 'interval') {
        setFormData(prev => ({
          ...prev,
          schedule_type: 'interval',
          interval_minutes: selected.value as number,
          cron_expression: ''
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          schedule_type: 'cron',
          cron_expression: selected.value as string,
          interval_minutes: 60
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode === 'custom') {
      if (!formData.task.trim()) {
        newErrors.task = 'Task description is required'
      }
    } else {
      if (!selectedWorkflowId) {
        newErrors.selectedWorkflowId = 'Please select a workflow'
      } else if (selectedWorkflow && Array.isArray(selectedWorkflow.variables)) {
        // Validate required workflow variables
        for (const v of selectedWorkflow.variables) {
          if (v.isRequired && (collectedVariables[v.name] == null || String(collectedVariables[v.name]).trim() === '')) {
            newErrors[`var_${v.name}`] = `${v.name} is required`
          }
        }
      }
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
      newErrors.start_at = 'Start time must be in the future'
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
      if (mode === 'workflow') {
        // Build schedule payload for workflow scheduling API
        const base: any = { ...formData }
        // Dates to ISO
        const toIso = (v: any) => {
          if (!v) return undefined
          const d = new Date(v)
          return isNaN(d.getTime()) ? undefined : d.toISOString()
        }
        if (base.start_at) base.start_at = toIso(base.start_at)
        if (base.end_at) base.end_at = toIso(base.end_at)

        // Only include relevant schedule field
        if (base.schedule_type === 'interval') {
          delete base.cron_expression
        } else {
          delete base.interval_minutes
        }

        const payload = {
          workflowId: selectedWorkflowId,
          variables: Object.keys(collectedVariables).length ? collectedVariables : (variablesJson && variablesJson.trim() ? JSON.parse(variablesJson) : {}),
          executionSettings: {
            proxy: execProxy,
            proxyCountry: execProxyCountry,
            highlightElements: execHighlight
          },
          // schedule fields
          schedule_type: base.schedule_type,
          ...(base.schedule_type === 'interval' ? { interval_minutes: base.interval_minutes } : {}),
          ...(base.schedule_type === 'cron' ? { cron_expression: base.cron_expression } : {}),
          ...(base.start_at ? { start_at: base.start_at } : {}),
          ...(base.end_at ? { end_at: base.end_at } : {}),
          // forward some advanced fields if set
          llm_model: formData.llm_model,
          use_adblock: formData.use_adblock,
          use_proxy: formData.use_proxy,
          proxy_country_code: formData.proxy_country_code,
          highlight_elements: formData.highlight_elements,
          save_browser_data: formData.save_browser_data,
          browser_viewport_width: (formData as any).browser_viewport_width,
          browser_viewport_height: (formData as any).browser_viewport_height,
          max_agent_steps: formData.max_agent_steps,
          enable_public_share: (formData as any).enable_public_share,
          // recordings
          enable_recordings: (formData as any).enable_recordings,
          recording_quality: (formData as any).recording_quality,
          recording_fps: (formData as any).recording_fps,
          recording_resolution: (formData as any).recording_resolution
        }

        const res = await fetch('/api/workflow/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'Failed to schedule workflow')
        }
        onClose()
        return
      }

      const submitData: any = { ...formData }
      
      // Set default start time to now if not specified
      if (!submitData.start_at) {
        submitData.start_at = new Date().toISOString()
      }

      // Convert any string date to ISO 8601 Z
      const toIso = (v: any) => {
        if (!v) return undefined
        const d = new Date(v)
        return isNaN(d.getTime()) ? undefined : d.toISOString()
      }
      if (submitData.start_at) submitData.start_at = toIso(submitData.start_at)
      if (submitData.end_at) submitData.end_at = toIso(submitData.end_at)

      // Only include relevant schedule field
      if (submitData.schedule_type === 'interval') {
        delete (submitData as any).cron_expression
      } else {
        delete (submitData as any).interval_minutes
      }

      // Advanced arrays/objects
      if (allowedDomains && allowedDomains.trim()) {
        submitData.allowed_domains = allowedDomains.split(',').map(s => s.trim()).filter(Boolean)
      }
      if (includedFiles && includedFiles.trim()) {
        submitData.included_file_names = includedFiles.split(',').map(s => s.trim()).filter(Boolean)
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
      console.error('Error creating scheduled task:', error)
      setErrors({ submit: 'Failed to create scheduled task. Please try again.' })
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
              <CardTitle className="text-xl font-semibold">Schedule New Task</CardTitle>
              <p className="text-xs text-gray-500">Create a recurring execution for a custom task or a workflow</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Switch */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={mode === 'custom' ? 'gradient' : 'outline'}
                onClick={() => setMode('custom')}
              >
                Write Custom Task
              </Button>
              <Button
                type="button"
                variant={mode === 'workflow' ? 'gradient' : 'outline'}
                onClick={() => setMode('workflow')}
              >
                Use Existing Workflow
              </Button>
            </div>

            {/* Task Description */}
            {mode === 'custom' ? (
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
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Workflow *
                  </label>
                  <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
                    <SelectTrigger>
                      <SelectValue placeholder={workflowsLoading ? 'Loading...' : 'Choose workflow'} />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedWorkflowId && (
                    <p className="text-red-500 text-sm mt-1">{errors.selectedWorkflowId}</p>
                  )}
                </div>

                {/* Variable Cards (same UI as Execute) */}
                {selectedWorkflow && (
                  <div className="border rounded-lg p-3">
                    <VariableInputForm
                      workflow={selectedWorkflow}
                      onSubmit={() => {}}
                      onCancel={() => {}}
                      loading={false}
                      showActions={false}
                      onVariablesChange={(vars) => setCollectedVariables(vars)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Proxy</span>
                    <Button type="button" size="sm" variant={execProxy ? 'gradient' : 'outline'} onClick={() => setExecProxy(!execProxy)}>
                      {execProxy ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proxy Country</label>
                    <Select value={execProxyCountry} onValueChange={setExecProxyCountry}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {PROXY_COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Highlight Elements</span>
                    <Button type="button" size="sm" variant={execHighlight ? 'gradient' : 'outline'} onClick={() => setExecHighlight(!execHighlight)}>
                      {execHighlight ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
                <Select onValueChange={handlePresetChange}>
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
                <div className="grid grid-cols-2 gap-3">
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
                        value={formData.max_agent_steps}
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
                        variant={formData.enable_recordings ? 'gradient' : 'outline'}
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
                {isSubmitting ? 'Creating...' : 'Schedule Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

