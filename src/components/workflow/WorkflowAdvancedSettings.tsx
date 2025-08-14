import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Settings, Globe, Monitor, Shield, Copy, Check } from 'lucide-react'

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

interface WorkflowAdvancedSettingsProps {
  settings: WorkflowSettings
  onSettingsChange: (settings: WorkflowSettings) => void
  onApplyToAllTasks: (settings: WorkflowSettings) => void
  isOpen: boolean
  onToggle: () => void
}

const MODEL_OPTIONS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { value: 'gpt-4o', label: 'GPT-4o (Balanced)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Powerful)' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Fast)' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Balanced)' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus (Powerful)' }
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

export default function WorkflowAdvancedSettings({ 
  settings, 
  onSettingsChange, 
  onApplyToAllTasks,
  isOpen, 
  onToggle 
}: WorkflowAdvancedSettingsProps) {
  const [domains, setDomains] = useState(settings.allowedDomains.join(', '))
  const [showApplied, setShowApplied] = useState(false)

  // Update domains when settings change
  useEffect(() => {
    setDomains(settings.allowedDomains.join(', '))
  }, [settings.allowedDomains])

  const handleSettingChange = (key: keyof WorkflowSettings, value: any) => {
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

  return (
    <Card className="border border-gray-200 bg-white/95 backdrop-blur-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Universal Workflow Settings</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isOpen ? "default" : "secondary"} className="text-xs">
            {isOpen ? 'Expanded' : 'Collapsed'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Universal
          </Badge>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6 border-t border-gray-200">
          {/* Header with Apply Button */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Apply to All Tasks</h4>
              <p className="text-sm text-gray-600">These settings will be applied to all tasks in the workflow</p>
            </div>
            <button
              onClick={handleApplyToAllTasks}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showApplied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Apply to All</span>
                </>
              )}
            </button>
          </div>

          {/* AI Model Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">AI Model</h4>
            </div>
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
                     {option.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Max Agent Steps</span>
              <Input
                type="number"
                value={settings.maxAgentSteps}
                onChange={(e) => handleSettingChange('maxAgentSteps', parseInt(e.target.value))}
                className="w-24"
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Viewport Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Viewport</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Width</label>
                <Input
                  type="number"
                  value={settings.viewportWidth}
                  onChange={(e) => handleSettingChange('viewportWidth', parseInt(e.target.value))}
                  className="w-full"
                  min="800"
                  max="3840"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Height</label>
                <Input
                  type="number"
                  value={settings.viewportHeight}
                  onChange={(e) => handleSettingChange('viewportHeight', parseInt(e.target.value))}
                  className="w-full"
                  min="600"
                  max="2160"
                />
              </div>
            </div>
          </div>

          {/* Proxy Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Proxy Settings</h4>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="workflow-proxy"
                checked={settings.proxy}
                onChange={(e) => handleSettingChange('proxy', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="workflow-proxy" className="text-sm text-gray-700">
                Use Proxy
              </label>
            </div>
                         {settings.proxy && (
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
             )}
          </div>

          {/* Security & Privacy */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-600" />
              <h4 className="font-medium text-gray-900">Security & Privacy</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Save Browser Data</label>
                <input
                  type="checkbox"
                  checked={settings.saveBrowserData}
                  onChange={(e) => handleSettingChange('saveBrowserData', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Public Sharing</label>
                <input
                  type="checkbox"
                  checked={settings.publicSharing}
                  onChange={(e) => handleSettingChange('publicSharing', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Ad Blocker</label>
                <input
                  type="checkbox"
                  checked={settings.adBlocker}
                  onChange={(e) => handleSettingChange('adBlocker', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Highlight Elements</label>
                <input
                  type="checkbox"
                  checked={settings.highlightElements}
                  onChange={(e) => handleSettingChange('highlightElements', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Allowed Domains */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h4 className="font-medium text-gray-900">Allowed Domains</h4>
            </div>
            <Input
              value={domains}
              onChange={(e) => handleDomainsChange(e.target.value)}
              placeholder="gmail.com, google.com (comma separated)"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Leave empty to allow all domains. Separate multiple domains with commas.
            </p>
          </div>

          {/* Browser Profile ID */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Browser Profile ID</h4>
            </div>
            <Input
              value={settings.browserProfileId || ''}
              onChange={(e) => handleSettingChange('browserProfileId', e.target.value)}
              placeholder="Enter browser profile ID (optional)"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Optional: Specify a browser profile ID for consistent browser sessions.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
} 