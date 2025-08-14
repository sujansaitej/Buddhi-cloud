'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GlobalSettings {
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

const DEFAULT_SETTINGS: GlobalSettings = {
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
}

interface SettingsContextType {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
  updateUiDensity: (density: 'comfortable' | 'compact') => void
  resetToDefaults: () => void
  loading: boolean
  error: string | null
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uiDensity, setUiDensity] = useState<'comfortable' | 'compact'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('uiDensity')
        if (raw === 'compact' || raw === 'comfortable') return raw
      } catch {}
    }
    return 'comfortable'
  })

  // Load settings from localStorage or API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to load from API first
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.settings) {
            setSettings({ ...DEFAULT_SETTINGS, ...data.settings })
            return
          }
        }
        
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('globalSettings')
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings)
            setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
          } catch (parseError) {
            console.error('Error parsing saved settings:', parseError)
            setSettings(DEFAULT_SETTINGS)
          }
        } else {
          setSettings(DEFAULT_SETTINGS)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        setError('Failed to load settings')
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = async (updates: Partial<GlobalSettings>) => {
    try {
      const newSettings = { ...settings, ...updates }
      setSettings(newSettings)
      
      // Save to localStorage
      localStorage.setItem('globalSettings', JSON.stringify(newSettings))
      
      // Try to save to API
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        })
      } catch (apiError) {
        console.error('Failed to save settings to API:', apiError)
        // Settings are still saved locally
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setError('Failed to update settings')
    }
  }

  const updateUiDensity = (density: 'comfortable' | 'compact') => {
    setUiDensity(density)
    try { localStorage.setItem('uiDensity', density) } catch {}
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('globalSettings')
    
    // Try to reset on API
    try {
      fetch('/api/settings/reset', { method: 'POST' })
    } catch (apiError) {
      console.error('Failed to reset settings on API:', apiError)
    }
  }

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateUiDensity,
    resetToDefaults,
    loading,
    error
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
