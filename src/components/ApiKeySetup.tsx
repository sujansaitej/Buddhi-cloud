'use client'

import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react'

interface ApiKeySetupProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiKeySetup({ isOpen, onClose }: ApiKeySetupProps) {
  if (!isOpen) return null

  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
            navigator.clipboard.writeText('BROWSER_USE_API_KEY=your_api_key_here')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">API Key Required</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            To use Nizhal, you need to configure your Browser Use API key. Follow these steps:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Step 1: Get Your API Key</h3>
              <p className="text-sm text-gray-600 mb-3">
                Visit the Browser Use website to get your API key.
              </p>
              <a
                href="https://browser-use.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Browser Use</span>
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Step 2: Create Environment File</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root:
              </p>
              <div className="bg-gray-800 rounded-lg p-3 relative">
                <code className="text-green-400 text-sm">
                  BROWSER_USE_API_KEY=your_api_key_here
                </code>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Step 3: Restart Your App</h3>
              <p className="text-sm text-gray-600">
                After adding the API key, restart your development server for the changes to take effect.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 