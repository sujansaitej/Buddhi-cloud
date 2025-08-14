import React, { useState } from 'react'
import { Workflow } from '@/types/workflow'
import { Play, Info, RefreshCw, Eye, EyeOff, Wallet, Key, User, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { WalletCredentialSelector } from './WalletCredentialSelector'
import { WalletCredential } from '@/types/wallet'

interface VariableInputFormProps {
  workflow: Workflow
  onSubmit: (variables: Record<string, any>) => void
  onCancel: () => void
  loading?: boolean
  showActions?: boolean
  submitLabel?: string
  onVariablesChange?: (variables: Record<string, any>) => void
}

export function VariableInputForm({ 
  workflow, 
  onSubmit, 
  onCancel,
  loading = false,
  showActions = true,
  submitLabel = 'Execute Workflow',
  onVariablesChange
}: VariableInputFormProps) {
  const [variables, setVariables] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordVisible, setPasswordVisible] = useState<Record<string, boolean>>({})
  const [showWalletSelector, setShowWalletSelector] = useState<Record<string, boolean>>({})

  // Clear form when workflow changes
  React.useEffect(() => {
    setVariables({})
    setErrors({})
    setPasswordVisible({})
    setShowWalletSelector({})
  }, [workflow.id])

  // Notify parent when variables change
  React.useEffect(() => {
    onVariablesChange?.(variables)
  }, [variables, onVariablesChange])

  // Detect if a variable is likely a credential field
  const isCredentialField = (variableName: string, variableType: string) => {
    const credentialKeywords = ['email', 'password', 'username', 'api_key', 'token', 'secret', 'key']
    const nameLower = variableName.toLowerCase()
    return credentialKeywords.some(keyword => nameLower.includes(keyword)) || 
           credentialKeywords.includes(variableType)
  }

  const getFieldIcon = (variableName: string, variableType: string) => {
    const nameLower = variableName.toLowerCase()
    if (nameLower.includes('email') || nameLower.includes('username')) return <User className="w-4 h-4 text-blue-600" />
    if (nameLower.includes('password') || nameLower.includes('secret') || nameLower.includes('key')) return <Lock className="w-4 h-4 text-red-600" />
    if (isCredentialField(variableName, variableType)) return <Key className="w-4 h-4 text-purple-600" />
    return <Info className="w-4 h-4 text-gray-600" />
  }

  const handleSubmit = () => {
    // Validate required variables
    const newErrors: Record<string, string> = {}
    
    workflow.variables.forEach(variable => {
      const value = variables[variable.name]
      if (variable.isRequired && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[variable.name] = `${variable.name} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(variables)
  }

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleClearAllFields = () => {
    setVariables({})
    setErrors({})
  }

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisible(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handleWalletSelect = (variableName: string, credential: WalletCredential) => {
    setVariables(prev => ({
      ...prev,
      [variableName]: credential.value
    }))
    setShowWalletSelector(prev => ({ ...prev, [variableName]: false }))
    
    // Clear error when wallet credential is selected
    if (errors[variableName]) {
      setErrors(prev => ({
        ...prev,
        [variableName]: ''
      }))
    }
  }

  const getInputType = (variable: any) => {
    const nameLower = variable.name.toLowerCase()
    
    if (variable.type === 'password' || nameLower.includes('password')) {
      return 'password'
    }
    
    if (variable.type === 'email' || nameLower.includes('email')) {
      return 'email'
    }
    
    if (variable.type === 'number') {
      return 'number'
    }
    
    return 'text'
  }

  const renderInput = (variable: any) => {
    const value = variables[variable.name] || ''
    const isCredential = isCredentialField(variable.name, variable.type)
    const inputType = getInputType(variable)
    const isPassword = inputType === 'password'
    const isVisible = passwordVisible[variable.name]

    if (isPassword) {
      return (
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={isVisible ? 'text' : 'password'}
              value={value}
              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
              className={`w-full pr-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg transition-all duration-200 ${
                errors[variable.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
              }`}
              placeholder={`Enter ${variable.name}${variable.isRequired ? ' (required)' : ' (optional)'}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => togglePasswordVisibility(variable.name)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 h-10 w-10 p-0 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isVisible ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </Button>
          </div>
          
          {isCredential && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowWalletSelector(prev => ({ ...prev, [variable.name]: true }))}
              className="w-full text-sm border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors rounded-lg"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Select from Wallet
            </Button>
          )}
        </div>
      )
    }
    
    return (
      <div className="space-y-3">
        <Input
          type={inputType}
          value={value}
          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
          className={`w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg transition-all duration-200 ${
            errors[variable.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
          placeholder={`Enter ${variable.name}${variable.isRequired ? ' (required)' : ' (optional)'}`}
        />
        
        {isCredential && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowWalletSelector(prev => ({ ...prev, [variable.name]: true }))}
            className="w-full text-sm border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors rounded-lg"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Select from Wallet
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Description */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Workflow Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{workflow.description}</p>
          </div>
        </div>
      </div>

      {/* Variables Section */}
      {workflow.variables.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Variables Required</h3>
          <p className="text-gray-600">This workflow can be executed without any additional configuration.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Configuration Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                {workflow.variables.length} variable{workflow.variables.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            {Object.keys(variables).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFields}
                className="text-xs rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          {/* Variable Cards */}
          <div className="space-y-4">
            {workflow.variables.map(variable => (
              <div key={variable.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFieldIcon(variable.name, variable.type)}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        {variable.name}
                        {variable.isRequired && (
                          <span className="text-red-500 text-xs font-bold">*</span>
                        )}
                      </label>
                      {variable.description && (
                        <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCredentialField(variable.name, variable.type) && (
                      <Badge className="text-xs bg-emerald-500 text-white border-emerald-500 font-medium">
                        Credential
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                      {variable.type}
                    </Badge>
                  </div>
                </div>
                
                {/* Input Field */}
                {renderInput(variable)}
                
                {/* Error Message */}
                {errors[variable.name] && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors[variable.name]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Wallet Credential Selector Modals */}
      {workflow.variables.map(variable => (
        showWalletSelector[variable.name] && (
          <WalletCredentialSelector
            key={`wallet-${variable.name}`}
            variableName={variable.name}
            variableType={variable.type}
            onSelect={(credential) => handleWalletSelect(variable.name, credential)}
            onCancel={() => setShowWalletSelector(prev => ({ ...prev, [variable.name]: false }))}
            currentValue={variables[variable.name]}
          />
        )
      ))}
    </div>
  )
} 