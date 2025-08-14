'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Monitor,
  Shield,
  Globe,
  Database,
  Palette,
  Bell,
  Clock,
  Zap,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, DollarSign, TrendingUp, Play } from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import { useBalance } from '@/hooks/useApi'
import { useTasks } from '@/hooks/useApi'
import AutomationHealthDashboard from '@/components/AutomationHealthDashboard'
import RecentAlerts from '@/components/RecentAlerts'
import AutomationPerformance from '@/components/AutomationPerformance'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import ToastContainer, { Toast } from '@/components/ui/toast'

interface GlobalSettings {
  // Task Settings
  defaultModel: string
  defaultSaveBrowserData: boolean
  defaultAdBlocker: boolean
  defaultProxy: boolean
  defaultProxyCountry: string
  defaultHighlightElements: boolean
  defaultMaxAgentSteps: number
  defaultViewportWidth: number
  defaultViewportHeight: number
  
  // Workflow Settings
  defaultWorkflowSettings: {
    enablePublicSharing: boolean
    enableRecordings: boolean
    enableScreenshots: boolean
    defaultAllowedDomains: string[]
  }
  
  // Scheduled Task Settings
  defaultScheduleSettings: {
    enableNotifications: boolean
    defaultRetryCount: number
    defaultTimeout: number
  }
  
  // UI Settings
  uiSettings: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    dateFormat: string
  }
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: boolean
    slackNotifications: boolean
    webhookUrl: string
  }
}

export default function SettingsPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { data: balance, loading: balanceLoading, refreshBalance } = useBalance()
  const { data: tasksData, loading: tasksLoading } = useTasks(1, 6)
  const [settings, setSettings] = useState<GlobalSettings>({
    // Task Settings
    defaultModel: 'gpt-4o',
    defaultSaveBrowserData: false,
    defaultAdBlocker: true,
    defaultProxy: false,
    defaultProxyCountry: 'us',
    defaultHighlightElements: false,
    defaultMaxAgentSteps: 50,
    defaultViewportWidth: 1280,
    defaultViewportHeight: 960,
    
    // Workflow Settings
    defaultWorkflowSettings: {
      enablePublicSharing: false,
      enableRecordings: true,
      enableScreenshots: true,
      defaultAllowedDomains: []
    },
    
    // Scheduled Task Settings
    defaultScheduleSettings: {
      enableNotifications: true,
      defaultRetryCount: 3,
      defaultTimeout: 300
    },
    
    // UI Settings
    uiSettings: {
      theme: 'auto',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    
    // Notification Settings
    notificationSettings: {
      emailNotifications: false,
      slackNotifications: false,
      webhookUrl: ''
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [expanded, setExpanded] = useState<{ health: boolean; alerts: boolean; performance: boolean }>({
    health: false,
    alerts: false,
    performance: false
  })
  const [toasts, setToasts] = useState<Toast[]>([])

  const toggle = (key: 'health' | 'alerts' | 'performance') =>
    setExpanded(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem('settingsAnalyticsExpanded', JSON.stringify(next)) } catch {}
      return next
    })

  const addToast = ({ type, title, message, duration = 4000 }:{ type: Toast['type']; title: string; message: string; duration?: number }) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, title, message, duration }])
  }
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const setAllAnalyticsExpanded = (value: boolean) => {
    const next = { health: value, alerts: value, performance: value }
    setExpanded(next)
    try { localStorage.setItem('settingsAnalyticsExpanded', JSON.stringify(next)) } catch {}
  }

  useEffect(() => {
    loadSettings()
    try {
      const raw = localStorage.getItem('settingsAnalyticsExpanded')
      if (raw) setExpanded(prev => ({ ...prev, ...JSON.parse(raw) }))
    } catch {}
  }, [])

  const loadSettings = async () => {
    try {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('globalSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = async () => {
    try {
      setIsLoading(true)
      setSaveStatus('saving')
      
      // Save to localStorage (in a real app, this would go to an API)
      localStorage.setItem('globalSettings', JSON.stringify(settings))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
      addToast({ type: 'success', title: 'Settings saved', message: 'Your preferences were updated.' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
      addToast({ type: 'error', title: 'Save failed', message: 'Could not save your settings. Try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        defaultModel: 'gpt-4o',
        defaultSaveBrowserData: false,
        defaultAdBlocker: true,
        defaultProxy: false,
        defaultProxyCountry: 'us',
        defaultHighlightElements: false,
        defaultMaxAgentSteps: 50,
        defaultViewportWidth: 1280,
        defaultViewportHeight: 960,
        defaultWorkflowSettings: {
          enablePublicSharing: false,
          enableRecordings: true,
          enableScreenshots: true,
          defaultAllowedDomains: []
        },
        defaultScheduleSettings: {
          enableNotifications: true,
          defaultRetryCount: 3,
          defaultTimeout: 300
        },
        uiSettings: {
          theme: 'auto',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY'
        },
        notificationSettings: {
          emailNotifications: false,
          slackNotifications: false,
          webhookUrl: ''
        }
      })
    }
  }

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Sidebar currentPage="settings" onNavigate={(id:string)=>{ router.push(id==='dashboard' ? '/dashboard' : `/${id}`)}} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 py-4">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm">Configure global application settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="border-gray-200 hover:border-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={saveSettings}
                disabled={isLoading}
                variant="gradient"
                className="px-6"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
          {/* Save Status */}
          {saveStatus !== 'idle' && (
            <div className={`max-w-screen-2xl mx-auto mt-3 flex items-center gap-2 text-sm ${
              saveStatus === 'saved' ? 'text-green-600' : 
              saveStatus === 'error' ? 'text-red-600' : 'text-indigo-600'
            }`}>
              {saveStatus === 'saved' ? (
                <CheckCircle className="w-4 h-4" />
              ) : saveStatus === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
              {saveStatus === 'saved' ? 'Settings saved successfully!' : 
               saveStatus === 'error' ? 'Failed to save settings' : 'Saving settings...'}
            </div>
          )}
        </div>

        {/* Quick section nav */}
        <div className="px-3 sm:px-4 lg:px-6 pb-2">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'health', label: 'Health' },
                { id: 'alerts', label: 'Alerts' },
                { id: 'performance', label: 'Performance' },
                { id: 'task-settings', label: 'Task' },
                { id: 'workflow-settings', label: 'Workflow' },
                { id: 'schedule-settings', label: 'Schedule' },
                { id: 'ui-settings', label: 'UI' },
                { id: 'notification-settings', label: 'Notifications' }
              ].map(item => (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    const el = document.getElementById(item.id)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAllAnalyticsExpanded(true)}>Expand all</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setAllAnalyticsExpanded(false)}>Collapse all</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-w-screen-2xl mx-auto w-full px-3 sm:px-4 lg:px-6 pb-6 space-y-4">
          <div className="space-y-4">
            {/* Quick Stats (moved from Dashboard) */}
            <Card id="overview" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Overview</CardTitle>
                <p className="text-sm text-gray-600">Key usage metrics</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Tasks"
                    value={tasksData?.total_count || 0}
                    icon={Target}
                    color="blue"
                    loading={balanceLoading || tasksLoading}
                    animate
                  />
                  <StatsCard
                    title="Active Tasks"
                    value={(tasksData?.tasks || []).filter((t:any)=>t.status==='running').length}
                    icon={Play}
                    color="green"
                    loading={balanceLoading || tasksLoading}
                    animate
                  />
                  <StatsCard
                    title="Credits Left"
                    value={balance?.balance || 0}
                    icon={DollarSign}
                    color="purple"
                    loading={balanceLoading || tasksLoading}
                    onRefresh={refreshBalance}
                    animate
                  />
                  <StatsCard
                    title="Success Rate"
                    value={`${(()=>{ const tasks=(tasksData?.tasks||[]); const finished=tasks.filter((t:any)=>t.status==='finished').length; const failed=tasks.filter((t:any)=>t.status==='failed').length; const total=finished+failed; return total>0? Math.round((finished/total)*100): 0; })()}%`}
                    icon={TrendingUp}
                    color="orange"
                    loading={balanceLoading || tasksLoading}
                    animate
                  />
                </div>
              </CardContent>
            </Card>

            {/* Automation Health Dashboard (collapsible) */}
            <Card id="health" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader
                onClick={() => toggle('health')}
                aria-expanded={expanded.health}
                className="flex flex-row items-center justify-between cursor-pointer select-none"
              >
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Automation Health Dashboard
                  </CardTitle>
                  <p className="text-sm text-gray-600">System health metrics</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center">
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${expanded.health ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
              {expanded.health && (
                <CardContent>
                  <AutomationHealthDashboard className="w-full" showAlerts={false} showPerformance={false} bare />
                </CardContent>
              )}
            </Card>

            {/* Recent Alerts (collapsible) */}
            <Card id="alerts" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader
                onClick={() => toggle('alerts')}
                aria-expanded={expanded.alerts}
                className="flex flex-row items-center justify-between cursor-pointer select-none"
              >
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-600" />
                    Recent Alerts
                  </CardTitle>
                  <p className="text-sm text-gray-600">Latest warnings and notifications</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center">
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${expanded.alerts ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
              {expanded.alerts && (
                <CardContent>
                  <RecentAlerts bare />
                </CardContent>
              )}
            </Card>

            {/* Automation Performance (collapsible) */}
            <Card id="performance" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader
                onClick={() => toggle('performance')}
                aria-expanded={expanded.performance}
                className="flex flex-row items-center justify-between cursor-pointer select-none"
              >
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Automation Performance
                  </CardTitle>
                  <p className="text-sm text-gray-600">Performance insights and trends</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center">
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${expanded.performance ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
              {expanded.performance && (
                <CardContent>
                  <AutomationPerformance bare />
                </CardContent>
              )}
            </Card>
            
            {/* Task Settings */}
            <Card id="task-settings" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Task Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Default settings for new tasks</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default AI Model
                    </label>
                    <select
                      value={settings.defaultModel}
                      onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gpt-4o">GPT-4o (Recommended)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4.1">GPT-4.1</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Max Agent Steps
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultMaxAgentSteps}
                      onChange={(e) => setSettings({ ...settings, defaultMaxAgentSteps: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Viewport Width
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultViewportWidth}
                      onChange={(e) => setSettings({ ...settings, defaultViewportWidth: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Viewport Height
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultViewportHeight}
                      onChange={(e) => setSettings({ ...settings, defaultViewportHeight: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Save Browser Data</div>
                      <div className="text-xs text-gray-500">Persist cookies, storage and cache</div>
                    </div>
                    <Switch checked={settings.defaultSaveBrowserData} onCheckedChange={(v)=> setSettings({ ...settings, defaultSaveBrowserData: v })} />
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Ad Blocker</div>
                      <div className="text-xs text-gray-500">Block ads during browsing</div>
                    </div>
                    <Switch checked={settings.defaultAdBlocker} onCheckedChange={(v)=> setSettings({ ...settings, defaultAdBlocker: v })} />
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Highlight Elements</div>
                      <div className="text-xs text-gray-500">Outline interactable elements</div>
                    </div>
                    <Switch checked={settings.defaultHighlightElements} onCheckedChange={(v)=> setSettings({ ...settings, defaultHighlightElements: v })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Settings */}
            <Card id="workflow-settings" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Workflow Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Default settings for new workflows</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Enable Public Sharing</div>
                      <div className="text-xs text-gray-500">Allow sharing workflow runs</div>
                    </div>
                    <Switch
                      checked={settings.defaultWorkflowSettings.enablePublicSharing}
                      onCheckedChange={(v) => setSettings({
                        ...settings,
                        defaultWorkflowSettings: { ...settings.defaultWorkflowSettings, enablePublicSharing: v }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Enable Recordings</div>
                      <div className="text-xs text-gray-500">Capture session videos</div>
                    </div>
                    <Switch
                      checked={settings.defaultWorkflowSettings.enableRecordings}
                      onCheckedChange={(v) => setSettings({
                        ...settings,
                        defaultWorkflowSettings: { ...settings.defaultWorkflowSettings, enableRecordings: v }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Enable Screenshots</div>
                      <div className="text-xs text-gray-500">Capture step screenshots</div>
                    </div>
                    <Switch
                      checked={settings.defaultWorkflowSettings.enableScreenshots}
                      onCheckedChange={(v) => setSettings({
                        ...settings,
                        defaultWorkflowSettings: { ...settings.defaultWorkflowSettings, enableScreenshots: v }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Task Settings */}
            <Card id="schedule-settings" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Scheduled Task Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Default settings for scheduled tasks</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Retry Count
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultScheduleSettings.defaultRetryCount}
                      onChange={(e) => setSettings({
                        ...settings,
                        defaultScheduleSettings: {
                          ...settings.defaultScheduleSettings,
                          defaultRetryCount: parseInt(e.target.value)
                        }
                      })}
                      min="0"
                      max="10"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Timeout (seconds)
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultScheduleSettings.defaultTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        defaultScheduleSettings: {
                          ...settings.defaultScheduleSettings,
                          defaultTimeout: parseInt(e.target.value)
                        }
                      })}
                      min="30"
                      max="3600"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Enable Notifications</div>
                      <div className="text-xs text-gray-500">Get alerts for schedule issues</div>
                    </div>
                    <Switch
                      checked={settings.defaultScheduleSettings.enableNotifications}
                      onCheckedChange={(v) => setSettings({
                        ...settings,
                        defaultScheduleSettings: { ...settings.defaultScheduleSettings, enableNotifications: v }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UI Settings */}
            <Card id="ui-settings" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-green-600" />
                  UI Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Interface and display preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.uiSettings.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        uiSettings: {
                          ...settings.uiSettings,
                          theme: e.target.value as 'light' | 'dark' | 'auto'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="auto">Auto (System)</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.uiSettings.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        uiSettings: {
                          ...settings.uiSettings,
                          language: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.uiSettings.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        uiSettings: {
                          ...settings.uiSettings,
                          timezone: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.uiSettings.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        uiSettings: {
                          ...settings.uiSettings,
                          dateFormat: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card id="notification-settings" className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  Notification Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Configure how you receive notifications</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notificationSettings.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notificationSettings: {
                          ...settings.notificationSettings,
                          emailNotifications: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notificationSettings.slackNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notificationSettings: {
                          ...settings.notificationSettings,
                          slackNotifications: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Slack Notifications</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <Input
                    type="url"
                    value={settings.notificationSettings.webhookUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      notificationSettings: {
                        ...settings.notificationSettings,
                        webhookUrl: e.target.value
                      }
                    })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Webhook URL for custom integrations (Slack, Discord, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
