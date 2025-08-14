'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { apiService } from '@/lib/api'

interface ApiKeyTestProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiKeyTest({ isOpen, onClose }: ApiKeyTestProps) {
  if (!isOpen) return null

  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking')
  const [testResult, setTestResult] = useState<string>('')
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    checkApiKey()
  }, [])

  const checkApiKey = async () => {
    try {
      // Check API key through server-side route
      const response = await fetch('/api/ping')
      if (response.ok) {
        setApiKeyStatus('valid')
        setTestResult('API key found and working')
      } else {
        const errorData = await response.json()
        if (errorData.error?.includes('API key not configured')) {
          setApiKeyStatus('missing')
          setTestResult('No API key found in environment variables')
        } else {
          setApiKeyStatus('invalid')
          setTestResult('API key is not properly configured')
        }
      }
    } catch (error) {
      setApiKeyStatus('missing')
      setTestResult('Unable to check API key status')
    }
  }

  const testApiConnection = async () => {
    setIsTesting(true)
    setTestResult('Testing API connection...')
    
    try {
      const response = await fetch('/api/ping')
      if (!response.ok) {
        const errorData = await response.json()
        setTestResult(`API connection failed: ${errorData.error}`)
      } else {
        const result = await response.json()
        setTestResult(`API connection successful! Status: ${result.status || 'OK'}`)
      }
    } catch (error: any) {
      setTestResult(`API connection failed: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = () => {
    switch (apiKeyStatus) {
      case 'valid':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'invalid':
      case 'missing':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
    }
  }

  const getStatusText = () => {
    switch (apiKeyStatus) {
      case 'valid':
        return 'API Key Found'
      case 'invalid':
        return 'API Key Invalid'
      case 'missing':
        return 'API Key Missing'
      default:
        return 'Checking...'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {getStatusIcon()}
            <h2 className="text-xl font-bold text-gray-900">API Key Test</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Status: {getStatusText()}</h3>
              <p className="text-sm text-gray-600">{testResult}</p>
            </div>

            {apiKeyStatus === 'valid' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Test API Connection</h3>
                <button
                  onClick={testApiConnection}
                  disabled={isTesting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            )}

            {apiKeyStatus === 'missing' && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Setup Required</h3>
                <p className="text-sm text-red-700 mb-3">
                  Create a <code className="bg-red-100 px-1 rounded">.env.local</code> file in your project root with:
                </p>
                                 <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
                   BROWSER_USE_API_KEY=your_actual_api_key_here
                 </code>
              </div>
            )}

            {apiKeyStatus === 'invalid' && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Configuration Issue</h3>
                <p className="text-sm text-yellow-700">
                  The API key is not properly configured. Please check your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 