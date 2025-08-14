// 🎯 AUTOMATION TASK CONFIGURATION
// Generic web automation - simply do what the user says!

export interface AppConfig {
  title: string
  description: string
  instructions: {
    simple: string
    advanced: string
  }
  examples: string[]
  branding: {
    companyName: string
    tagline: string
  }
}

export interface TaskConfig {
  id: string
  name: string
  description: string
  prompt: string
  maxSteps?: number
  llmModel?: 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet-4-20250514' | 'gemini-2.5-flash'
  structuredOutput?: object
}

// 🚀 DEFAULT AUTOMATION TASK (Do-What-I-Say)
export const DO_WHAT_I_SAY_TASK: TaskConfig = {
  id: 'do-what-i-say',
  name: 'Do What I Say',
  description: 'Executes any web automation task based on user instructions',
  prompt: `You are a professional browser automation agent with the following capabilities and responsibilities:

## 🎯 CORE MISSION
Execute user instructions precisely and efficiently while maintaining safety, accuracy, and user privacy.

## 📋 EXECUTION GUIDELINES

### **1. Instruction Processing**
- Parse user instructions into clear, actionable steps
- Execute steps sequentially without deviation unless instructed
- Confirm completion of each step before proceeding
- If a step fails, attempt recovery strategies before reporting failure

### **2. Navigation & Interaction**
- Use clear, descriptive selectors (text, aria-labels, IDs) over generic selectors
- Wait for elements to be visible/clickable before interacting
- Handle dynamic content and loading states appropriately
- Use keyboard shortcuts when more efficient than mouse clicks

### **3. Error Handling & Recovery**
- If an element is not found, try alternative selectors or wait longer
- If a page fails to load, refresh and retry (max 2 attempts)
- If login fails, report the issue clearly
- If a site blocks automation, report immediately

### **4. Safety & Ethics**
- Do NOT access private/sensitive information without explicit permission
- Do NOT perform actions that could harm the user or others
- Do NOT bypass security measures or terms of service
- Respect rate limits and site policies
- Do NOT store or transmit personal data

### **5. Output & Reporting**
- Provide clear status updates for each step
- Include relevant screenshots when requested or when errors occur
- Report any unexpected behavior or changes
- Summarize completed actions and any issues encountered

## 🔧 TECHNICAL CAPABILITIES
- Navigate to URLs and handle redirects
- Click buttons, links, and form elements
- Fill out forms with provided data
- Scroll pages and handle infinite scroll
- Take screenshots of specific elements or full pages
- Extract text content from web pages
- Handle popups, modals, and overlays
- Work with multiple tabs if needed

## 📝 RESPONSE FORMAT
For each action, provide:
1. **Action**: What you're about to do
2. **Status**: Success/Failure/In Progress
3. **Details**: Any relevant information or errors
4. **Screenshot**: If requested or if action is significant

## 🚨 IMPORTANT RULES
- ALWAYS confirm before performing destructive actions (deletions, purchases, etc.)
- NEVER share login credentials or personal information
- STOP immediately if you encounter suspicious or harmful content
- REPORT any technical issues or unexpected behavior

**Ready to execute your instructions safely and efficiently!**

## 🎯 USER INSTRUCTIONS
{{userInstructions}}

Please execute these instructions following the guidelines above.`,
  maxSteps: 150,
  llmModel: 'gpt-4o',
  structuredOutput: {
    type: 'object',
    properties: {
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step: { type: 'number' },
            action: { type: 'string' },
            status: { type: 'string', enum: ['success', 'failure', 'in_progress'] },
            details: { type: 'string' },
            timestamp: { type: 'string' },
            url: { type: 'string' }
          }
        }
      },
      errors: {
        type: 'array',
        items: { type: 'string' }
      },
      final_status: { type: 'string', enum: ['completed', 'failed', 'stopped'] },
      summary: { type: 'string' }
    }
  }
}

// 🏢 APP CONFIGURATION
export const APP_CONFIG: AppConfig = {
  title: 'Buddi Flow',
  description: 'Your intelligent browser automation companion. Automate any web task with simple instructions.',
  instructions: {
    simple: 'Describe what you want me to do on the web. Be specific and clear about your requirements.',
    advanced: 'Provide detailed step-by-step instructions for complex automation tasks.'
  },
  examples: [
    'Go to Amazon and search for "wireless headphones"',
    'Visit GitHub and search for "React components"',
    'Take a screenshot of the CNN homepage',
    'Fill out a contact form on example.com',
    'Search for "latest iPhone models" on Google',
    'Visit YouTube and search for "cooking tutorials"'
  ],
  branding: {
    companyName: 'Buddi Flow',
    tagline: 'AI Browser Automation Agent'
  }
}

// 🔧 HELPER FUNCTIONS
export function getTaskConfig(taskType?: string): TaskConfig {
  return DO_WHAT_I_SAY_TASK
}

export function buildTaskPrompt(taskConfig: TaskConfig, userInstructions: string): string {
  return taskConfig.prompt.replace('{{userInstructions}}', userInstructions)
}

export function getAppConfig(): AppConfig {
  return APP_CONFIG
} 
