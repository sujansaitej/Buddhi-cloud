import { WorkflowSettings, TaskSettings } from '@/types/workflow'

/**
 * Get effective settings for a task by merging universal settings with task-specific settings
 */
export function getEffectiveTaskSettings(
  universalSettings: WorkflowSettings,
  taskSettings: TaskSettings
): TaskSettings {
  // Start with universal settings as base
  const baseSettings: TaskSettings = {
    model: universalSettings.model || 'gpt-4o-mini',
    saveBrowserData: universalSettings.saveBrowserData ?? true,
    publicSharing: universalSettings.publicSharing ?? false,
    viewportWidth: universalSettings.viewportWidth || 1920,
    viewportHeight: universalSettings.viewportHeight || 1080,
    adBlocker: universalSettings.adBlocker ?? true,
    proxy: universalSettings.proxy ?? false,
    proxyCountry: universalSettings.proxyCountry || 'none',
    highlightElements: universalSettings.highlightElements ?? false,
    maxAgentSteps: universalSettings.maxAgentSteps || 15,
    allowedDomains: universalSettings.allowedDomains || [],
    browserProfileId: universalSettings.browserProfileId
  }
  
  // Override with task-specific settings
  return {
    ...baseSettings,
    ...taskSettings
  }
}

/**
 * Get default universal settings for a new workflow
 * This function can be called without the settings context for backward compatibility
 */
export function getDefaultUniversalSettings(): WorkflowSettings {
  // Try to get settings from localStorage if available
  let globalSettings = null
  try {
    const savedSettings = localStorage.getItem('globalSettings')
    if (savedSettings) {
      globalSettings = JSON.parse(savedSettings)
    }
  } catch (error) {
    console.error('Error parsing saved settings:', error)
  }

  return {
    enableLogging: true,
    maxExecutionTime: 3600,
    enableNotifications: globalSettings?.defaultScheduleSettings?.enableNotifications ?? false,
    retryOnFailure: true,
    maxRetries: globalSettings?.defaultScheduleSettings?.defaultRetryCount ?? 3,
    // Universal task settings
    model: globalSettings?.defaultModel ?? 'gpt-4o-mini',
    saveBrowserData: globalSettings?.defaultSaveBrowserData ?? true,
    publicSharing: globalSettings?.defaultWorkflowSettings?.enablePublicSharing ?? false,
    viewportWidth: globalSettings?.defaultViewportWidth ?? 1920,
    viewportHeight: globalSettings?.defaultViewportHeight ?? 1080,
    adBlocker: globalSettings?.defaultAdBlocker ?? true,
    proxy: globalSettings?.defaultProxy ?? false,
    proxyCountry: globalSettings?.defaultProxyCountry ?? 'none',
    highlightElements: globalSettings?.defaultHighlightElements ?? false,
    maxAgentSteps: globalSettings?.defaultMaxAgentSteps ?? 15,
    allowedDomains: globalSettings?.defaultWorkflowSettings?.defaultAllowedDomains ?? [],
    browserProfileId: undefined
  }
}

/**
 * Get universal settings using the settings context (preferred method)
 */
export function getUniversalSettingsFromContext(globalSettings: any): WorkflowSettings {
  return {
    enableLogging: true,
    maxExecutionTime: 3600,
    enableNotifications: globalSettings?.defaultScheduleSettings?.enableNotifications ?? false,
    retryOnFailure: true,
    maxRetries: globalSettings?.defaultScheduleSettings?.defaultRetryCount ?? 3,
    // Universal task settings
    model: globalSettings?.defaultModel ?? 'gpt-4o-mini',
    saveBrowserData: globalSettings?.defaultSaveBrowserData ?? true,
    publicSharing: globalSettings?.defaultWorkflowSettings?.enablePublicSharing ?? false,
    viewportWidth: globalSettings?.defaultViewportWidth ?? 1920,
    viewportHeight: globalSettings?.defaultViewportHeight ?? 1080,
    adBlocker: globalSettings?.defaultAdBlocker ?? true,
    proxy: globalSettings?.defaultProxy ?? false,
    proxyCountry: globalSettings?.defaultProxyCountry ?? 'none',
    highlightElements: globalSettings?.defaultHighlightElements ?? false,
    maxAgentSteps: globalSettings?.defaultMaxAgentSteps ?? 15,
    allowedDomains: globalSettings?.defaultWorkflowSettings?.defaultAllowedDomains ?? [],
    browserProfileId: undefined
  }
}

/**
 * Validate workflow settings
 */
export function validateWorkflowSettings(settings: Partial<WorkflowSettings>): string[] {
  const errors: string[] = []
  
  if (settings.maxAgentSteps && (settings.maxAgentSteps < 1 || settings.maxAgentSteps > 100)) {
    errors.push('Max Agent Steps must be between 1 and 100')
  }
  
  if (settings.viewportWidth && (settings.viewportWidth < 800 || settings.viewportWidth > 3840)) {
    errors.push('Viewport width must be between 800 and 3840')
  }
  
  if (settings.viewportHeight && (settings.viewportHeight < 600 || settings.viewportHeight > 2160)) {
    errors.push('Viewport height must be between 600 and 2160')
  }
  
  if (settings.maxExecutionTime && (settings.maxExecutionTime < 60 || settings.maxExecutionTime > 7200)) {
    errors.push('Max execution time must be between 60 and 7200 seconds')
  }
  
  return errors
}

/**
 * Convert settings to API format for task execution
 */
export function convertSettingsToApiFormat(settings: TaskSettings) {
  return {
    save_browser_data: settings.saveBrowserData,
    llm_model: settings.model,
    use_adblock: settings.adBlocker,
    use_proxy: settings.proxy,
    proxy_country_code: settings.proxyCountry === 'none' ? '' : settings.proxyCountry,
    highlight_elements: settings.highlightElements,
    browser_viewport_width: settings.viewportWidth,
    browser_viewport_height: settings.viewportHeight,
    max_agent_steps: settings.maxAgentSteps,
    enable_public_share: settings.publicSharing,
    allowed_domains: settings.allowedDomains.length > 0 ? settings.allowedDomains : undefined,
    browser_profile_id: settings.browserProfileId
  }
} 

/**
 * Normalize and validate workflow settings to ensure all required fields are present
 */
export function normalizeWorkflowSettings(settings: any = {}): WorkflowSettings {
  return {
    enableLogging: settings.enableLogging ?? true,
    maxExecutionTime: settings.maxExecutionTime || 3600,
    enableNotifications: settings.enableNotifications ?? false,
    notificationEmail: settings.notificationEmail,
    retryOnFailure: settings.retryOnFailure ?? true,
    maxRetries: settings.maxRetries || 3,
    // Universal task settings
    model: settings.model || 'gpt-4o-mini',
    saveBrowserData: settings.saveBrowserData ?? true,
    publicSharing: settings.publicSharing ?? false,
    viewportWidth: settings.viewportWidth || 1920,
    viewportHeight: settings.viewportHeight || 1080,
    adBlocker: settings.adBlocker ?? true,
    proxy: settings.proxy ?? false,
    proxyCountry: settings.proxyCountry || 'none',
    highlightElements: settings.highlightElements ?? false,
    maxAgentSteps: settings.maxAgentSteps || 15,
    allowedDomains: settings.allowedDomains || [],
    browserProfileId: settings.browserProfileId || ''
  }
}

/**
 * Normalize and validate task settings to ensure all required fields are present
 */
export function normalizeTaskSettings(settings: any = {}): TaskSettings {
  return {
    model: settings.model || 'gpt-4o-mini',
    saveBrowserData: settings.saveBrowserData ?? true,
    publicSharing: settings.publicSharing ?? false,
    viewportWidth: settings.viewportWidth || 1920,
    viewportHeight: settings.viewportHeight || 1080,
    adBlocker: settings.adBlocker ?? true,
    proxy: settings.proxy ?? false,
    proxyCountry: settings.proxyCountry || 'none',
    highlightElements: settings.highlightElements ?? false,
    maxAgentSteps: settings.maxAgentSteps || 15,
    allowedDomains: settings.allowedDomains || [],
    browserProfileId: settings.browserProfileId || ''
  }
}

/**
 * Merge workflow settings with task settings, with task settings taking precedence
 */
export function mergeSettings(workflowSettings: WorkflowSettings, taskSettings: TaskSettings = {}): TaskSettings {
  return {
    ...workflowSettings,
    ...taskSettings,
    // Ensure arrays are properly merged
    allowedDomains: taskSettings.allowedDomains || workflowSettings.allowedDomains || []
  }
} 