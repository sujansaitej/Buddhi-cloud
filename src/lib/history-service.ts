import { HistoryEventModel, HistoryEventDocument } from '@/models/History'
import dbConnect from './database'

export interface CreateHistoryEventParams {
  type: string
  title: string
  description: string
  userId: string
  userName: string
  metadata?: Record<string, any>
  severity?: 'info' | 'success' | 'warning' | 'error'
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
  tags?: string[]
}

export interface HistoryEventFilters {
  type?: string
  userId?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  relatedWorkflowId?: string
  relatedTaskId?: string
  tags?: string[]
  limit?: number
  offset?: number
}

export class HistoryService {
  private static generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Create a new history event
   */
  static async createEvent(params: CreateHistoryEventParams): Promise<HistoryEventDocument> {
    try {
      await dbConnect()
      
      const event = new HistoryEventModel({
        id: this.generateEventId(),
        ...params,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      })
      
      return await event.save()
    } catch (error) {
      console.error('Error creating history event:', error)
      throw error
    }
  }

  /**
   * Get history events with filters
   */
  static async getEvents(filters: HistoryEventFilters = {}): Promise<HistoryEventDocument[]> {
    try {
      await dbConnect()
      
      let query: any = {}
      
      if (filters.type) {
        query.type = filters.type
      }
      
      if (filters.userId) {
        query.userId = filters.userId
      }
      
      if (filters.severity) {
        query.severity = filters.severity
      }
      
      if (filters.startDate || filters.endDate) {
        query.timestamp = {}
        if (filters.startDate) {
          query.timestamp.$gte = filters.startDate
        }
        if (filters.endDate) {
          query.timestamp.$lte = filters.endDate
        }
      }
      
      if (filters.relatedWorkflowId) {
        query.relatedWorkflowId = filters.relatedWorkflowId
      }
      
      if (filters.relatedTaskId) {
        query.relatedTaskId = filters.relatedTaskId
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags }
      }
      
      let queryBuilder = HistoryEventModel.find(query)
        .sort({ timestamp: -1 })
      
      if (filters.offset) {
        queryBuilder = queryBuilder.skip(filters.offset)
      }
      
      if (filters.limit) {
        queryBuilder = queryBuilder.limit(filters.limit)
      }
      
      return await queryBuilder.lean()
    } catch (error) {
      console.error('Error fetching history events:', error)
      throw error
    }
  }

  /**
   * Get a single history event by ID
   */
  static async getEvent(eventId: string): Promise<HistoryEventDocument | null> {
    try {
      await dbConnect()
      return await HistoryEventModel.findOne({ id: eventId }).lean()
    } catch (error) {
      console.error('Error fetching history event:', error)
      throw error
    }
  }

  /**
   * Update a history event
   */
  static async updateEvent(eventId: string, updates: Partial<HistoryEventDocument>): Promise<HistoryEventDocument | null> {
    try {
      await dbConnect()
      return await HistoryEventModel.findOneAndUpdate(
        { id: eventId },
        { ...updates, timestamp: new Date() },
        { new: true }
      ).lean()
    } catch (error) {
      console.error('Error updating history event:', error)
      throw error
    }
  }

  /**
   * Delete a history event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await dbConnect()
      const result = await HistoryEventModel.deleteOne({ id: eventId })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting history event:', error)
      throw error
    }
  }

  /**
   * Clean up expired events
   */
  static async cleanupExpiredEvents(): Promise<number> {
    try {
      await dbConnect()
      const result = await HistoryEventModel.deleteMany({
        expiresAt: { $lt: new Date() }
      })
      return result.deletedCount
    } catch (error) {
      console.error('Error cleaning up expired events:', error)
      throw error
    }
  }

  /**
   * Get event statistics
   */
  static async getEventStats(userId?: string): Promise<Record<string, any>> {
    try {
      await dbConnect()
      
      let matchStage: any = {}
      if (userId) {
        matchStage.userId = userId
      }
      
      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            eventsByType: {
              $push: {
                type: '$type',
                severity: '$severity'
              }
            },
            eventsBySeverity: {
              $push: '$severity'
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalEvents: 1,
            eventsByType: 1,
            eventsBySeverity: 1
          }
        }
      ]
      
      const result = await HistoryEventModel.aggregate(pipeline)
      
      if (result.length === 0) {
        return {
          totalEvents: 0,
          eventsByType: {},
          eventsBySeverity: {}
        }
      }
      
      const stats = result[0]
      
      // Process type statistics
      const typeStats: Record<string, number> = {}
      stats.eventsByType.forEach((event: any) => {
        typeStats[event.type] = (typeStats[event.type] || 0) + 1
      })
      
      // Process severity statistics
      const severityStats: Record<string, number> = {}
      stats.eventsBySeverity.forEach((severity: string) => {
        severityStats[severity] = (severityStats[severity] || 0) + 1
      })
      
      return {
        totalEvents: stats.totalEvents,
        eventsByType: typeStats,
        eventsBySeverity: severityStats
      }
    } catch (error) {
      console.error('Error getting event statistics:', error)
      throw error
    }
  }

  /**
   * Convenience methods for common event types
   */
  static async logWorkflowCreated(workflowId: string, workflowName: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'workflow_created',
      title: 'Workflow Created',
      description: `Created new workflow "${workflowName}"`,
      userId,
      userName,
      metadata: { workflowId, workflowName, ...metadata },
      severity: 'success',
      relatedWorkflowId: workflowId,
      tags: ['workflow', 'creation']
    })
  }

  static async logWorkflowEdited(workflowId: string, workflowName: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'workflow_edited',
      title: 'Workflow Edited',
      description: `Modified workflow "${workflowName}"`,
      userId,
      userName,
      metadata: { workflowId, workflowName, ...metadata },
      severity: 'info',
      relatedWorkflowId: workflowId,
      tags: ['workflow', 'modification']
    })
  }

  static async logWorkflowDeleted(workflowId: string, workflowName: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'workflow_deleted',
      title: 'Workflow Deleted',
      description: `Deleted workflow "${workflowName}"`,
      userId,
      userName,
      metadata: { workflowId, workflowName, ...metadata },
      severity: 'warning',
      relatedWorkflowId: workflowId,
      tags: ['workflow', 'deletion']
    })
  }

  static async logTaskExecuted(taskId: string, workflowName: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'task_executed',
      title: 'Task Executed',
      description: `Executed workflow "${workflowName}"`,
      userId,
      userName,
      metadata: { taskId, workflowName, ...metadata },
      severity: 'success',
      relatedTaskId: taskId,
      tags: ['task', 'execution']
    })
  }

  static async logTaskStopped(taskId: string, reason: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'task_stopped',
      title: 'Task Stopped',
      description: `Stopped task due to: ${reason}`,
      userId,
      userName,
      metadata: { taskId, reason, ...metadata },
      severity: 'warning',
      relatedTaskId: taskId,
      tags: ['task', 'stopped']
    })
  }

  static async logTemplateUsed(templateId: string, templateName: string, userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'template_used',
      title: 'Template Used',
      description: `Used template "${templateName}" to create workflow`,
      userId,
      userName,
      metadata: { templateId, templateName, ...metadata },
      severity: 'info',
      relatedTemplateId: templateId,
      tags: ['template', 'usage']
    })
  }

  static async logSettingsChanged(section: string, changes: string[], userId: string, userName: string, metadata?: Record<string, any>) {
    return this.createEvent({
      type: 'settings_changed',
      title: 'Settings Updated',
      description: `Updated ${section} settings`,
      userId,
      userName,
      metadata: { section, changes, ...metadata },
      severity: 'info',
      tags: ['settings', 'modification']
    })
  }
}

export default HistoryService
