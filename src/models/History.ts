import mongoose, { Schema, Document } from 'mongoose'

// History Event Schema
const HistoryEventSchema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: [
      'workflow_created', 
      'workflow_edited', 
      'workflow_deleted', 
      'task_executed', 
      'task_stopped', 
      'task_paused', 
      'task_resumed', 
      'template_used', 
      'settings_changed',
      'user_login',
      'user_logout',
      'credential_added',
      'credential_updated',
      'credential_deleted',
      'browser_profile_created',
      'browser_profile_updated',
      'browser_profile_deleted'
    ],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  severity: { 
    type: String, 
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  
  // Additional fields for better tracking
  sessionId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  
  // Related entity references
  relatedWorkflowId: { type: String },
  relatedTaskId: { type: String },
  relatedTemplateId: { type: String },
  relatedCredentialId: { type: String },
  relatedBrowserProfileId: { type: String },
  
  // Performance metrics
  executionTime: { type: Number }, // in milliseconds
  resourceUsage: { type: Schema.Types.Mixed }, // CPU, memory, etc.
  
  // Tags for categorization
  tags: [{ type: String }],
  
  // Retention policy
  expiresAt: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // 1 year default
})

// Indexes for better performance
HistoryEventSchema.index({ id: 1 })
HistoryEventSchema.index({ type: 1 })
HistoryEventSchema.index({ userId: 1 })
HistoryEventSchema.index({ timestamp: -1 })
HistoryEventSchema.index({ severity: 1 })
HistoryEventSchema.index({ relatedWorkflowId: 1 })
HistoryEventSchema.index({ relatedTaskId: 1 })
HistoryEventSchema.index({ tags: 1 })
HistoryEventSchema.index({ expiresAt: 1 })

// TTL index for automatic cleanup
HistoryEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Update the updatedAt field before saving
HistoryEventSchema.pre('save', function(next) {
  this.timestamp = new Date()
  next()
})

export interface HistoryEventDocument extends Document {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
  userId: string
  userName: string
  metadata: Record<string, any>
  severity: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  relatedWorkflowId?: string
  relatedTaskId?: string
  relatedTemplateId?: string
  relatedCredentialId?: string
  relatedBrowserProfileId?: string
  executionTime?: number
  resourceUsage?: Record<string, any>
  tags: string[]
  expiresAt: Date
}

// Check if model already exists to prevent overwriting
export const HistoryEventModel = mongoose.models.HistoryEvent || mongoose.model<HistoryEventDocument>('HistoryEvent', HistoryEventSchema)
