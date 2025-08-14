import { WorkflowTemplate } from '@/types/workflow'

export const ENHANCED_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Full email flow: login, compose, send, and confirmation screenshot',
    category: 'email',
    difficulty: 'intermediate',
    tasks: [
      { id: 't1', name: 'Open Gmail', description: 'Navigate to Gmail homepage', type: 'navigate', taskInstructions: 'Go to https://mail.google.com. Consider login redirection to accounts.google.com a success only when the page has a visible email/username field.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com','accounts.google.com'] }, dependencies: [], conditions: [], order: 1, retryCount: 0, maxRetries: 3, timeout: 60, variables: {} },
      { id: 't2', name: 'Enter Email', description: 'Type the email address', type: 'type', taskInstructions: 'Enter {{email}} into the email/username input. Proceed only if the Next button becomes enabled.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['accounts.google.com'] }, dependencies: ['t1'], conditions: [], order: 2, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 't3', name: 'Next to Password', description: 'Proceed to password entry', type: 'click', taskInstructions: 'Click Next. Wait until a password input is visible and focused on accounts.google.com.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['accounts.google.com'] }, dependencies: ['t2'], conditions: [], order: 3, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 't4', name: 'Enter Password', description: 'Type the password securely', type: 'type', taskInstructions: 'Type {{password}} into the password field. Do not display the password in logs or screenshots.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['accounts.google.com'] }, dependencies: ['t3'], conditions: [], order: 4, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 't5', name: 'Sign In', description: 'Complete login and land on inbox', type: 'click', taskInstructions: 'Click Sign in. Consider success only when the Gmail inbox list is present on mail.google.com.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t4'], conditions: [], order: 5, retryCount: 0, maxRetries: 3, timeout: 60, variables: {} },
      { id: 't6', name: 'Compose Email', description: 'Open compose modal', type: 'click', taskInstructions: 'Click Compose. Success criterion: compose dialog is visible with To, Subject and Message fields.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t5'], conditions: [], order: 6, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 't6b', name: 'Wait For Compose Fields', description: 'Ensure fields are interactive', type: 'wait', taskInstructions: 'Wait until To, Subject and Message inputs are enabled and ready for typing.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: ['mail.google.com'] }, dependencies: ['t6'], conditions: [], order: 7, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 't7', name: 'Fill Recipient', description: 'Enter recipient email', type: 'type', taskInstructions: 'Type {{recipient}} in the To field and ensure the chip is created.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t6b'], conditions: [], order: 8, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 't8', name: 'Fill Subject', description: 'Enter subject', type: 'type', taskInstructions: 'Type {{subject}} into the Subject field. Verify text appears.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t7'], conditions: [], order: 9, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 't9', name: 'Fill Message', description: 'Enter email body', type: 'type', taskInstructions: 'Type {{message}} into the email body area. Ensure at least 10 characters were entered.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t8'], conditions: [], order: 10, retryCount: 0, maxRetries: 3, timeout: 60, variables: {} },
      { id: 't10', name: 'Send Email', description: 'Send the composed email', type: 'click', taskInstructions: 'Click Send. Consider success only when a "Message sent" snackbar/toast appears.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: ['mail.google.com'] }, dependencies: ['t9'], conditions: [], order: 11, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 't11', name: 'Screenshot Confirmation', description: 'Capture a screenshot of the sent notification', type: 'screenshot', taskInstructions: 'Capture the area containing the "Message sent" confirmation and save it to the task output.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: ['mail.google.com'] }, dependencies: ['t10'], conditions: [], order: 12, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} }
    ],
    variables: [
      { name: 'email', type: 'string', defaultValue: '', description: 'Email address for login', isRequired: true, isSecret: false },
      { name: 'password', type: 'string', defaultValue: '', description: 'Password for login', isRequired: true, isSecret: true },
      { name: 'recipient', type: 'string', defaultValue: '', description: 'Recipient email address', isRequired: true, isSecret: false },
      { name: 'subject', type: 'string', defaultValue: '', description: 'Email subject', isRequired: true, isSecret: false },
      { name: 'message', type: 'string', defaultValue: '', description: 'Email message body', isRequired: true, isSecret: false }
    ],
    previewImage: '/templates/email-automation.png',
    estimatedTime: 420,
    tags: ['email', 'automation', 'gmail', 'compose', 'send'],
    author: 'Nizhal AI',
    version: '1.1'
  },
  {
    id: 'data-scraping',
    name: 'E-commerce Data Scraping',
    description: 'Search products, open results, extract details, and capture screenshots',
    category: 'data-extraction',
    difficulty: 'advanced',
    tasks: [
      { id: 'd1', name: 'Open Site', description: 'Navigate to the e-commerce site', type: 'navigate', taskInstructions: 'Go to {{siteUrl}} and wait for the main search box or search icon to be visible.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: [], conditions: [], order: 1, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 'd2', name: 'Enter Search Query', description: 'Search for a query', type: 'type', taskInstructions: 'Enter {{searchQuery}} into the site search box. Verify the query text is present.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['d1'], conditions: [], order: 2, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'd3', name: 'Submit Search', description: 'Execute search', type: 'click', taskInstructions: 'Click the search button or press Enter. Success criterion: results grid/list is visible with at least one item.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['d2'], conditions: [], order: 3, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'd3b', name: 'Wait For Results', description: 'Ensure results are loaded', type: 'wait', taskInstructions: 'Wait until product result cards are present and images/text are loaded.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['d3'], conditions: [], order: 4, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 'd4', name: 'Loop Results', description: 'Iterate through top results', type: 'loop', taskInstructions: 'Loop through the top {{maxItems}} product results on the page; for each, open details and extract fields.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 20, allowedDomains: [] }, dependencies: ['d3b'], conditions: [{ type: 'for', condition: 'i in results', trueTasks: [], falseTasks: [], maxIterations: 10 }], order: 5, retryCount: 0, maxRetries: 3, timeout: 120, variables: {} },
      { id: 'd5', name: 'Open Product', description: 'Open a product page', type: 'click', taskInstructions: 'Open each result in a new tab or same tab (whichever is supported) and focus the product detail page.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['d4'], conditions: [], order: 6, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 'd6', name: 'Extract Details', description: 'Extract product data', type: 'extract', taskInstructions: 'Extract name, price, rating, availability, and image URLs from the product page into a structured JSON object.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 15, allowedDomains: [] }, dependencies: ['d5'], conditions: [], order: 7, retryCount: 0, maxRetries: 3, timeout: 90, variables: {} },
      { id: 'd7', name: 'Screenshot Product', description: 'Capture product page', type: 'screenshot', taskInstructions: 'Take a screenshot of the product details section including price and title for auditing.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['d6'], conditions: [], order: 8, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} }
    ],
    variables: [
      { name: 'siteUrl', type: 'string', defaultValue: 'https://www.amazon.com', description: 'E-commerce site start URL', isRequired: true, isSecret: false },
      { name: 'searchQuery', type: 'string', defaultValue: 'wireless headphones', description: 'Search query to use', isRequired: true, isSecret: false },
      { name: 'maxItems', type: 'number', defaultValue: 5, description: 'Number of top results to process', isRequired: false, isSecret: false }
    ],
    previewImage: '/templates/data-scraping.png',
    estimatedTime: 360,
    tags: ['scraping', 'e-commerce', 'results', 'loop'],
    author: 'Nizhal AI',
    version: '1.1'
  },
  {
    id: 'form-filling',
    name: 'Contact Form Automation',
    description: 'Navigate, fill each field, attach optional file, submit and verify',
    category: 'form-filling',
    difficulty: 'beginner',
    tasks: [
      { id: 'f1', name: 'Open Contact Page', description: 'Navigate to contact page', type: 'navigate', taskInstructions: 'Go to {{websiteUrl}}. Success criterion: a form element or contact fields are visible.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: [], conditions: [], order: 1, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 'f2', name: 'Wait For Form', description: 'Ensure form is loaded', type: 'wait', taskInstructions: 'Wait for Name, Email and Message fields to be present and enabled.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['f1'], conditions: [], order: 2, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 'f3', name: 'Fill Name', description: 'Enter full name', type: 'type', taskInstructions: 'Type {{contactName}} into the Name field and verify input value.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['f2'], conditions: [], order: 3, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 'f4', name: 'Fill Email', description: 'Enter email address', type: 'type', taskInstructions: 'Type {{contactEmail}} into the Email field and ensure it matches a valid email format.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['f3'], conditions: [], order: 4, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 'f5', name: 'Fill Message', description: 'Enter message', type: 'type', taskInstructions: 'Type {{contactMessage}} into the Message textarea. Validate non-empty content.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['f4'], conditions: [], order: 5, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'f6', name: 'Attach File (Optional)', description: 'Upload a file if provided', type: 'file-upload', taskInstructions: 'If {{attachmentPath}} is provided, upload the file to the attachment field and confirm filename appears.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['f5'], conditions: [], order: 6, retryCount: 0, maxRetries: 3, timeout: 60, variables: {} },
      { id: 'f7', name: 'Agree and Submit', description: 'Accept terms and submit', type: 'click', taskInstructions: 'Check the terms checkbox if present and click Submit. Handle simple CAPTCHA prompts gracefully if encountered.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['f6'], conditions: [], order: 7, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'f8', name: 'Verify Success', description: 'Confirm submission', type: 'wait', taskInstructions: 'Wait for a success message (e.g., "Thank you" or status 200 response indicator) to become visible.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['f7'], conditions: [], order: 8, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'f9', name: 'Screenshot Receipt', description: 'Capture proof of submission', type: 'screenshot', taskInstructions: 'Capture a screenshot of the success confirmation area for records.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['f8'], conditions: [], order: 9, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} }
    ],
    variables: [
      { name: 'websiteUrl', type: 'string', defaultValue: '', description: 'URL of the website with contact form', isRequired: true, isSecret: false },
      { name: 'contactName', type: 'string', defaultValue: '', description: 'Name to use in the contact form', isRequired: true, isSecret: false },
      { name: 'contactEmail', type: 'string', defaultValue: '', description: 'Email to use in the contact form', isRequired: true, isSecret: false },
      { name: 'contactMessage', type: 'string', defaultValue: '', description: 'Message to send in the contact form', isRequired: true, isSecret: false },
      { name: 'attachmentPath', type: 'string', defaultValue: '', description: 'Optional file path to upload', isRequired: false, isSecret: false }
    ],
    previewImage: '/templates/form-filling.png',
    estimatedTime: 240,
    tags: ['forms', 'automation', 'contact', 'upload'],
    author: 'Nizhal AI',
    version: '1.1'
  },
  {
    id: 'price-monitoring',
    name: 'Price Monitoring',
    description: 'Check price, compare threshold, and notify via webhook with screenshot',
    category: 'monitoring',
    difficulty: 'advanced',
    tasks: [
      { id: 'p1', name: 'Open Product', description: 'Navigate to product page', type: 'navigate', taskInstructions: 'Go to {{productUrl}}. Success criterion: product title and price region are present.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: [], conditions: [], order: 1, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 'p2', name: 'Wait for Price', description: 'Ensure price is visible', type: 'wait', taskInstructions: 'Wait until a price element is visible and not empty (e.g., contains digits).', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['p1'], conditions: [], order: 2, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} },
      { id: 'p3', name: 'Extract Price', description: 'Read current price', type: 'extract', taskInstructions: 'Extract the current price and currency from the page and store as currentPrice and currency. Normalize decimal separators.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['p2'], conditions: [], order: 3, retryCount: 0, maxRetries: 3, timeout: 45, variables: {} },
      { id: 'p4', name: 'Check Threshold', description: 'Compare with target price', type: 'condition', taskInstructions: 'If currentPrice <= {{targetPrice}} then branch TRUE (notify) else branch FALSE (just record evidence).', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['p3'], conditions: [{ type: 'if', condition: 'currentPrice <= targetPrice', trueTasks: [], falseTasks: [] }], order: 4, retryCount: 0, maxRetries: 3, timeout: 15, variables: {} },
      { id: 'p5', name: 'Notify', description: 'Send webhook notification', type: 'api-call', taskInstructions: 'POST {{webhookUrl}} with JSON payload: { productUrl, currentPrice, currency, targetPrice, timestamp }. Expect 2xx to consider success.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 10, allowedDomains: [] }, dependencies: ['p4'], conditions: [], order: 5, retryCount: 0, maxRetries: 3, timeout: 30, variables: {} },
      { id: 'p6', name: 'Screenshot Price', description: 'Capture price area', type: 'screenshot', taskInstructions: 'Capture the price and availability section as evidence and attach to output.', settings: { model: 'gpt-4o-mini', saveBrowserData: true, publicSharing: false, viewportWidth: 1920, viewportHeight: 1080, adBlocker: true, proxy: false, proxyCountry: 'none', highlightElements: false, maxAgentSteps: 5, allowedDomains: [] }, dependencies: ['p3'], conditions: [], order: 6, retryCount: 0, maxRetries: 3, timeout: 20, variables: {} }
    ],
    variables: [
      { name: 'productUrl', type: 'string', defaultValue: '', description: 'URL of the product to monitor', isRequired: true, isSecret: false },
      { name: 'targetPrice', type: 'number', defaultValue: 0, description: 'Target price threshold', isRequired: true, isSecret: false },
      { name: 'webhookUrl', type: 'string', defaultValue: '', description: 'Webhook URL to notify when threshold met', isRequired: false, isSecret: false }
    ],
    previewImage: '/templates/price-monitoring.png',
    estimatedTime: 210,
    tags: ['monitoring', 'e-commerce', 'alerts', 'webhook'],
    author: 'Nizhal AI',
    version: '1.1'
  }
]



