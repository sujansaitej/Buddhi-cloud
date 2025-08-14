export interface PromptTemplate {
  id: string
  name: string
  description: string
  category: string
  template: string
  variables: string[]
  examples: string[]
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  // Universal Automation Prompts
  'universal-authentication': {
    id: 'universal-authentication',
    name: 'Universal Authentication',
    description: 'Universal authentication workflow that works for any website or service',
    category: 'automation',
    template: `Create a universal authentication workflow for {{websiteUrl}} that handles all possible scenarios.

CREDENTIALS:
- Username/Email: {{username}}
- Password: {{password}}

UNIVERSAL AUTHENTICATION STEPS:
1. Navigate to {{websiteUrl}}
2. Check current page state and handle accordingly:
   
   A. If account selection screen appears:
      - Look for account matching username: {{username}}
      - If found and shows "Signed out" or similar status, click on it to proceed with login
      - If found and already signed in, proceed to main service
      - If not found, look for "Use another account" or "Add account" option
   
   B. If login form is visible:
      - Look for username/email input field
      - Enter username: {{username}}
      - Click "Next" or "Continue" button
      - Wait for password field to appear
      - Look for password input field
      - Enter password: {{password}}
      - Click "Sign in" or "Login" button
   
   C. If already logged in (see service-specific indicators):
      - Skip login process and proceed to main task

3. Handle authentication challenges:
   - If 2FA prompt appears, wait for user input or handle as needed
   - If security questions appear, handle appropriately
   - If "Stay signed in" prompt appears, choose appropriate option

4. Verify successful authentication:
   - Look for service-specific success indicators
   - If not found, wait and check again
   - If still not found, go back and try alternative approach

5. Proceed with main task: {{taskDescription}}

INTELLIGENT FALLBACK STRATEGIES:
- Always check current page state before taking action
- Adapt instructions based on what's actually visible
- If stuck on any step, go back and try alternative approach
- Use natural language descriptions for all elements
- Handle all possible authentication flows
- Implement context-aware decision making`,
    variables: ['websiteUrl', 'username', 'password', 'taskDescription'],
    examples: ['Website login', 'Service authentication', 'Portal access', 'Application login']
  },

  'universal-form-filling': {
    id: 'universal-form-filling',
    name: 'Universal Form Filling',
    description: 'Fill out any web form with provided data using natural language',
    category: 'form-filling',
    template: `Fill out the form on {{formUrl}} with the provided information using universal natural language.

FORM DATA:
{{formData}}

UNIVERSAL FORM FILLING STEPS:
1. Navigate to {{formUrl}}
2. Wait for the form to load completely
3. Fill in each field using natural descriptions:
   {{formData}}
4. Review all entered information
5. Submit the form by clicking the submit button
6. Verify successful submission

INTELLIGENT FALLBACK STRATEGIES:
- Use natural language to describe form fields
- If a field is not found, try alternative descriptions
- Wait for elements to be visible and clickable
- Handle form validation errors by going back and correcting
- If stuck, navigate back and try alternative approach`,
    variables: ['formUrl', 'formData'],
    examples: ['Contact form', 'Registration form', 'Survey form', 'Order form', 'Application form']
  },

  'universal-data-extraction': {
    id: 'universal-data-extraction',
    name: 'Universal Data Extraction',
    description: 'Extract data from any website using natural language descriptions',
    category: 'data-extraction',
    template: `Extract the following data from {{websiteUrl}} using universal natural language.

DATA TO EXTRACT:
{{dataToExtract}}

UNIVERSAL DATA EXTRACTION STEPS:
1. Navigate to {{websiteUrl}}
2. Wait for page to load completely
3. Locate the elements containing the required data using natural descriptions
4. Extract the following information:
   {{dataToExtract}}
5. Format the data as requested
6. Return the extracted data in structured format

INTELLIGENT FALLBACK STRATEGIES:
- Use natural descriptions of data elements
- Handle cases where data might not be present
- Validate extracted data format
- Try alternative extraction methods if needed
- If stuck, navigate back and try alternative approach`,
    variables: ['websiteUrl', 'dataToExtract'],
    examples: ['Extract product prices', 'Extract contact information', 'Extract article content', 'Extract user data']
  },

  'universal-workflow': {
    id: 'universal-workflow',
    name: 'Universal Workflow',
    description: 'Create any type of automation workflow using universal natural language',
    category: 'automation',
    template: `Create a universal automation workflow that can handle any scenario using intelligent natural language.

WORKFLOW REQUEST:
{{workflowRequest}}

UNIVERSAL WORKFLOW APPROACH:
1. Analyze the request and identify the main objective
2. Break down the workflow into logical, sequential steps
3. Use universal natural language that works across all websites
4. Include intelligent variable detection and handling
5. Implement robust fallback strategies for all scenarios

WORKFLOW STEPS:
{{workflowSteps}}

INTELLIGENT VARIABLE DETECTION:
- Automatically identify all variables needed for this workflow
- Include variables for dynamic data, credentials, URLs, and content
- Make variables flexible and reusable
- Consider both required and optional variables

UNIVERSAL FALLBACK STRATEGIES:
- Always check current page state before taking action
- Use natural language descriptions for all elements
- If elements are not found, try alternative descriptions
- If stuck, navigate back and try alternative approaches
- Implement loop prevention and error recovery
- Handle authentication scenarios intelligently
- Adapt to different page layouts and states

CONTEXT-AWARE DECISION MAKING:
- Check what's actually visible on the page before acting
- Adapt instructions based on current page state
- Use conditional logic to handle different scenarios
- Provide multiple fallback strategies for each step`,
    variables: ['workflowRequest', 'workflowSteps'],
    examples: ['Any automation scenario', 'Custom workflows', 'Multi-step processes', 'Complex automation']
  },

  'gmail-automation': {
    id: 'gmail-automation',
    name: 'Gmail Automation with Natural Language',
    description: 'Robust Gmail automation using natural language descriptions and intelligent fallback',
    category: 'email',
    template: `Automate Gmail tasks using natural language descriptions and intelligent fallback strategies.

CREDENTIALS:
- Email: {{email}}
- Password: {{password}}

TASK: {{taskDescription}}

NATURAL LANGUAGE WORKFLOW STEPS:
1. Navigate to https://mail.google.com/
2. Check if already logged in by looking for:
   - "Compose" button (most reliable indicator)
   - "Inbox" text or link
   - User profile picture or avatar
   - "Sign out" or "Logout" button
3. If already logged in (found any of above elements):
   - Skip login process
   - Proceed directly to main task
4. If not logged in:
   - Look for the email input field
   - Enter email: {{email}}
   - Click the "Next" button
   - Wait for the password field to appear
   - Look for the password input field
   - Enter password: {{password}}
   - Click the "Next" or "Sign in" button
   - Handle any 2FA prompts if they appear
5. Verify successful login by checking for "Compose" button or "Inbox" text
6. Proceed with main task: {{taskDescription}}
7. If any element is not found, go back and try alternative approaches
8. Validate task completion

INTELLIGENT FALLBACK STRATEGIES:
- If email field is not found, look for "Email or phone" field or any input field
- If password field is not found, wait a moment and try again
- If "Next" button is not found, look for "Continue" or "Sign in" button
- If stuck on any step, navigate back and retry with alternative descriptions
- Use common UI terminology that a human would understand`,
    variables: ['email', 'password', 'taskDescription'],
    examples: ['Check unread emails', 'Send email', 'Organize inbox', 'Delete spam']
  },

  'gmail-intelligent-automation': {
    id: 'gmail-intelligent-automation',
    name: 'Intelligent Gmail Automation',
    description: 'Advanced Gmail automation with intelligent handling of all authentication scenarios',
    category: 'email',
    template: `Create an intelligent Gmail automation workflow that handles all possible authentication scenarios and edge cases.

CREDENTIALS:
- Email: {{email}}
- Password: {{password}}

TASK: {{taskDescription}}

INTELLIGENT WORKFLOW STEPS:
1. Navigate to https://mail.google.com/
2. Check current page state and handle accordingly:
   
   A. If "Choose an account" screen appears:
      - Look for the account matching email: {{email}}
      - If found and shows "Signed out", click on it to proceed with login
      - If found and already signed in, proceed to Gmail
      - If not found, click "Use another account"
   
   B. If Gmail inbox is already loaded (see "Compose" button):
      - Skip login process and proceed to main task
   
   C. If email input field is visible:
      - Enter email: {{email}}
      - Click "Next" button
      - Wait for password field to appear
      - Enter password: {{password}}
      - Click "Next" or "Sign in" button
   
   D. If password field is visible:
      - Enter password: {{password}}
      - Click "Next" or "Sign in" button

3. Handle authentication challenges:
   - If 2FA prompt appears, wait for user input or handle as needed
   - If security questions appear, handle appropriately
   - If "Stay signed in" prompt appears, choose appropriate option

4. Verify successful login:
   - Look for "Compose" button or "Inbox" text
   - If not found, wait and check again
   - If still not found after multiple attempts, go back and try alternative approach

5. Proceed with main task: {{taskDescription}}

6. Implement loop prevention:
   - Track attempts on each page
   - If same page appears 3+ times, try different approach
   - Use alternative navigation strategies when stuck

INTELLIGENT FALLBACK STRATEGIES:
- Always check current page state before taking action
- Adapt instructions based on what's actually visible
- If stuck on any step, go back and try alternative approach
- Use natural language descriptions for all elements
- Handle all possible Google authentication flows
- Implement context-aware decision making`,
    variables: ['email', 'password', 'taskDescription'],
    examples: ['Check unread emails', 'Send email', 'Organize inbox', 'Delete spam', 'Auto reply to emails']
  },

  'google-account-selection': {
    id: 'google-account-selection',
    name: 'Google Account Selection Handler',
    description: 'Intelligent handling of Google account selection screens and authentication flows',
    category: 'automation',
    template: `Create a workflow that intelligently handles Google account selection screens and authentication flows.

CREDENTIALS:
- Email: {{email}}
- Password: {{password}}

TASK: {{taskDescription}}

INTELLIGENT ACCOUNT SELECTION WORKFLOW:
1. Navigate to {{googleServiceUrl}}
2. Check current page state and handle accordingly:

   A. If "Choose an account" screen appears:
      - Look for account matching email: {{email}}
      - If account found and shows "Signed out":
        * Click on the account to proceed with login
        * Wait for password field to appear
        * Enter password: {{password}}
        * Click "Next" or "Sign in" button
      - If account found and already signed in:
        * Click on the account to proceed to service
      - If account not found:
        * Click "Use another account" option
        * Enter email: {{email}}
        * Click "Next" button
        * Enter password: {{password}}
        * Click "Next" or "Sign in" button

   B. If direct login form appears:
      - Enter email: {{email}}
      - Click "Next" button
      - Wait for password field
      - Enter password: {{password}}
      - Click "Next" or "Sign in" button

   C. If already logged in (see service-specific indicators):
      - Skip login process and proceed to main task

3. Handle authentication challenges:
   - 2FA prompts: Wait for user input or handle as needed
   - Security questions: Handle appropriately
   - "Stay signed in" prompts: Choose appropriate option
   - CAPTCHA challenges: Handle if they appear

4. Verify successful authentication:
   - Look for service-specific success indicators
   - If not found, wait and check again
   - If still not found, go back and try alternative approach

5. Proceed with main task: {{taskDescription}}

6. Loop prevention:
   - Track page attempts
   - If same page appears 3+ times, try different approach
   - Use alternative navigation strategies

INTELLIGENT FALLBACK:
- Always check current page state before acting
- Adapt based on what's actually visible
- Use natural language for all element descriptions
- Handle all Google authentication scenarios
- Implement context-aware decision making`,
    variables: ['googleServiceUrl', 'email', 'password', 'taskDescription'],
    examples: ['Gmail login', 'Google Drive access', 'Google Calendar', 'Google Docs']
  },

  'gmail-login-simple': {
    id: 'gmail-login-simple',
    name: 'Gmail Login with Natural Language',
    description: 'Gmail login using natural language descriptions and intelligent fallback',
    category: 'email',
    template: `Login to Gmail using natural language descriptions and intelligent fallback strategies.

CREDENTIALS:
- Email: {{email}}
- Password: {{password}}

NATURAL LANGUAGE LOGIN STEPS:
1. Navigate to https://mail.google.com/
2. Check if already logged in by looking for:
   - "Compose" button (most reliable indicator)
   - "Inbox" text or link
   - User profile picture or avatar
3. If already logged in, skip to step 6
4. If not logged in:
   - Look for the email input field
   - Enter email: {{email}}
   - Click the "Next" button
   - Wait for the password field to appear
   - Look for the password input field
   - Enter password: {{password}}
   - Click the "Next" or "Sign in" button
5. Wait for login to complete
6. Verify successful login by checking for "Compose" button

INTELLIGENT FALLBACK STRATEGIES:
- If email field is not found, look for "Email or phone" field or any input field
- If password field is not found, wait a moment and try again
- If "Next" button is not found, look for "Continue" or "Sign in" button
- If stuck on any step, navigate back and retry with alternative descriptions
- Use common UI terminology that a human would understand`,
    variables: ['email', 'password'],
    examples: ['Gmail login', 'Gmail authentication', 'Email login']
  },

  'robust-authentication': {
    id: 'robust-authentication',
    name: 'Robust Authentication with Fallback',
    description: 'Universal authentication workflow with login state detection and multiple fallback strategies',
    category: 'automation',
    template: `Create a robust authentication workflow for {{websiteUrl}} with comprehensive fallback handling.

CREDENTIALS:
- Username/Email: {{username}}
- Password: {{password}}

ROBUST AUTHENTICATION STEPS:
1. Navigate to {{websiteUrl}}
2. Check current login status by looking for:
   - User profile/avatar elements
   - Logout/Sign out buttons
   - Dashboard or main application elements
   - User menu or account dropdown
3. If already logged in (found any login indicators):
   - Skip authentication process
   - Proceed directly to main workflow
   - Verify access to protected areas
4. If not logged in:
   - Locate login form using multiple selectors:
     * "form[action*='login']" or "form[action*='signin']"
     * "input[type='email']" or "input[name='email']" or "input[name='username']"
     * "input[type='password']" or "input[name='password']"
   - Enter username/email: {{username}}
   - Enter password: {{password}}
   - Click login button using multiple selectors:
     * "button[type='submit']" or "input[type='submit']"
     * "button:contains('Login')" or "button:contains('Sign In')"
     * "Login" or "Sign In" button
5. Handle potential authentication challenges:
   - 2FA prompts (SMS, email, authenticator app)
   - CAPTCHA challenges
   - Security questions
   - Password reset prompts
6. Verify successful authentication by checking for:
   - Disappearance of login form
   - Appearance of user profile elements
   - Access to protected content
   - Redirect to dashboard or main page
7. Handle authentication failures:
   - Invalid credentials error messages
   - Account lockout warnings
   - Network connectivity issues
8. Proceed with main workflow after successful authentication`,
    variables: ['websiteUrl', 'username', 'password'],
    examples: ['Website login', 'Application authentication', 'Portal access', 'Service login']
  },

  'email-compose': {
    id: 'email-compose',
    name: 'Compose Email',
    description: 'Compose and send an email',
    category: 'email',
    template: `Compose and send an email with the following details:
- To: {{recipientEmail}}
- Subject: {{subject}}
- Body: {{messageBody}}

Steps:
1. Click on "Compose" or "New Email" button
2. Enter recipient email: {{recipientEmail}}
3. Enter subject: {{subject}}
4. Enter message body: {{messageBody}}
5. Click "Send" button
6. Verify email was sent successfully`,
    variables: ['recipientEmail', 'subject', 'messageBody'],
    examples: ['Send work email', 'Send personal email', 'Send automated email']
  },

  'email-reply': {
    id: 'email-reply',
    name: 'Reply to Email',
    description: 'Reply to an existing email',
    category: 'email',
    template: `Reply to the email with subject "{{originalSubject}}" with the following message:
{{replyMessage}}

Steps:
1. Find the email with subject "{{originalSubject}}"
2. Click "Reply" button
3. Enter reply message: {{replyMessage}}
4. Click "Send" button
5. Verify reply was sent`,
    variables: ['originalSubject', 'replyMessage'],
    examples: ['Reply to work email', 'Reply to customer inquiry', 'Reply to notification']
  },

  // Social Media Prompts
  'social-login': {
    id: 'social-login',
    name: 'Social Media Login',
    description: 'Login to social media platform with robust fallback handling',
    category: 'social-media',
    template: `Login to {{platform}} with the following credentials:
- Username/Email: {{username}}
- Password: {{password}}

ROBUST LOGIN STEPS WITH FALLBACK HANDLING:
1. Navigate to {{platformUrl}}
2. Check if already logged in by looking for:
   - User profile picture/avatar
   - Logout/Sign out button
   - News feed or main content
   - Navigation menu with user options
3. If already logged in (found any login indicators):
   - Skip login process
   - Proceed directly to main workflow
   - Verify access to platform features
4. If not logged in:
   - Locate login form using multiple selectors:
     * "form[action*='login']" or "form[action*='signin']"
     * "input[type='email']" or "input[name='email']" or "input[name='username']"
     * "input[type='password']" or "input[name='password']"
   - Enter username/email: {{username}}
   - Enter password: {{password}}
   - Click login button using multiple selectors:
     * "button[type='submit']" or "input[type='submit']"
     * "button:contains('Log In')" or "button:contains('Sign In')"
     * "Log In" or "Sign In" button
5. Handle authentication challenges:
   - 2FA prompts (SMS, email, authenticator app)
   - CAPTCHA challenges
   - Security questions
   - Account verification prompts
6. Verify successful login by checking for:
   - Disappearance of login form
   - Appearance of user profile elements
   - Access to platform features
   - Redirect to main page or dashboard
7. Handle login failures:
   - Invalid credentials error messages
   - Account lockout warnings
   - Network connectivity issues
8. Proceed with main workflow after successful authentication`,
    variables: ['platform', 'platformUrl', 'username', 'password'],
    examples: ['LinkedIn login', 'Twitter login', 'Instagram login', 'Facebook login']
  },

  'social-post': {
    id: 'social-post',
    name: 'Create Social Media Post',
    description: 'Create and publish a social media post',
    category: 'social-media',
    template: `Create a social media post on {{platform}} with the following content:
- Text: {{postText}}
- Media: {{mediaUrl}} (if provided)

Steps:
1. Click "Create Post" or "New Post" button
2. Enter post text: {{postText}}
3. Upload media from {{mediaUrl}} if provided
4. Add any relevant hashtags
5. Click "Publish" or "Post" button
6. Verify post was published successfully`,
    variables: ['platform', 'postText', 'mediaUrl'],
    examples: ['LinkedIn post', 'Twitter tweet', 'Instagram post', 'Facebook post']
  },

  // Data Extraction Prompts
  'data-extract': {
    id: 'data-extract',
    name: 'Extract Data from Website',
    description: 'Extract specific data from a website',
    category: 'data-extraction',
    template: `Extract the following data from {{websiteUrl}}:
{{dataToExtract}}

Steps:
1. Navigate to {{websiteUrl}}
2. Wait for page to load completely
3. Locate the elements containing the required data
4. Extract the following information:
   {{dataToExtract}}
5. Format the data as requested
6. Return the extracted data in structured format`,
    variables: ['websiteUrl', 'dataToExtract'],
    examples: ['Extract product prices', 'Extract contact information', 'Extract article content']
  },

  'form-fill': {
    id: 'form-fill',
    name: 'Fill Web Form',
    description: 'Fill out a web form with provided data',
    category: 'form-filling',
    template: `Fill out the form on {{formUrl}} with the following information:
{{formData}}

Steps:
1. Navigate to {{formUrl}}
2. Wait for form to load
3. Fill in each field with the provided data:
   {{formData}}
4. Review all entered information
5. Submit the form
6. Verify successful submission`,
    variables: ['formUrl', 'formData'],
    examples: ['Contact form', 'Registration form', 'Survey form', 'Order form']
  },

  // E-commerce Prompts
  'ecommerce-browse': {
    id: 'ecommerce-browse',
    name: 'Browse E-commerce Products',
    description: 'Browse and search for products on e-commerce site',
    category: 'e-commerce',
    template: `Browse products on {{storeUrl}} with the following criteria:
- Search term: {{searchTerm}}
- Category: {{category}}
- Price range: {{priceRange}}

Steps:
1. Go to {{storeUrl}}
2. Use search bar to search for "{{searchTerm}}"
3. Apply category filter: {{category}}
4. Apply price filter: {{priceRange}}
5. Browse through the results
6. Collect product information as requested`,
    variables: ['storeUrl', 'searchTerm', 'category', 'priceRange'],
    examples: ['Amazon product search', 'eBay browsing', 'Shopify store browsing']
  },

  'ecommerce-purchase': {
    id: 'ecommerce-purchase',
    name: 'Make E-commerce Purchase',
    description: 'Complete a purchase on e-commerce site',
    category: 'e-commerce',
    template: `Purchase the following item from {{storeUrl}}:
- Product: {{productName}}
- Quantity: {{quantity}}
- Shipping address: {{shippingAddress}}
- Payment method: {{paymentMethod}}

Steps:
1. Search for "{{productName}}" on {{storeUrl}}
2. Select the correct product
3. Set quantity to {{quantity}}
4. Add to cart
5. Proceed to checkout
6. Enter shipping address: {{shippingAddress}}
7. Select payment method: {{paymentMethod}}
8. Complete the purchase
9. Verify order confirmation`,
    variables: ['storeUrl', 'productName', 'quantity', 'shippingAddress', 'paymentMethod'],
    examples: ['Amazon purchase', 'eBay purchase', 'Online store purchase']
  },

  // General Automation Prompts
  'website-navigation': {
    id: 'website-navigation',
    name: 'Website Navigation',
    description: 'Navigate through a website following specific steps',
    category: 'automation',
    template: `Navigate through {{websiteUrl}} following these steps:
{{navigationSteps}}

Steps:
{{navigationSteps}}
1. Complete each step in order
2. Wait for page loads between steps
3. Handle any errors or popups
4. Verify completion of each step`,
    variables: ['websiteUrl', 'navigationSteps'],
    examples: ['Website tour', 'Multi-page workflow', 'Navigation sequence']
  },

  'data-entry': {
    id: 'data-entry',
    name: 'Data Entry',
    description: 'Enter data into a system or application',
    category: 'automation',
    template: `Enter the following data into {{systemUrl}}:
{{dataToEnter}}

Steps:
1. Navigate to {{systemUrl}}
2. Login if required
3. Navigate to the data entry section
4. Enter each piece of data:
   {{dataToEnter}}
5. Save the entered data
6. Verify data was saved correctly`,
    variables: ['systemUrl', 'dataToEnter'],
    examples: ['CRM data entry', 'Database entry', 'Application form filling']
  }
}

export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES[id]
}

export function getPromptsByCategory(category: string): PromptTemplate[] {
  return Object.values(PROMPT_TEMPLATES).filter(prompt => prompt.category === category)
}

export function searchPrompts(query: string): PromptTemplate[] {
  const searchTerm = query.toLowerCase()
  return Object.values(PROMPT_TEMPLATES).filter(prompt => 
    prompt.name.toLowerCase().includes(searchTerm) ||
    prompt.description.toLowerCase().includes(searchTerm) ||
    prompt.category.toLowerCase().includes(searchTerm) ||
    prompt.examples.some(example => example.toLowerCase().includes(searchTerm))
  )
}

export function renderPrompt(templateId: string, variables: Record<string, any>): string {
  const template = getPromptTemplate(templateId)
  if (!template) {
    throw new Error(`Prompt template not found: ${templateId}`)
  }

  let renderedPrompt = template.template
  
  // Replace variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    renderedPrompt = renderedPrompt.replace(new RegExp(placeholder, 'g'), String(value))
  })

  return renderedPrompt
}

export function getPromptCategories(): string[] {
  const categories = new Set<string>()
  Object.values(PROMPT_TEMPLATES).forEach(prompt => {
    categories.add(prompt.category)
  })
  return Array.from(categories)
} 