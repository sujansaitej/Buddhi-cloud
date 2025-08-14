'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, CheckCircle, AlertCircle, Wand2, ArrowLeft, Play, FileText, Lightbulb } from 'lucide-react'
import { Workflow } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AIWorkflowGeneratorProps {
  onWorkflowGenerated: (workflow: Workflow) => void
  onBack: () => void
}

const SAMPLE_PROMPTS = [
  "I need to create an email automation workflow that logs into Gmail and sends automated replies",
  "Create a workflow to scrape product information from an e-commerce website",
  "Build a workflow to fill out and submit contact forms on multiple websites",
  "Create a social media automation workflow to post content and engage with followers",
  "Build a workflow to monitor website changes and send notifications",
  "Create a workflow to extract data from PDF documents and organize it"
]

const CATEGORIES = [
  { value: 'automation', label: 'Automation' },
  { value: 'data-extraction', label: 'Data Extraction' },
  { value: 'form-filling', label: 'Form Filling' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'testing', label: 'Testing' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'e-commerce', label: 'E-commerce' }
]

export default function AIWorkflowGenerator({ onWorkflowGenerated, onBack }: AIWorkflowGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('automation')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a workflow description')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedWorkflow(null)

    try {
      const response = await fetch('/api/workflow/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          category
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate workflow')
      }

      if (data.success) {
        setGeneratedWorkflow(data.workflow)
      } else {
        throw new Error(data.message || 'Failed to generate workflow')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate workflow')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseWorkflow = () => {
    if (generatedWorkflow) {
      onWorkflowGenerated(generatedWorkflow)
    }
  }

  const handleSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-gray-100 transition-colors p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Workflow Generator</h1>
            <p className="text-gray-600 text-xs">Describe what you want to automate and we'll create it for you</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar - Clean Example Prompts */}
        <div className="w-96 bg-gray-50/50 border-r border-gray-200 h-[calc(100vh-60px)]">
          {/* Sidebar Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Example Prompts</h3>
                <p className="text-xs text-gray-500 mt-0.5">Click to get started quickly</p>
              </div>
            </div>
          </div>
          
          {/* Example Cards - Clean Design */}
          <div className="px-5 py-6 space-y-4">
            {SAMPLE_PROMPTS.slice(0, 5).map((samplePrompt, index) => (
              <div
                key={index}
                onClick={() => handleSamplePrompt(samplePrompt)}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                {/* Simple Number Badge */}
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5 group-hover:bg-purple-500 group-hover:text-white transition-all duration-200">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed transition-colors duration-200">
                      {samplePrompt}
                    </p>
                  </div>
                </div>

                {/* Simple Click Indicator */}
                <div className="flex items-center justify-end mt-3 pt-2">
                  <div className="text-xs text-gray-400 group-hover:text-purple-600 transition-colors duration-200 flex items-center gap-1">
                    <span>Click to use</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Bottom Note */}
          <div className="px-5 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                💡 <span className="font-medium">Tip:</span> Be specific in your descriptions for better results
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 h-[calc(100vh-60px)] overflow-y-auto">
          <div className="max-w-2xl">
            {/* Main Input Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b border-gray-200 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">Describe Your Workflow</h2>
                    <p className="text-xs text-gray-600">Tell us what you want to automate in detail</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Workflow Description *
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: I want to scrape product prices from Amazon, compare them with competitors, and send me an email if prices drop by more than 10%. Include product name, current price, previous price, and percentage change."
                    className="min-h-[120px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
                  />
                  <p className="text-xs text-gray-500">Be as detailed as possible for better results</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-medium text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generate Workflow
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Workflow
                    </>
                  )}
                </Button>

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Workflow Result */}
            {generatedWorkflow && (
              <div className="bg-white rounded-lg border border-green-200 shadow-sm mt-6">
                <div className="bg-green-50 p-4 border-b border-green-200 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-900">Your Workflow is Ready!</h2>
                      <p className="text-xs text-gray-600">Review your generated workflow below</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{generatedWorkflow.name}</h3>
                    <p className="text-sm text-gray-600">{generatedWorkflow.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {generatedWorkflow.tasks.length} Tasks
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {generatedWorkflow.category}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">#</span>
                      </div>
                      Workflow Steps
                    </h4>
                    <div className="space-y-2">
                      {generatedWorkflow.tasks.map((task, index) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{task.name}</p>
                          </div>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs">
                            {task.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleUseWorkflow}
                      className="flex-1 bg-green-600 hover:bg-green-700 font-medium h-10"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Use This Workflow
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedWorkflow(null)
                        setPrompt('')
                      }}
                      className="px-6 h-10"
                    >
                      Generate Another
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}