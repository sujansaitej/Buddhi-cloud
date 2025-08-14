import { NextRequest, NextResponse } from 'next/server'

const WORKFLOW_TEMPLATES = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Automate email sending and management tasks',
    category: 'automation',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Gmail',
        description: 'Open Gmail in the browser',
        type: 'navigate',
        taskInstructions: 'Go to gmail.com and wait for the page to load',
        order: 1
      },
      {
        id: 'task2',
        name: 'Login to Gmail',
        description: 'Login with provided credentials',
        type: 'custom',
        taskInstructions: 'Login using email: {{email}} and password: {{password}}',
        order: 2
      },
      {
        id: 'task3',
        name: 'Compose Email',
        description: 'Create a new email',
        type: 'custom',
        taskInstructions: 'Click "Compose" and fill in recipient: {{recipient}}, subject: {{subject}}, and message: {{message}}',
        order: 3
      },
      {
        id: 'task4',
        name: 'Send Email',
        description: 'Send the composed email',
        type: 'custom',
        taskInstructions: 'Click "Send" to send the email',
        order: 4
      }
    ],
    variables: [
      { name: 'email', type: 'email', description: 'Gmail email address', required: true },
      { name: 'password', type: 'password', description: 'Gmail password', required: true },
      { name: 'recipient', type: 'email', description: 'Recipient email address', required: true },
      { name: 'subject', type: 'text', description: 'Email subject', required: true },
      { name: 'message', type: 'text', description: 'Email message content', required: true }
    ]
  },
  {
    id: 'form-filling',
    name: 'Form Filling',
    description: 'Automate filling out web forms',
    category: 'form-filling',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Website',
        description: 'Go to the target website',
        type: 'navigate',
        taskInstructions: 'Navigate to {{website_url}}',
        order: 1
      },
      {
        id: 'task2',
        name: 'Fill Contact Form',
        description: 'Fill out the contact form',
        type: 'custom',
        taskInstructions: 'Fill the form with name: {{name}}, email: {{email}}, phone: {{phone}}, and message: {{message}}',
        order: 2
      },
      {
        id: 'task3',
        name: 'Submit Form',
        description: 'Submit the filled form',
        type: 'custom',
        taskInstructions: 'Click the submit button to send the form',
        order: 3
      }
    ],
    variables: [
      { name: 'website_url', type: 'url', description: 'Target website URL', required: true },
      { name: 'name', type: 'text', description: 'Full name', required: true },
      { name: 'email', type: 'email', description: 'Email address', required: true },
      { name: 'phone', type: 'text', description: 'Phone number', required: false },
      { name: 'message', type: 'text', description: 'Message content', required: true }
    ]
  },
  {
    id: 'data-extraction',
    name: 'Data Extraction',
    description: 'Extract data from websites',
    category: 'data-extraction',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Target Site',
        description: 'Go to the website to extract data from',
        type: 'navigate',
        taskInstructions: 'Navigate to {{website_url}}',
        order: 1
      },
      {
        id: 'task2',
        name: 'Extract Data',
        description: 'Extract the specified data',
        type: 'custom',
        taskInstructions: 'Extract {{data_type}} from the page and save it',
        order: 2
      },
      {
        id: 'task3',
        name: 'Save Results',
        description: 'Save the extracted data',
        type: 'custom',
        taskInstructions: 'Save the extracted data to a file or database',
        order: 3
      }
    ],
    variables: [
      { name: 'website_url', type: 'url', description: 'Target website URL', required: true },
      { name: 'data_type', type: 'text', description: 'Type of data to extract', required: true }
    ]
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      templates: WORKFLOW_TEMPLATES
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch templates',
        success: false 
      },
      { status: 500 }
    )
  }
} 