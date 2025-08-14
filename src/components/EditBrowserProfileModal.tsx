'use client'

import React, { useState, useEffect } from 'react'
import { X, Monitor, Shield, Globe2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BrowserProfileResponse } from '@/lib/api'

interface EditBrowserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => Promise<void>
  profile: BrowserProfileResponse
}

const PROXY_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
]

const VIEWPORT_PRESETS = [
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'Desktop (1280x960)', width: 1280, height: 960 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile (375x667)', width: 375, height: 667 },
  { name: 'Custom', width: 0, height: 0 },
]

export default function EditBrowserProfileModal({
  isOpen,
  onClose,
  onSave,
  profile
}: EditBrowserProfileModalProps) {
  const [formData, setFormData] = useState({
    profile_name: '',
    description: '',
    persist: true,
    ad_blocker: true,
    proxy: true,
    proxy_country_code: 'US',
    browser_viewport_width: 1280,
    browser_viewport_height: 960,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (profile) {
      setFormData({
        profile_name: profile.profile_name,
        description: profile.description || '',
        persist: profile.persist,
        ad_blocker: profile.ad_blocker,
        proxy: profile.proxy,
        proxy_country_code: profile.proxy_country_code,
        browser_viewport_width: profile.browser_viewport_width,
        browser_viewport_height: profile.browser_viewport_height,
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleViewportPresetChange = (preset: string) => {
    const selected = VIEWPORT_PRESETS.find(p => p.name === preset)
    if (selected && selected.width > 0) {
      setFormData(prev => ({
        ...prev,
        browser_viewport_width: selected.width,
        browser_viewport_height: selected.height
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.profile_name.trim()) {
      newErrors.profile_name = 'Profile name is required'
    }

    if (formData.browser_viewport_width < 320 || formData.browser_viewport_width > 3840) {
      newErrors.browser_viewport_width = 'Width must be between 320 and 3840 pixels'
    }

    if (formData.browser_viewport_height < 240 || formData.browser_viewport_height > 2160) {
      newErrors.browser_viewport_height = 'Height must be between 240 and 2160 pixels'
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
      const payload: any = { ...formData }
      if (!payload.proxy) {
        // Do not send proxy_country_code when proxy is disabled
        delete payload.proxy_country_code
      } else if (!payload.proxy_country_code) {
        payload.proxy_country_code = 'US'
      }
      await onSave(payload)
    } catch (error) {
      console.error('Error updating profile:', error)
      const message = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      setErrors({ submit: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Edit Browser Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Name *
                </label>
                <Input
                  value={formData.profile_name}
                  onChange={(e) => handleInputChange('profile_name', e.target.value)}
                  placeholder="e.g., Default Desktop Profile"
                  className={errors.profile_name ? 'border-red-500' : ''}
                />
                {errors.profile_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.profile_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional description of this profile..."
                  rows={3}
                />
              </div>
            </div>

            {/* Browser Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Browser Settings
              </h3>
              
              {/* Viewport Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Viewport Size
                </label>
                <div className="space-y-3">
                  <Select onValueChange={handleViewportPresetChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a preset or select Custom" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIEWPORT_PRESETS.map((preset) => (
                        <SelectItem key={preset.name} value={preset.name}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                      <Input
                        type="number"
                        value={formData.browser_viewport_width}
                        onChange={(e) => handleInputChange('browser_viewport_width', parseInt(e.target.value) || 0)}
                        min={320}
                        max={3840}
                        className={errors.browser_viewport_width ? 'border-red-500' : ''}
                      />
                      {errors.browser_viewport_width && (
                        <p className="text-red-500 text-xs mt-1">{errors.browser_viewport_width}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
                      <Input
                        type="number"
                        value={formData.browser_viewport_height}
                        onChange={(e) => handleInputChange('browser_viewport_height', parseInt(e.target.value) || 0)}
                        min={240}
                        max={2160}
                        className={errors.browser_viewport_height ? 'border-red-500' : ''}
                      />
                      {errors.browser_viewport_height && (
                        <p className="text-red-500 text-xs mt-1">{errors.browser_viewport_height}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Privacy */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Privacy
              </h3>
              
              {/* Ad Blocker */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-3 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">Ad Blocker</p>
                    <p className="text-xs text-gray-600">Block ads and popups during automation</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={formData.ad_blocker ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('ad_blocker', !formData.ad_blocker)}
                >
                  {formData.ad_blocker ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {/* Proxy */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Globe2 className="w-4 h-4 mr-3 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Proxy</p>
                      <p className="text-xs text-gray-600">Route traffic through mobile proxies</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={formData.proxy ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('proxy', !formData.proxy)}
                  >
                    {formData.proxy ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {formData.proxy && (
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
              </div>

              {/* Data Persistence */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  {formData.persist ? <Eye className="w-4 h-4 mr-3 text-gray-600" /> : <EyeOff className="w-4 h-4 mr-3 text-gray-600" />}
                  <div>
                    <p className="font-medium text-sm">Data Persistence</p>
                    <p className="text-xs text-gray-600">Save cookies and session data between tasks</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={formData.persist ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('persist', !formData.persist)}
                >
                  {formData.persist ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
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
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


