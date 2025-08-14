import { Workflow, WorkflowTask, TaskType } from '@/types/workflow'

interface GeminiWorkflowRequest {
  prompt: string
  category?: string
  complexity?: 'simple' | 'medium' | 'complex'
}

interface GeminiWorkflowResponse {
  workflow: Workflow
  success: boolean
  message?: string
}

export class GeminiService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || ''
  }

  async generateWorkflow(request: GeminiWorkflowRequest): Promise<GeminiWorkflowResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured')
      }

      const systemPrompt = `You are an expert automation workflow designer specializing in browser automation. Create concise, correct, executable workflows that can be executed by an AI browser automation agent.

CRITICAL GUIDELINES:
1. Create workflows with 3-5 well-defined tasks (prefer the fewest steps necessary to reach the goal)
INTENT AND GOAL EXTRACTION:
- First, infer the user's primary goal and the minimal steps needed.
- Prefer outcome-focused, intent-led steps (e.g., "Open https://mail.google.com/ and wait for inbox"), not UI micromanagement.
- Only include tasks that materially move toward the goal.
- Avoid scripting every micro-interaction; keep it high-level but actionable.

2. Each task must be specific, actionable, and executable by an AI browser automation agent
3. Use natural language descriptions that a human would understand
4. Include proper task dependencies and logical ordering
5. Make tasks detailed enough for an AI agent to understand and execute
6. Focus on real-world automation scenarios with clear objectives
7. Each task should have a single, clear purpose
8. Include appropriate wait times and error handling considerations

STRICT DO-NOTS:
- Do NOT include meta-instructions such as providing status updates, taking screenshots, or reporting errors. Only output the workflow JSON.
- Do NOT add sections like "IMPORTANT EXECUTION GUIDELINES" or any prose outside the JSON format. If you must mention error handling, include at most one short sentence embedded inside the last task's taskInstructions (e.g., "If any error occurs, handle it gracefully.").
- Do NOT write phrases like "execute exactly in this order" or "skip the next two tasks".
- Do NOT hardcode rigid element labels. Prefer generic terms (e.g., "Email input", "Password field", "Sign in button").

UNIVERSAL APPROACH WITH CANONICAL URLS:
- Prefer simple, goal-oriented language. When the user clearly implies a well-known service, include its canonical URL explicitly in navigate steps.
- Use these canonical URLs when relevant:
  * Gmail: https://mail.google.com/
  * Google Search: https://www.google.com/
  * Google Drive: https://drive.google.com/
  * Google Docs: https://docs.google.com/
  * Slack (web): https://app.slack.com/client
  * LinkedIn: https://www.linkedin.com/
  * X (Twitter): https://x.com/
  * YouTube: https://www.youtube.com/
  * Amazon: https://www.amazon.com/
  * eBay: https://www.ebay.com/
  * Reddit: https://www.reddit.com/
- When you include a canonical URL, also add the primary domain to allowedDomains for that task.

INTELLIGENT VARIABLE DETECTION:
- Analyze the user's request to identify what variables will be needed
- Include variables for any dynamic data mentioned (emails, passwords, URLs, text content, etc.)
- Make variables flexible and reusable across different scenarios
- Consider both required and optional variables
- Include variables for fallback scenarios and error handling

ROBUST ERROR HANDLING & FALLBACK STRATEGIES:
- ALWAYS check current page state before taking any action
- Include intelligent fallback strategies when elements are not found
- Add conditional logic to handle different page states and layouts
- Include validation steps after each major action
- Provide natural fallback actions when primary elements are not found
- Handle common scenarios like:
  * Already logged in (check for user profile, logout button, or dashboard elements)
  * Different page layouts or A/B tests
  * Popup dialogs or overlays
  * Network errors or slow loading
  * CAPTCHA or security challenges
  * Mobile vs desktop layouts
  * Page navigation issues
  * Account selection screens
  * Multi-step authentication flows

UNIVERSAL FALLBACK STRATEGIES:
1. If an element is not found:
   - Try alternative descriptions or common variations
   - Look for similar elements with different names
   - Check if the page has loaded completely
   - Wait a moment and try again
   - Navigate back and retry the action

2. For Authentication Workflows:
   - First check if already logged in by looking for common indicators
   - If logged in, skip login steps and proceed to main workflow
   - If not logged in, proceed with login process using natural descriptions
   - Handle account selection screens intelligently
   - Handle login failures by going back and retrying

3. For Form Interactions:
   - Use natural descriptions of form fields
   - Wait for elements to be visible and clickable
   - Validate form submission success
   - Handle form validation errors by going back and correcting

4. For Navigation:
   - Wait for page load completion
   - Check for expected page elements
   - Handle redirects or unexpected page changes
   - If stuck, navigate back and try alternative approach

5. For Data Extraction:
   - Use natural descriptions of data elements
   - Handle cases where data might not be present
   - Validate extracted data format
   - Try alternative extraction methods if needed

6. For Loop Prevention:
   - Track the number of attempts on the same page
   - If stuck in a loop (same page for more than 3 attempts), try alternative approach
   - Use different navigation strategies when loops are detected
   - Implement intelligent page state detection

TASK TYPES AVAILABLE (use ONLY these exact values):
- navigate: Navigate to specific URLs or pages
- click: Click on elements, buttons, links, or interactive elements
- type: Fill forms, enter text, or input data
- extract: Extract data, text, or information from pages
- wait: Wait for elements to load, appear, or for specific time periods
- condition: Conditional logic and decision making
- loop: Loop through items, lists, or repeat actions
- api-call: Make API calls or external requests
- file-upload: Upload files to websites or forms
- file-download: Download files from websites
- screenshot: Take screenshots of pages or elements
- custom: Custom JavaScript execution or advanced actions

TASK INSTRUCTION GUIDELINES:
- Keep instructions SIMPLE and CORRECT; limit to the essentials.
- Exactly one short sentence per taskInstruction.
- Use intent-led, goal-oriented language; avoid rigid sequencing.
- If navigating to a known service (e.g., Gmail), include the exact URL in the instruction (e.g., "Open https://mail.google.com/ and wait for the inbox or sign-in page").
- Include the primary domain in allowedDomains when a URL is known.
- Use brief conditional checks (e.g., "if already signed in and inbox is visible, continue").
- Specify brief waits only when necessary.
- Keep fallback text minimal (only when critical and short).

AUTHENTICATION (SIMPLIFIED):
- Prefer "if needed" language (e.g., "Sign in with email and password if prompted, then wait for the inbox").
- Do not script fine-grained account selection or multi-step flows unless the goal explicitly depends on them.
- Avoid loops and "go back and try again"; keep a single, concise path.

VARIABLES:
- Only include variables that are actually required by the tasks.
- Do not invent extra variables or placeholders.

EMAIL REPLY WORKFLOWS (Gmail/Outlook/etc.):
- When replying to emails, read the opened email and compose a concise answer that directly addresses the sender's question.
- If an auto-reply variable (e.g., autoReplyMessage) is provided, use it only as guidance for tone or as a fallback; do NOT paste it verbatim unless the user explicitly requests that exact text.
- Keep the reply short (1–2 sentences) and relevant to the email's content.

UNIVERSAL ELEMENT DESCRIPTIONS:
- Use generic, platform-agnostic descriptions:
  * "Email input field" or "username field"
  * "Password field" or "password input"
  * "Login button" or "Sign in button" or "Submit button"
  * "Navigation menu" or "menu"
  * "Search box" or "search field"
  * "Submit button" or "Continue button" or "Next button"
  * "Form field" or "input field"
  * "User profile" or "account icon" or "avatar"
  * "Logout button" or "Sign out button"
  * "Dashboard" or "main page" or "home page"
  * "Account selection" or "choose account"
  * "Error message" or "warning message"

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure (no prose, no code fences):
{
  "name": "Descriptive Workflow Name",
  "description": "Detailed description of what this workflow accomplishes",
  "category": "automation|data-extraction|form-filling|monitoring|testing|social-media|e-commerce",
  "tasks": [
    {
      "name": "Clear Task Name",
      "description": "Detailed description of what this task does",
      "type": "navigate|click|type|extract|wait|condition|loop|api-call|file-upload|file-download|screenshot|custom",
      "taskInstructions": "Detailed step-by-step instructions using universal natural language. Describe what the AI agent should look for and do, using common UI terminology that works across all websites. Include intelligent fallback strategies when elements are not found, such as going back and trying alternative approaches.",
      "order": 1,
      "dependencies": [],
      "settings": {
        "model": "gpt-4o-mini",
        "maxAgentSteps": 15,
        "viewportWidth": 1920,
        "viewportHeight": 1080,
        "saveBrowserData": true,
        "publicSharing": false,
        "adBlocker": true,
        "proxy": false,
        "proxyCountry": "",
        "highlightElements": false,
        "allowedDomains": []
      },
      "timeout": 60,
      "maxRetries": 3
    }
  ],
  "variables": [
    {
      "name": "variable_name",
      "type": "string|number|boolean|array|object",
      "defaultValue": "default_value",
      "description": "Clear description of what this variable is used for",
      "isRequired": true,
      "isSecret": false
    }
  ]
}

STRICT JSON RULES:
- Output ONLY a single JSON object. No surrounding text, bullet lists, or code fences.
- Use double quotes for all keys and string values.
- Do NOT include trailing commas.
- Ensure arrays and objects are properly closed with , separators.
- Do NOT include comments.

USER REQUEST: ${request.prompt}
CATEGORY: ${request.category || 'automation'}

Generate a practical, executable workflow that accomplishes the user's request. Focus on creating tasks that are:
1. Specific and actionable using universal natural language
2. Well-ordered and logical
3. Detailed enough for AI execution
4. Realistic and practical
5. Include intelligent fallback strategies
6. Handle common edge cases with natural approaches
7. Check for existing login states before attempting authentication
8. Use universal element descriptions that work across all websites
9. Include instructions to go back and try alternative approaches when stuck
10. Intelligently detect and include all necessary variables

Make sure each task instruction uses natural, descriptive language that works universally across all websites and platforms, focuses on what the user would naturally look for on any page, and includes intelligent fallback strategies when elements are not found.

UNIVERSAL AUTHENTICATION HANDLING:
When creating authentication workflows, always consider these universal scenarios:

1. Account Selection Screens:
   - If the page shows account choices, look for the account matching provided credentials
   - If account shows "Signed out" or similar status, click on it to proceed with login
   - If no matching account exists, look for "Use another account" or "Add account" options
   - Handle cases where the account is already signed in

2. Multi-Step Authentication:
   - Handle username/email input → Next → password input → Next flow
   - Handle 2FA prompts if they appear
   - Handle security questions or verification steps
   - Handle "Stay signed in" or "Remember me" prompts

3. Loop Prevention:
   - If the same page appears multiple times, try different approaches
   - Use alternative navigation methods when stuck
   - Implement intelligent retry logic with different strategies
   - Track page states to avoid infinite loops

4. Context-Aware Decision Making:
   - Always check the current page state before taking action
   - Adapt instructions based on what's actually visible on the page
   - Use conditional logic to handle different page layouts
   - Provide multiple fallback strategies for each step

5. Error Recovery:
   - If login fails, go back and try again with different approach
   - If account selection fails, try alternative account options
   - If stuck on any page for too long, implement alternative strategy
   - Always have a plan B for every authentication step`

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1200,
            topP: 0.8,
            topK: 40
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      const data = await response.json()
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

      // Extract JSON from the response
      // Attempt strict JSON parse; fall back to extracting the largest JSON object
      let workflowData: any
      try {
        workflowData = JSON.parse(generatedText.trim())
      } catch {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('Invalid response format from Gemini')
        }
        workflowData = JSON.parse(jsonMatch[0])
      }

      // Convert to our Workflow format
      // Helper to infer primary domain(s) from taskInstructions
      const inferAllowedDomains = (instruction: string): string[] => {
        try {
          const urlMatch = instruction.match(/https?:\/\/([^\s/]+)/i)
          if (!urlMatch) return []
          const host = urlMatch[1].toLowerCase()
          // Keep base domain and common parent domain (e.g., mail.google.com => google.com)
          const parts = host.split('.')
          if (parts.length >= 2) {
            const base = parts.slice(-2).join('.')
            const domains = new Set<string>([host, base])
            return Array.from(domains)
          }
          return [host]
        } catch {
          return []
        }
      }

      // Sanitize and simplify task instructions to avoid meta-guidelines and keep them short
      const simplifyTaskInstructions = (text: string): string => {
        if (!text) return ''
        let t = String(text)
        // Remove common meta sections/phrases
        const metaPatterns = [
          /IMPORTANT EXECUTION GUIDELINES[\s\S]*$/i,
          /Execute all steps in the exact order[\s\S]*/i,
          /Provide clear status updates[\s\S]*/i,
          /Take screenshots[\s\S]*/i,
          /Report any errors[\s\S]*/i,
          /Variables have been automatically substituted[\s\S]*/i
        ]
        for (const rx of metaPatterns) {
          t = t.replace(rx, '')
        }
        // Enforce a single short sentence
        const sentenceMatch = t.match(/[^.!?]+[.!?]?/)
        const firstSentence = sentenceMatch ? sentenceMatch[0].trim() : t.trim()
        return firstSentence
      }

      const workflow: Workflow = {
        id: `workflow_${Date.now()}`,
        name: workflowData.name,
        description: workflowData.description,
        category: workflowData.category as Workflow['category'],
        status: 'active', // Changed from 'draft' to 'active'
        tasks: workflowData.tasks.map((task: any, index: number) => {
          const simplifiedInstruction = simplifyTaskInstructions(String(task.taskInstructions || ''))
          const inferredDomains = inferAllowedDomains(simplifiedInstruction)
          return ({
          id: `task_${Date.now()}_${index}`,
          name: task.name,
          description: task.description,
          type: task.type as TaskType,
            taskInstructions: simplifiedInstruction,
          settings: {
            model: task.settings.model,
            saveBrowserData: task.settings.saveBrowserData,
            publicSharing: task.settings.publicSharing,
            viewportWidth: task.settings.viewportWidth,
            viewportHeight: task.settings.viewportHeight,
            adBlocker: task.settings.adBlocker,
            proxy: task.settings.proxy,
            proxyCountry: task.settings.proxyCountry,
            highlightElements: task.settings.highlightElements,
            maxAgentSteps: task.settings.maxAgentSteps,
              allowedDomains: (task.settings.allowedDomains && task.settings.allowedDomains.length > 0)
                ? task.settings.allowedDomains
                : inferredDomains
          },
          dependencies: task.dependencies || [],
          conditions: [],
          order: task.order,
          retryCount: 0,
          maxRetries: task.maxRetries,
          timeout: task.timeout,
          variables: {}
          })
        }),
        variables: workflowData.variables || [],
        triggers: [],
        settings: {
          enableLogging: true,
          maxExecutionTime: 3600,
          enableNotifications: false,
          retryOnFailure: true,
          maxRetries: 3,
          // Universal task settings
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 15,
          allowedDomains: [],
          browserProfileId: undefined
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user',
        version: 1
      }

      return {
        workflow,
        success: true,
        message: 'Workflow generated successfully'
      }

    } catch (error) {
      console.error('Error generating workflow:', error)
      return {
        workflow: {} as Workflow,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate workflow'
      }
    }
  }
}

export const geminiService = new GeminiService() 