import { WorkflowTemplate } from '@/types/workflow'
import dbConnect from './database'
import { TemplateModel } from '@/models/Template'

// Sample templates for initialization
const SAMPLE_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Automate email tasks including login, sending, and organizing emails',
    category: 'email',
    difficulty: 'intermediate',
    tasks: [
      {
        id: 'task1',
        name: 'Login to Email',
        description: 'Navigate to email provider and login',
        type: 'navigate',
        taskInstructions: 'Navigate to Gmail and login with provided credentials',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: ['gmail.com']
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Send Automated Reply',
        description: 'Send automated replies to specific emails',
        type: 'custom',
        taskInstructions: 'Find unread emails and send automated replies based on templates',
        settings: {
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
          allowedDomains: ['gmail.com']
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 120,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'email',
        type: 'string',
        defaultValue: '',
        description: 'Email address for login',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'password',
        type: 'string',
        defaultValue: '',
        description: 'Password for login',
        isRequired: true,
        isSecret: true
      }
    ],
    previewImage: '/templates/email-automation.png',
    estimatedTime: 300,
    tags: ['email', 'automation', 'gmail'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'data-scraping',
    name: 'E-commerce Data Scraping',
    description: 'Extract product information from e-commerce websites',
    category: 'data-extraction',
    difficulty: 'advanced',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Product Page',
        description: 'Navigate to the target e-commerce website',
        type: 'navigate',
        taskInstructions: 'Navigate to the specified e-commerce website product page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Extract Product Data',
        description: 'Extract product information from the page',
        type: 'extract',
        taskInstructions: 'Extract product name, price, description, and images from the page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'productUrl',
        type: 'string',
        defaultValue: '',
        description: 'URL of the product page to scrape',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/data-scraping.png',
    estimatedTime: 180,
    tags: ['scraping', 'e-commerce', 'data'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'form-filling',
    name: 'Contact Form Automation',
    description: 'Automatically fill and submit contact forms on multiple websites',
    category: 'form-filling',
    difficulty: 'beginner',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Contact Page',
        description: 'Navigate to the contact page of the target website',
        type: 'navigate',
        taskInstructions: 'Navigate to the contact page of the specified website',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Fill Contact Form',
        description: 'Fill out the contact form with provided information',
        type: 'type',
        taskInstructions: 'Fill out the contact form with name, email, and message',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task3',
        name: 'Submit Form',
        description: 'Submit the filled contact form',
        type: 'click',
        taskInstructions: 'Click the submit button to send the contact form',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: ['task2'],
        conditions: [],
        order: 3,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'websiteUrl',
        type: 'string',
        defaultValue: '',
        description: 'URL of the website with contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactName',
        type: 'string',
        defaultValue: '',
        description: 'Name to use in the contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactEmail',
        type: 'string',
        defaultValue: '',
        description: 'Email to use in the contact form',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'contactMessage',
        type: 'string',
        defaultValue: '',
        description: 'Message to send in the contact form',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/form-filling.png',
    estimatedTime: 120,
    tags: ['forms', 'automation', 'contact'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'social-media-poster',
    name: 'Social Media Poster',
    description: 'Automatically post content to multiple social media platforms',
    category: 'social-media',
    difficulty: 'intermediate',
    tasks: [
      {
        id: 'task1',
        name: 'Login to Social Platform',
        description: 'Login to the target social media platform',
        type: 'navigate',
        taskInstructions: 'Navigate to the social media platform and login with provided credentials',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Create Post',
        description: 'Create a new post with the provided content',
        type: 'custom',
        taskInstructions: 'Create a new post with the title, content, and image if provided',
        settings: {
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
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 90,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'platform',
        type: 'string',
        defaultValue: '',
        description: 'Social media platform (Facebook, Twitter, LinkedIn, etc.)',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'username',
        type: 'string',
        defaultValue: '',
        description: 'Username for the social media platform',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'password',
        type: 'string',
        defaultValue: '',
        description: 'Password for the social media platform',
        isRequired: true,
        isSecret: true
      },
      {
        name: 'postTitle',
        type: 'string',
        defaultValue: '',
        description: 'Title of the post',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'postContent',
        type: 'string',
        defaultValue: '',
        description: 'Content of the post',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/social-media.png',
    estimatedTime: 240,
    tags: ['social-media', 'automation', 'posting'],
    author: 'Nizhal AI',
    version: '1.0'
  },
  {
    id: 'price-monitoring',
    name: 'Price Monitoring',
    description: 'Monitor product prices across multiple e-commerce websites',
    category: 'monitoring',
    difficulty: 'advanced',
    tasks: [
      {
        id: 'task1',
        name: 'Navigate to Product Page',
        description: 'Navigate to the product page on the target website',
        type: 'navigate',
        taskInstructions: 'Navigate to the specified product page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: [],
        conditions: [],
        order: 1,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      },
      {
        id: 'task2',
        name: 'Extract Price',
        description: 'Extract the current price from the product page',
        type: 'extract',
        taskInstructions: 'Extract the current price and availability status from the page',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 10,
          allowedDomains: []
        },
        dependencies: ['task1'],
        conditions: [],
        order: 2,
        retryCount: 0,
        maxRetries: 3,
        timeout: 60,
        variables: {}
      },
      {
        id: 'task3',
        name: 'Check Price Alert',
        description: 'Check if price meets alert criteria',
        type: 'condition',
        taskInstructions: 'Check if the current price is below the target price and send notification if true',
        settings: {
          model: 'gpt-4o-mini',
          saveBrowserData: true,
          publicSharing: false,
          viewportWidth: 1920,
          viewportHeight: 1080,
          adBlocker: true,
          proxy: false,
          proxyCountry: 'none',
          highlightElements: false,
          maxAgentSteps: 5,
          allowedDomains: []
        },
        dependencies: ['task2'],
        conditions: [],
        order: 3,
        retryCount: 0,
        maxRetries: 3,
        timeout: 30,
        variables: {}
      }
    ],
    variables: [
      {
        name: 'productUrl',
        type: 'string',
        defaultValue: '',
        description: 'URL of the product to monitor',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'targetPrice',
        type: 'number',
        defaultValue: 0,
        description: 'Target price for alert',
        isRequired: true,
        isSecret: false
      },
      {
        name: 'notificationEmail',
        type: 'string',
        defaultValue: '',
        description: 'Email address for price alerts',
        isRequired: true,
        isSecret: false
      }
    ],
    previewImage: '/templates/price-monitoring.png',
    estimatedTime: 150,
    tags: ['monitoring', 'e-commerce', 'price-alerts'],
    author: 'Nizhal AI',
    version: '1.0'
  }
]

async function initializeDatabase() {
  try {
    await dbConnect()
    
    // Check if templates already exist
    const existingTemplates = await TemplateModel.find({})
    
    if (existingTemplates.length === 0) {
      console.log('Initializing templates database with sample templates...')
      
      // Insert sample templates
      for (const template of SAMPLE_TEMPLATES) {
        const templateDoc = new TemplateModel({
          ...template,
          isPublic: true,
          isFeatured: true,
          usageCount: 0,
          rating: 4.8,
          ratingCount: 0,
          status: 'active'
        })
        await templateDoc.save()
      }
      
      console.log(`Successfully initialized ${SAMPLE_TEMPLATES.length} templates`)
    } else {
      console.log(`Database already contains ${existingTemplates.length} templates`)
    }
  } catch (error) {
    console.error('Error initializing templates database:', error)
  }
}

export async function addTemplate(template: WorkflowTemplate): Promise<void> {
  try {
    await dbConnect()
    const templateDoc = new TemplateModel(template)
    await templateDoc.save()
  } catch (error) {
    console.error('Error adding template:', error)
    throw error
  }
}

export async function getTemplates(filters?: {
  category?: string
  difficulty?: string
  search?: string
  isPublic?: boolean
  isFeatured?: boolean
  limit?: number
}): Promise<WorkflowTemplate[]> {
  try {
    await dbConnect()
    
    let query: any = {}
    
    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category
    }
    
    if (filters?.difficulty && filters.difficulty !== 'all') {
      query.difficulty = filters.difficulty
    }
    
    if (filters?.isPublic !== undefined) {
      query.isPublic = filters.isPublic
    }
    
    if (filters?.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured
    }
    
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } }
      ]
    }
    
    let queryBuilder = TemplateModel.find(query)
      .sort({ isFeatured: -1, usageCount: -1, createdAt: -1 })
    
    if (filters?.limit) {
      queryBuilder = queryBuilder.limit(filters.limit)
    }
    
    const templates = await queryBuilder.lean()
    
    return templates.map((template: any) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      tasks: template.tasks,
      variables: template.variables,
      previewImage: template.previewImage,
      estimatedTime: template.estimatedTime,
      tags: template.tags,
      author: template.author,
      version: template.version
    }))
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

export async function getTemplate(id: string): Promise<WorkflowTemplate | undefined> {
  try {
    await dbConnect()
    const template: any = await TemplateModel.findOne({ id }).lean()
    
    if (!template) return undefined
    
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      tasks: template.tasks,
      variables: template.variables,
      previewImage: template.previewImage,
      estimatedTime: template.estimatedTime,
      tags: template.tags,
      author: template.author,
      version: template.version
    }
  } catch (error) {
    console.error('Error fetching template:', error)
    throw error
  }
}

export async function updateTemplate(id: string, updates: Partial<WorkflowTemplate>): Promise<WorkflowTemplate | null> {
  try {
    await dbConnect()
    const template: any = await TemplateModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    
    if (!template) return null
    
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      tasks: template.tasks,
      variables: template.variables,
      previewImage: template.previewImage,
      estimatedTime: template.estimatedTime,
      tags: template.tags,
      author: template.author,
      version: template.version
    }
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}

export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    await dbConnect()
    const result = await TemplateModel.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting template:', error)
    throw error
  }
}

export async function incrementTemplateUsage(id: string): Promise<void> {
  try {
    await dbConnect()
    await TemplateModel.updateOne(
      { id },
      { $inc: { usageCount: 1 } }
    )
  } catch (error) {
    console.error('Error incrementing template usage:', error)
    throw error
  }
}

// Delete all templates and (re)insert provided ones or the defaults
export async function resetTemplates(newTemplates?: WorkflowTemplate[]): Promise<number> {
  try {
    await dbConnect()
    await TemplateModel.deleteMany({})

    const templatesToInsert = (newTemplates && newTemplates.length > 0) ? newTemplates : SAMPLE_TEMPLATES

    for (const template of templatesToInsert) {
      const templateDoc = new TemplateModel({
        ...template,
        isPublic: true,
        isFeatured: true,
        usageCount: 0,
        rating: 4.8,
        ratingCount: 0,
        status: 'active'
      })
      await templateDoc.save()
    }

    return templatesToInsert.length
  } catch (error) {
    console.error('Error resetting templates:', error)
    throw error
  }
}

export function generateTemplateId(): string {
  return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Initialize database on module load
initializeDatabase() 