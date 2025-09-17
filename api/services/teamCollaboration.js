/**
 * Enterprise Team Collaboration System
 * Multi-tenant workspace management for $10B platform
 */

import { createClient } from '@supabase/supabase-js'

class TeamCollaborationService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  /**
   * Create enterprise workspace
   */
  async createWorkspace(organizationData, creatorId) {
    const workspace = {
      id: crypto.randomUUID(),
      name: organizationData.name,
      slug: organizationData.slug || organizationData.name.toLowerCase().replace(/\s+/g, '-'),
      plan: organizationData.plan || 'enterprise',
      settings: {
        brandGuidelines: organizationData.brandGuidelines || {},
        contentApprovalWorkflow: organizationData.workflow || 'standard',
        integrations: organizationData.integrations || [],
        securitySettings: {
          ssoEnabled: true,
          mfaRequired: true,
          ipWhitelist: organizationData.ipWhitelist || [],
          dataRetention: organizationData.dataRetention || '7-years'
        }
      },
      billing: {
        customerId: organizationData.stripeCustomerId,
        subscriptionId: organizationData.stripeSubscriptionId,
        seats: organizationData.seats || 10,
        usage: {
          contentGenerated: 0,
          apiCalls: 0,
          storageUsed: 0
        }
      },
      created_by: creatorId,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('workspaces')
      .insert([workspace])
      .select()
      .single()

    if (error) throw error

    // Create default roles and permissions
    await this.setupDefaultRoles(workspace.id)
    
    // Add creator as admin
    await this.addTeamMember(workspace.id, creatorId, 'admin')

    return data
  }

  /**
   * Setup default roles for workspace
   */
  async setupDefaultRoles(workspaceId) {
    const defaultRoles = [
      {
        workspace_id: workspaceId,
        name: 'admin',
        permissions: [
          'workspace.manage',
          'content.create',
          'content.edit',
          'content.delete',
          'content.publish',
          'team.manage',
          'billing.manage',
          'integrations.manage'
        ]
      },
      {
        workspace_id: workspaceId,
        name: 'editor',
        permissions: [
          'content.create',
          'content.edit',
          'content.publish'
        ]
      },
      {
        workspace_id: workspaceId,
        name: 'contributor',
        permissions: [
          'content.create',
          'content.edit'
        ]
      },
      {
        workspace_id: workspaceId,
        name: 'viewer',
        permissions: [
          'content.view'
        ]
      }
    ]

    const { error } = await this.supabase
      .from('workspace_roles')
      .insert(defaultRoles)

    if (error) throw error
  }

  /**
   * Add team member to workspace
   */
  async addTeamMember(workspaceId, userId, role = 'contributor', invitedBy = null) {
    const membership = {
      workspace_id: workspaceId,
      user_id: userId,
      role: role,
      status: 'active',
      invited_by: invitedBy,
      joined_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('workspace_members')
      .insert([membership])
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Create collaborative content project
   */
  async createContentProject(workspaceId, projectData, creatorId) {
    const project = {
      workspace_id: workspaceId,
      name: projectData.name,
      description: projectData.description,
      type: projectData.type || 'campaign',
      status: 'planning',
      workflow: projectData.workflow || {
        stages: ['draft', 'review', 'approval', 'published'],
        approvers: projectData.approvers || [],
        deadlines: projectData.deadlines || {}
      },
      brand_guidelines: projectData.brandGuidelines || {},
      target_platforms: projectData.platforms || [],
      created_by: creatorId,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('content_projects')
      .insert([project])
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Real-time collaboration on content
   */
  async createCollaborativeSession(projectId, contentId, participants) {
    const session = {
      project_id: projectId,
      content_id: contentId,
      participants: participants,
      status: 'active',
      started_at: new Date().toISOString(),
      activity_log: []
    }

    const { data, error } = await this.supabase
      .from('collaboration_sessions')
      .insert([session])
      .select()
      .single()

    if (error) throw error

    // Set up real-time subscriptions for participants
    await this.setupRealtimeSubscriptions(data.id, participants)

    return data
  }

  /**
   * Content approval workflow
   */
  async submitForApproval(contentId, submitterId, approvers, message = '') {
    const approval = {
      content_id: contentId,
      submitted_by: submitterId,
      approvers: approvers,
      status: 'pending',
      message: message,
      submitted_at: new Date().toISOString(),
      approval_history: []
    }

    const { data, error } = await this.supabase
      .from('content_approvals')
      .insert([approval])
      .select()
      .single()

    if (error) throw error

    // Notify approvers
    await this.notifyApprovers(data.id, approvers)

    return data
  }

  /**
   * Process approval decision
   */
  async processApproval(approvalId, approverId, decision, feedback = '') {
    const { data: approval, error: fetchError } = await this.supabase
      .from('content_approvals')
      .select('*')
      .eq('id', approvalId)
      .single()

    if (fetchError) throw fetchError

    const approvalEntry = {
      approver_id: approverId,
      decision: decision, // 'approved', 'rejected', 'changes_requested'
      feedback: feedback,
      timestamp: new Date().toISOString()
    }

    const updatedHistory = [...(approval.approval_history || []), approvalEntry]
    
    // Check if all approvers have responded
    const allApprovers = approval.approvers
    const respondedApprovers = updatedHistory.map(h => h.approver_id)
    const allResponded = allApprovers.every(id => respondedApprovers.includes(id))
    
    // Determine final status
    let finalStatus = 'pending'
    if (allResponded) {
      const hasRejection = updatedHistory.some(h => h.decision === 'rejected')
      const hasChangesRequested = updatedHistory.some(h => h.decision === 'changes_requested')
      
      if (hasRejection) {
        finalStatus = 'rejected'
      } else if (hasChangesRequested) {
        finalStatus = 'changes_requested'
      } else {
        finalStatus = 'approved'
      }
    }

    const { data, error } = await this.supabase
      .from('content_approvals')
      .update({
        approval_history: updatedHistory,
        status: finalStatus,
        completed_at: allResponded ? new Date().toISOString() : null
      })
      .eq('id', approvalId)
      .select()
      .single()

    if (error) throw error

    // Notify submitter of decision
    await this.notifyApprovalDecision(approval.submitted_by, finalStatus, feedback)

    return data
  }

  /**
   * Enterprise analytics and reporting
   */
  async getWorkspaceAnalytics(workspaceId, timeRange = '30d') {
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    // Content creation metrics
    const { data: contentMetrics } = await this.supabase
      .from('content_submissions')
      .select('created_at, status, user_id')
      .eq('workspace_id', workspaceId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Team collaboration metrics
    const { data: collaborationMetrics } = await this.supabase
      .from('collaboration_sessions')
      .select('started_at, participants, duration')
      .eq('workspace_id', workspaceId)
      .gte('started_at', startDate.toISOString())

    // Approval workflow metrics
    const { data: approvalMetrics } = await this.supabase
      .from('content_approvals')
      .select('submitted_at, status, approval_history')
      .eq('workspace_id', workspaceId)
      .gte('submitted_at', startDate.toISOString())

    return {
      timeRange,
      content: this.analyzeContentMetrics(contentMetrics || []),
      collaboration: this.analyzeCollaborationMetrics(collaborationMetrics || []),
      approvals: this.analyzeApprovalMetrics(approvalMetrics || []),
      team: await this.getTeamMetrics(workspaceId, startDate, endDate)
    }
  }

  /**
   * Advanced team productivity insights
   */
  async getTeamProductivityInsights(workspaceId) {
    const insights = {
      topPerformers: await this.getTopPerformers(workspaceId),
      collaborationPatterns: await this.getCollaborationPatterns(workspaceId),
      contentQualityTrends: await this.getContentQualityTrends(workspaceId),
      workflowEfficiency: await this.getWorkflowEfficiency(workspaceId),
      recommendations: []
    }

    // Generate AI-powered recommendations
    insights.recommendations = await this.generateProductivityRecommendations(insights)

    return insights
  }

  /**
   * White-label workspace customization
   */
  async customizeWorkspaceBranding(workspaceId, brandingData) {
    const branding = {
      logo: brandingData.logo,
      primaryColor: brandingData.primaryColor,
      secondaryColor: brandingData.secondaryColor,
      customDomain: brandingData.customDomain,
      emailTemplates: brandingData.emailTemplates || {},
      customCSS: brandingData.customCSS || '',
      whiteLabel: brandingData.whiteLabel || false
    }

    const { data, error } = await this.supabase
      .from('workspace_branding')
      .upsert([{
        workspace_id: workspaceId,
        ...branding,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Helper methods for analytics
  analyzeContentMetrics(metrics) {
    return {
      totalContent: metrics.length,
      completedContent: metrics.filter(m => m.status === 'completed').length,
      averagePerDay: metrics.length / 30,
      topCreators: this.getTopCreators(metrics)
    }
  }

  analyzeCollaborationMetrics(metrics) {
    return {
      totalSessions: metrics.length,
      averageParticipants: metrics.reduce((sum, m) => sum + m.participants.length, 0) / metrics.length || 0,
      totalCollaborationTime: metrics.reduce((sum, m) => sum + (m.duration || 0), 0)
    }
  }

  analyzeApprovalMetrics(metrics) {
    return {
      totalApprovals: metrics.length,
      approvalRate: metrics.filter(m => m.status === 'approved').length / metrics.length || 0,
      averageApprovalTime: this.calculateAverageApprovalTime(metrics)
    }
  }

  async setupRealtimeSubscriptions(sessionId, participants) {
    // Implementation for real-time collaboration setup
    // This would integrate with Supabase real-time features
  }

  async notifyApprovers(approvalId, approvers) {
    // Implementation for approval notifications
    // This would integrate with email/notification service
  }

  async notifyApprovalDecision(userId, status, feedback) {
    // Implementation for approval decision notifications
  }

  async getTopPerformers(workspaceId) {
    // Implementation for top performer analysis
    return []
  }

  async getCollaborationPatterns(workspaceId) {
    // Implementation for collaboration pattern analysis
    return {}
  }

  async getContentQualityTrends(workspaceId) {
    // Implementation for content quality trend analysis
    return {}
  }

  async getWorkflowEfficiency(workspaceId) {
    // Implementation for workflow efficiency analysis
    return {}
  }

  async generateProductivityRecommendations(insights) {
    // AI-powered recommendations based on insights
    return []
  }

  getTopCreators(metrics) {
    const creatorCounts = {}
    metrics.forEach(m => {
      creatorCounts[m.user_id] = (creatorCounts[m.user_id] || 0) + 1
    })
    
    return Object.entries(creatorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }))
  }

  calculateAverageApprovalTime(metrics) {
    const completedApprovals = metrics.filter(m => m.completed_at)
    if (completedApprovals.length === 0) return 0
    
    const totalTime = completedApprovals.reduce((sum, m) => {
      const submitted = new Date(m.submitted_at)
      const completed = new Date(m.completed_at)
      return sum + (completed - submitted)
    }, 0)
    
    return totalTime / completedApprovals.length / (1000 * 60 * 60) // Convert to hours
  }

  async getTeamMetrics(workspaceId, startDate, endDate) {
    const { data: members } = await this.supabase
      .from('workspace_members')
      .select('user_id, role, joined_at')
      .eq('workspace_id', workspaceId)
      .eq('status', 'active')

    return {
      totalMembers: members?.length || 0,
      newMembers: members?.filter(m => new Date(m.joined_at) >= startDate).length || 0,
      roleDistribution: this.getRoleDistribution(members || [])
    }
  }

  getRoleDistribution(members) {
    const distribution = {}
    members.forEach(m => {
      distribution[m.role] = (distribution[m.role] || 0) + 1
    })
    return distribution
  }
}

export default TeamCollaborationService
