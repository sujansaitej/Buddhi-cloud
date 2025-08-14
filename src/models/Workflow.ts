import mongoose, { Schema, Document } from 'mongoose'
import { Workflow } from '@/types/workflow'

// Task Settings Schema
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

// Task Condition Schema
const TaskConditionSchema = new Schema({
  type: { type: String, enum: ['if', 'while', 'for'], required: true },
  condition: { type: String, required: true },
  trueTasks: [{ type: String }],
  falseTasks: [{ type: String }],
  maxIterations: { type: Number }
})

// Workflow Task Schema
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

// Workflow Variable Schema
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

// Workflow Trigger Schema
const WorkflowTriggerSchema = new Schema({
  type: { 
    type: String, 
    enum: ['manual', 'schedule', 'webhook', 'event'],
    required: true 
  },
  config: { type: Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true }
})

// Workflow Settings Schema
const WorkflowSettingsSchema = new Schema({
  enableLogging: { type: Boolean, default: true },
  maxExecutionTime: { type: Number, default: 3600 },
  enableNotifications: { type: Boolean, default: false },
  notificationEmail: { type: String },
  retryOnFailure: { type: Boolean, default: true },
  maxRetries: { type: Number, default: 3 },
  // Universal settings for all tasks in the workflow
  model: { type: String, default: 'gpt-4o-mini' },
  saveBrowserData: { type: Boolean, default: true },
  publicSharing: { type: Boolean, default: false },
  viewportWidth: { type: Number, default: 1920 },
  viewportHeight: { type: Number, default: 1080 },
  adBlocker: { type: Boolean, default: true },
  proxy: { type: Boolean, default: false },
  proxyCountry: { type: String, default: 'none' },
  highlightElements: { type: Boolean, default: false },
  maxAgentSteps: { type: Number, default: 15 },
  allowedDomains: [{ type: String }],
  browserProfileId: { type: String }
})

// Main Workflow Schema
const WorkflowSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['automation', 'data-extraction', 'form-filling', 'monitoring', 'testing', 'social-media', 'e-commerce'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'archived'],
    default: 'active' 
  },
  tasks: [WorkflowTaskSchema],
  variables: [WorkflowVariableSchema],
  triggers: [WorkflowTriggerSchema],
  settings: { type: WorkflowSettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'user' },
  version: { type: Number, default: 1 }
})

// Update the updatedAt field before saving
WorkflowSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create indexes for better performance
WorkflowSchema.index({ id: 1 })
WorkflowSchema.index({ category: 1 })
WorkflowSchema.index({ status: 1 })
WorkflowSchema.index({ createdBy: 1 })

export interface WorkflowDocument extends Omit<Workflow, 'id'>, Document {
  id: string
}

// Check if model already exists to prevent overwriting
export const WorkflowModel = mongoose.models.Workflow || mongoose.model<WorkflowDocument>('Workflow', WorkflowSchema) 