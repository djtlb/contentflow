import OpenAI from 'openai'
import axios from 'axios'
import * as cheerio from 'cheerio'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * Extract content from a URL
 */
export async function extractContentFromUrl(url) {
  try {
    // Validate URL
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol')
    }

    // Fetch the webpage
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    // Parse HTML content
    const $ = cheerio.load(response.data)
    
    // Remove script and style elements
    $('script, style, nav, footer, aside, .advertisement, .ads').remove()
    
    // Extract title
    const title = $('title').text().trim() || 
                  $('h1').first().text().trim() || 
                  'Untitled Content'
    
    // Extract main content
    let content = ''
    
    // Try to find main content areas
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      'main',
      '.main-content'
    ]
    
    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim()
        break
      }
    }
    
    // Fallback to body content if no main content found
    if (!content) {
      content = $('body').text().trim()
    }
    
    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()
    
    // Limit content length (OpenAI has token limits)
    if (content.length > 8000) {
      content = content.substring(0, 8000) + '...'
    }
    
    return {
      title,
      content,
      url,
      wordCount: content.split(' ').length
    }
    
  } catch (error) {
    console.error('Content extraction error:', error)
    throw new Error(`Failed to extract content from URL: ${error.message}`)
  }
}

/**
 * Generate repurposed content using OpenAI
 */
export async function generateRepurposedContent(extractedContent) {
  try {
    const { title, content } = extractedContent
    
    // Create the prompt for OpenAI
    const systemPrompt = `You are an expert content repurposing specialist. Your task is to transform long-form content into engaging, platform-specific formats while maintaining the core message and value.

Guidelines:
- Keep the original tone and key insights
- Make content engaging and actionable
- Use appropriate formatting for each platform
- Include relevant hashtags where appropriate
- Ensure content is ready to post without editing

Return your response as a JSON object with the following structure:
{
  "twitter": "Twitter thread content (use 🧵 for thread indicator, number tweets 1/X, 2/X, etc.)",
  "linkedin": "LinkedIn post content (professional tone, include relevant hashtags)",
  "newsletter": "Email newsletter section (3-5 key takeaways in bullet points)",
  "video": "Short video script (30-60 seconds, include hook and call-to-action)"
}`

    const userPrompt = `Transform this content into multiple formats:

Title: ${title}

Content: ${content}

Please create engaging, platform-specific versions that capture the essence of this content.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const responseContent = completion.choices[0].message.content
    
    // Parse the JSON response
    let parsedContent
    try {
      parsedContent = JSON.parse(responseContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error('JSON parsing failed, using fallback format')
      parsedContent = {
        twitter: "Content processing completed. Please check the original source for details.",
        linkedin: "Exciting insights from recent content. Check out the full article for more details.",
        newsletter: "• Key insight 1\n• Key insight 2\n• Key insight 3",
        video: "Hook: Did you know... [30-second script based on content]"
      }
    }
    
    return {
      ...parsedContent,
      metadata: {
        originalTitle: title,
        originalUrl: extractedContent.url,
        wordCount: extractedContent.wordCount,
        generatedAt: new Date().toISOString()
      }
    }
    
  } catch (error) {
    console.error('Content generation error:', error)
    throw new Error(`Failed to generate repurposed content: ${error.message}`)
  }
}

/**
 * Process content from URL to final repurposed formats
 */
export async function processContentFromUrl(url, userId) {
  try {
    // Step 1: Extract content from URL
    const extractedContent = await extractContentFromUrl(url)
    
    // Step 2: Generate repurposed content
    const repurposedContent = await generateRepurposedContent(extractedContent)
    
    // Step 3: Return complete package
    return {
      success: true,
      data: repurposedContent,
      originalContent: {
        title: extractedContent.title,
        url: extractedContent.url,
        wordCount: extractedContent.wordCount
      }
    }
    
  } catch (error) {
    console.error('Content processing error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
