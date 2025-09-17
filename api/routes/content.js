import express from 'express'
import { supabase } from '../server.js'
import { processContentFromUrl } from '../utils/contentProcessor.js'

const router = express.Router()

/**
 * POST /api/content/process
 * Process content from URL and generate repurposed versions
 */
router.post('/process', async (req, res) => {
  try {
    const { url } = req.body
    const userId = req.user.id

    // Validate input
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    // Check user's monthly usage limit (implement basic rate limiting)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: usageData, error: usageError } = await supabase
      .from('content_submissions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if (usageError) {
      console.error('Usage check error:', usageError)
      return res.status(500).json({ error: 'Failed to check usage limits' })
    }

    // For now, set a generous limit of 50 per month for all users
    // In production, this would be based on subscription tier
    const monthlyLimit = 50
    if (usageData && usageData.length >= monthlyLimit) {
      return res.status(429).json({ 
        error: 'Monthly usage limit exceeded',
        limit: monthlyLimit,
        used: usageData.length
      })
    }

    // Process the content
    console.log(`Processing content for user ${userId}: ${url}`)
    const result = await processContentFromUrl(url, userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    // Save to database
    const { data: submissionData, error: saveError } = await supabase
      .from('content_submissions')
      .insert({
        user_id: userId,
        original_url: url,
        original_title: result.originalContent.title,
        word_count: result.originalContent.wordCount,
        generated_content: result.data,
        status: 'completed'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Database save error:', saveError)
      return res.status(500).json({ error: 'Failed to save processed content' })
    }

    // Return the generated content
    res.json({
      success: true,
      id: submissionData.id,
      twitter: result.data.twitter,
      linkedin: result.data.linkedin,
      newsletter: result.data.newsletter,
      video: result.data.video,
      metadata: result.data.metadata,
      originalContent: result.originalContent
    })

  } catch (error) {
    console.error('Content processing route error:', error)
    res.status(500).json({ error: 'Internal server error during content processing' })
  }
})

/**
 * GET /api/content/history
 * Get user's content processing history
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const { data, error } = await supabase
      .from('content_submissions')
      .select('id, original_url, original_title, word_count, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('History fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch content history' })
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        limit,
        offset,
        total: data ? data.length : 0
      }
    })

  } catch (error) {
    console.error('History route error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/content/:id
 * Get specific content submission details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data, error } = await supabase
      .from('content_submissions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Content not found' })
    }

    res.json({
      success: true,
      data: {
        id: data.id,
        originalUrl: data.original_url,
        originalTitle: data.original_title,
        wordCount: data.word_count,
        generatedContent: data.generated_content,
        status: data.status,
        createdAt: data.created_at
      }
    })

  } catch (error) {
    console.error('Content detail route error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/content/usage/stats
 * Get user's usage statistics
 */
router.get('/usage/stats', async (req, res) => {
  try {
    const userId = req.user.id
    
    // Get current month usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyData, error: monthlyError } = await supabase
      .from('content_submissions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if (monthlyError) {
      console.error('Monthly usage error:', monthlyError)
      return res.status(500).json({ error: 'Failed to fetch usage statistics' })
    }

    // Get total usage
    const { data: totalData, error: totalError } = await supabase
      .from('content_submissions')
      .select('id')
      .eq('user_id', userId)

    if (totalError) {
      console.error('Total usage error:', totalError)
      return res.status(500).json({ error: 'Failed to fetch total usage statistics' })
    }

    const monthlyLimit = 50 // This would come from user's subscription tier
    const monthlyUsed = monthlyData ? monthlyData.length : 0
    const totalUsed = totalData ? totalData.length : 0

    res.json({
      success: true,
      data: {
        monthly: {
          used: monthlyUsed,
          limit: monthlyLimit,
          remaining: Math.max(0, monthlyLimit - monthlyUsed),
          percentage: Math.round((monthlyUsed / monthlyLimit) * 100)
        },
        total: {
          processed: totalUsed
        },
        period: {
          start: startOfMonth.toISOString(),
          end: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Usage stats route error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
