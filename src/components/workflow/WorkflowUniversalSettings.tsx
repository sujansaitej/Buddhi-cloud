import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Globe, Monitor, Shield, Copy, Check, RefreshCw } from 'lucide-react'

interface WorkflowSettings {
  model: string
  maxAgentSteps: number
  viewportWidth: number
  viewportHeight: number
  saveBrowserData: boolean
  publicSharing: boolean
  adBlocker: boolean
  proxy: boolean
  proxyCountry: string
  highlightElements: boolean
  allowedDomains: string[]
  browserProfileId?: string
}

interface WorkflowUniversalSettingsProps {
  settings: WorkflowSettings
  onSettingsChange: (settings: WorkflowSettings) => void
  onApplyToAllTasks: (settings: WorkflowSettings) => void
}

const MODEL_OPTIONS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)', description: 'Fastest, most cost-effective' },
  { value: 'gpt-4o', label: 'GPT-4o (Balanced)', description: 'Good balance of speed and capability' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Powerful)', description: 'Most capable, slower' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Fast)', description: 'Fast and efficient' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Balanced)', description: 'Balanced performance' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus (Powerful)', description: 'Most powerful, slower' }
]

const PROXY_COUNTRIES = [
  { value: 'none', label: 'No Proxy' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'nl', label: 'Netherlands' }
]

export default function WorkflowUniversalSettings({ 
  settings, 
  onSettingsChange, 
  onApplyToAllTasks
}: WorkflowUniversalSettingsProps) {
  const [domains, setDomains] = useState(settings.allowedDomains.join(', '))
  const [showApplied, setShowApplied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Update domains when settings change
  useEffect(() => {
    setDomains(settings.allowedDomains.join(', '))
  }, [settings.allowedDomains])

  const handleSettingChange = (key: keyof WorkflowSettings, value: any) => {
    setHasChanges(true)
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const handleDomainsChange = (value: string) => {
    setDomains(value)
    const domainArray = value.split(',').map(d => d.trim()).filter(d => d)
    handleSettingChange('allowedDomains', domainArray)
  }

  const handleApplyToAllTasks = () => {
    const updatedSettings = {
      ...settings,
      allowedDomains: domains.split(',').map(d => d.trim()).filter(d => d)
    }
    onApplyToAllTasks(updatedSettings)
    setShowApplied(true)
    setTimeout(() => setShowApplied(false), 2000)
  }



  const handleReset = () => {
    // Reset to default settings
    const defaultSettings = {
      model: 'gpt-4o-mini',
      maxAgentSteps: 15,
      viewportWidth: 1920,
      viewportHeight: 1080,
      saveBrowserData: true,
      publicSharing: false,
      adBlocker: true,
      proxy: false,
      proxyCountry: 'none',
      highlightElements: false,
      allowedDomains: [],
      browserProfileId: ''
    }
    onSettingsChange(defaultSettings)
    setDomains('')
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Universal Workflow Settings
          </h3>
          <p className="text-gray-600 mt-2">
            These settings will be applied to all tasks in the workflow. Individual tasks can override these settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset to Defaults
          </Button>
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Unsaved changes</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Model Settings */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="w-5 h-5 text-blue-600" />
              AI Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">AI Model</label>
              <Select
                value={settings.model}
                onValueChange={(value) => handleSettingChange('model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Max Agent Steps</label>
              <Input
                type="number"
                value={settings.maxAgentSteps}
                onChange={(e) => handleSettingChange('maxAgentSteps', parseInt(e.target.value))}
                min="1"
                max="50"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of steps the AI agent can take</p>
            </div>
          </CardContent>
        </Card>

        {/* Viewport Settings */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="w-5 h-5 text-green-600" />
              Browser Viewport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Width</label>
                <Input
                  type="number"
                  value={settings.viewportWidth}
                  onChange={(e) => handleSettingChange('viewportWidth', parseInt(e.target.value))}
                  min="800"
                  max="3840"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Height</label>
                <Input
                  type="number"
                  value={settings.viewportHeight}
                  onChange={(e) => handleSettingChange('viewportHeight', parseInt(e.target.value))}
                  min="600"
                  max="2160"
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Browser window dimensions for task execution</p>
          </CardContent>
        </Card>

        {/* Proxy Settings */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-purple-600" />
              Proxy Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="workflow-proxy"
                checked={settings.proxy}
                onChange={(e) => handleSettingChange('proxy', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="workflow-proxy" className="text-sm font-medium text-gray-700">
                Use Proxy
              </label>
            </div>
            
            {settings.proxy && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Proxy Country</label>
                <Select
                  value={settings.proxyCountry}
                  onValueChange={(value) => handleSettingChange('proxyCountry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Proxy Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROXY_COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <p className="text-xs text-gray-500">Use proxy for enhanced privacy and location-based access</p>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-red-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Save Browser Data</label>
              <input
                type="checkbox"
                checked={settings.saveBrowserData}
                onChange={(e) => handleSettingChange('saveBrowserData', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Public Sharing</label>
              <input
                type="checkbox"
                checked={settings.publicSharing}
                onChange={(e) => handleSettingChange('publicSharing', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Ad Blocker</label>
              <input
                type="checkbox"
                checked={settings.adBlocker}
                onChange={(e) => handleSettingChange('adBlocker', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Highlight Elements</label>
              <input
                type="checkbox"
                checked={settings.highlightElements}
                onChange={(e) => handleSettingChange('highlightElements', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Allowed Domains */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-indigo-600" />
              Allowed Domains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={domains}
              onChange={(e) => handleDomainsChange(e.target.value)}
              placeholder="gmail.com, google.com (comma separated)"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Leave empty to allow all domains. Separate multiple domains with commas.
            </p>
          </CardContent>
        </Card>

        {/* Browser Profile ID */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="w-5 h-5 text-blue-600" />
              Browser Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={settings.browserProfileId || ''}
              onChange={(e) => handleSettingChange('browserProfileId', e.target.value)}
              placeholder="Enter browser profile ID (optional)"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Optional: Specify a browser profile ID for consistent browser sessions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Apply to All Tasks Button */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Apply to All Tasks</h4>
              <p className="text-sm text-blue-700">
                These settings will be applied to all existing and future tasks in the workflow
              </p>
            </div>
            <Button
              onClick={handleApplyToAllTasks}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {showApplied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Applied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Apply to All Tasks
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 