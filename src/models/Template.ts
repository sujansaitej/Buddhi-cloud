import mongoose, { Schema, Document } from 'mongoose'
import { WorkflowTemplate } from '@/types/workflow'

// Task Settings Schema (reused from Workflow model)
const TaskSettingsSchema = new Schema({
  model: { type: String, default: 'gpt-4o' },
  saveBrowserData: { type: Boolean, default: true },
  publicSharing: { type: Boolean, default: false },
  viewportWidth: { type: Number, default: 1280 },
  viewportHeight: { type: Number, default: 960 },
  adBlocker: { type: Boolean, default: true },
  proxy: { type: Boolean, default: true },
  proxyCountry: { type: String, default: 'us' },
  highlightElements: { type: Boolean, default: false },
  maxAgentSteps: { type: Number, default: 50 },
  allowedDomains: [{ type: String }],
  browserProfileId: { type: String }
})

// Task Condition Schema (reused from Workflow model)
const TaskConditionSchema = new Schema({
  type: { type: String, enum: ['if', 'while', 'for'], required: true },
  condition: { type: String, required: true },
  trueTasks: [{ type: String }],
  falseTasks: [{ type: String }],
  maxIterations: { type: Number }
})

// Workflow Task Schema (reused from Workflow model)
const WorkflowTaskSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['navigate', 'click', 'type', 'extract', 'wait', 'condition', 'loop', 'api-call', 'file-upload', 'file-download', 'screenshot', 'custom'],
    required: true 
  },
  taskInstructions: { type: String, required: true },
  settings: { type: TaskSettingsSchema, default: () => ({}) },
  dependencies: [{ type: String }],
  conditions: [TaskConditionSchema],
  order: { type: Number, required: true },
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  timeout: { type: Number, default: 30 },
  variables: { type: Schema.Types.Mixed, default: {} }
})

// Workflow Variable Schema (reused from Workflow model)
const WorkflowVariableSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['string', 'number', 'boolean', 'array', 'object'],
    required: true 
  },
  defaultValue: Schema.Types.Mixed,
  description: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
  isSecret: { type: Boolean, default: false }
})

// Main Template Schema
const TemplateSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['automation', 'data-extraction', 'form-filling', 'monitoring', 'testing', 'social-media', 'e-commerce', 'email'],
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate' 
  },
  tasks: [WorkflowTaskSchema],
  variables: [WorkflowVariableSchema],
  previewImage: { type: String },
  estimatedTime: { type: Number, default: 300 }, // in seconds
  tags: [{ type: String }],
  author: { type: String, default: 'Nizhal AI' },
  version: { type: String, default: '1.0' },
  
  // Template management fields
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'admin' },
  status: { 
    type: String, 
    enum: ['active', 'draft', 'archived'],
    default: 'active' 
  }
})

// Update the updatedAt field before saving
TemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create indexes for better performance
TemplateSchema.index({ id: 1 })
TemplateSchema.index({ category: 1 })
TemplateSchema.index({ difficulty: 1 })
TemplateSchema.index({ isPublic: 1 })
TemplateSchema.index({ isFeatured: 1 })
TemplateSchema.index({ status: 1 })
TemplateSchema.index({ tags: 1 })

export interface TemplateDocument extends Omit<WorkflowTemplate, 'id'>, Document {
  id: string
  isPublic: boolean
  isFeatured: boolean
  usageCount: number
  rating: number
  ratingCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  status: string
}

// Check if model already exists to prevent overwriting
export const TemplateModel = mongoose.models.Template || mongoose.model<TemplateDocument>('Template', TemplateSchema) 