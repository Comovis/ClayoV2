const { generateText } = require("ai")
const { getOpenAIModel } = require("../ModelConnection")
const { supabaseAdmin } = require("../../SupabaseClient")

// Company context and positioning
const COMPANY_CONTEXT = `
COMPANY: AI Customer Service and Sales Automation Platform
MISSION: Boost Customer Satisfaction & Sales Without the Costs
PRODUCT: AI that trains on company documents, content, and FAQs to provide 24/7 support, qualify leads, schedule appointments, and process orders across multiple channels.

KEY DIFFERENTIATORS:
- 24/7 Support (Never miss a customer inquiry)
- Outdated chatbots sleep. Your customers don't.
- AI trained on YOUR specific data (docs, FAQs, content, products and services)
- Lead qualification and conversion
- Instant responses (no waiting)
- Multi-channel support
- While competition's "support" takes coffee breaks

TONE: Outspoken, opinionated, slightly controversial, direct, value-driven
TARGET: Businesses still using outdated chatbots, human-only support, or poor customer service solutions
POSITIONING: Against lazy, sleeping, ineffective customer service solutions
CATEGORIES: customer-service, ai-automation, product-updates, industry-insights, case-studies
`

const BLOG_TOPICS_SUGGESTIONS = [
  "Why Your Customer Service is Bleeding Money (And Your Customers)",
  "The $50,000 Coffee Break: What Sleeping Chatbots Cost Your Business",
  "Stop Apologizing for Bad Customer Service - Fix It Instead",
  "Your Competitors Are Stealing Customers While Your Support Sleeps",
  "The Death of 'Please Hold': Why 24/7 AI Support Isn't Optional Anymore",
  "Human vs AI Customer Service: The Uncomfortable Truth",
  "Why Your Chatbot Sucks (And How to Fix It Without Firing Everyone)",
  "The Customer Service Revolution: Adapt or Die",
  "Midnight Sales: The Revenue You're Missing While You Sleep",
  "Why 'Business Hours' Are Killing Your Business",
]

/**
 * Helper function to check if a user is a Clayo Admin.
 * @param {string} userId - The ID of the user to check.
 * @returns {Promise<boolean>} True if the user is a Clayo Admin, false otherwise.
 */
async function isUserClayoAdmin(userId) {
  if (!userId) {
    console.warn("isUserClayoAdmin called with null userId.")
    return false
  }
  try {
    const { data, error } = await supabaseAdmin.from("users").select("is_clayo_admin").eq("id", userId).single()

    if (error) {
      console.error("Error checking Clayo Admin status:", error.message)
      return false
    }
    return data?.is_clayo_admin === true
  } catch (e) {
    console.error("Exception in isUserClayoAdmin:", e.message)
    return false
  }
}

/**
 * Generate a complete blog post with SEO optimization
 * @param {Object} params - Blog generation parameters
 * @returns {Promise<Object>} - Generated blog content
 */
async function generateBlogPost({
  title,
  hook,
  targetKeywords = [],
  tone = "controversial",
  wordCount = 1500,
  includeCallToAction = true,
  organizationId,
  userId,
}) {
  try {
    console.log("🤖 Generating blog post:", { title, tone, wordCount })

    // Check if user is authorized
    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can use AI blog generation")
    }

    if (!title || !hook) {
      throw new Error("Title and hook are required for blog generation")
    }

    const model = getOpenAIModel("gpt-4o")

    const systemPrompt = buildBlogSystemPrompt()
    const userPrompt = buildBlogUserPrompt({
      title,
      hook,
      targetKeywords,
      tone,
      wordCount,
      includeCallToAction,
    })

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 4000,
      temperature: 0.7,
    })

    console.log("🤖 Blog Generation - Raw AI Response:")
    console.log("=====================================")
    console.log(result.text)
    console.log("=====================================")
    console.log("Response length:", result.text.length)

    const blogContent = result.text
    const parsedContent = parseBlogContent(blogContent)

    console.log("📋 Parsed blog content summary:")
    console.log("- Title:", parsedContent.title || "NOT FOUND")
    console.log("- Excerpt:", parsedContent.excerpt ? "FOUND" : "NOT FOUND")
    console.log("- Category:", parsedContent.category || "NOT FOUND")
    console.log("- Content length:", parsedContent.content?.length || 0)

    // Generate SEO metadata
    const seoData = await generateSEOMetadata({
      title: parsedContent.title || title,
      content: parsedContent.content,
      targetKeywords,
      userId,
    })

    // Generate slug
    const slug = generateSlug(parsedContent.title || title)

    return {
      success: true,
      blog: {
        title: parsedContent.title || title,
        slug,
        content: parsedContent.content,
        excerpt: parsedContent.excerpt,
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        seoKeywords: seoData.seoKeywords,
        category: parsedContent.category || "technology",
        readTime: calculateReadTime(parsedContent.content),
        status: "draft",
      },
    }
  } catch (error) {
    console.error("❌ Blog generation error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Generate blog topic suggestions based on current trends and company focus
 * @param {Object} params - Suggestion parameters
 * @returns {Promise<Object>} - Topic suggestions
 */
async function generateBlogTopicSuggestions({
  industry = "customer service",
  currentTrends = [],
  competitorAnalysis = "",
  organizationId,
  userId,
}) {
  try {
    console.log("💡 Generating blog topic suggestions")

    // Check if user is authorized
    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can use AI blog generation")
    }

    const model = getOpenAIModel("gpt-4o-mini")

    const systemPrompt = `You are a controversial, opinionated content strategist for an AI customer service platform.
    
    ${COMPANY_CONTEXT}
    
    Generate blog topic suggestions that are:
    - Controversial and attention-grabbing
    - SEO-optimized for customer service, AI, chatbots, automation
    - Take jabs at outdated solutions
    - Provide real business value
    - Target decision-makers frustrated with poor customer service
    - Include emotional triggers (fear, urgency, FOMO, insightful)
    
    Format each suggestion with:
    - Title (controversial and clickable)
    - Hook (one-liner that grabs attention)
    - Target keywords
    - Why it's controversial
    - Business value proposition`

    const userPrompt = `Generate 5 blog topic suggestions for our AI customer service platform.
    
    Industry focus: ${industry}
    Current trends: ${currentTrends.join(", ") || "AI automation, customer experience, cost reduction"}
    Competitor landscape: ${competitorAnalysis || "Many businesses still using outdated chatbots or human-only support"}
    
    Make them controversial, opinionated, and designed to grab attention while providing real value.
    Focus on the pain points of bad customer service and the competitive advantage of 24/7 AI support.`

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 2000,
      temperature: 0.8,
    })

    const suggestions = parseTopicSuggestions(result.text)

    return {
      success: true,
      suggestions:
        suggestions.length > 0
          ? suggestions
          : BLOG_TOPICS_SUGGESTIONS.slice(0, 5).map((title) => ({
              title,
              hook: "A controversial take on modern customer service",
              keywords: ["customer service", "AI", "chatbots", "automation"],
              controversy: "Challenges traditional customer service approaches",
              value: "Helps businesses improve customer satisfaction and reduce costs",
            })),
    }
  } catch (error) {
    console.error("❌ Topic suggestion error:", error)
    return {
      success: false,
      error: error.message,
      suggestions: BLOG_TOPICS_SUGGESTIONS.slice(0, 5).map((title) => ({
        title,
        hook: "A controversial take on modern customer service",
        keywords: ["customer service", "AI", "chatbots", "automation"],
        controversy: "Challenges traditional customer service approaches",
        value: "Helps businesses improve customer satisfaction and reduce costs",
      })),
    }
  }
}

/**
 * Generate SEO metadata for blog content
 * @param {Object} params - SEO parameters
 * @returns {Promise<Object>} - SEO metadata
 */
async function generateSEOMetadata({ title, content, targetKeywords = [], userId }) {
  try {
    // Check if user is authorized
    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can use AI blog generation")
    }

    if (!title || !content) {
      throw new Error("Title and content are required for SEO generation")
    }

    const model = getOpenAIModel("gpt-4o-mini")

    const systemPrompt = `You are an SEO expert specializing in customer service and AI automation content.
    
    Generate SEO-optimized metadata that:
    - Includes target keywords naturally
    - Stays within character limits (title: 60, description: 160)
    - Is compelling and click-worthy
    - Targets business decision-makers
    - Focuses on customer service, AI, automation, chatbots
    
    Return in JSON format:
    {
      "seoTitle": "SEO optimized title (max 60 chars)",
      "seoDescription": "Meta description (max 160 chars)",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }`

    const userPrompt = `Generate SEO metadata for this blog post:
    
    Title: ${title}
    Target Keywords: ${targetKeywords.join(", ") || "customer service, AI, chatbots, automation"}
    Content Preview: ${content.substring(0, 500)}...
    
    Focus on customer service, AI automation, and business benefits.`

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 500,
      temperature: 0.3,
    })

    // Add comprehensive logging
    console.log("🔍 SEO Generation - Raw AI Response:")
    console.log("=====================================")
    console.log(result.text)
    console.log("=====================================")
    console.log("Response length:", result.text.length)
    console.log("Response type:", typeof result.text)

    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = result.text.trim()
      console.log("🧹 Cleaned text:", cleanedText)

      // Handle cases where the text might start or end with markdown or other characters
      const jsonStartIndex = cleanedText.indexOf("{")
      const jsonEndIndex = cleanedText.lastIndexOf("}")

      console.log("📍 JSON boundaries - Start index:", jsonStartIndex, "End index:", jsonEndIndex)

      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1)
        console.log("📄 Extracted JSON text:")
        console.log("=====================================")
        console.log(jsonText)
        console.log("=====================================")

        const seoData = JSON.parse(jsonText)
        console.log("✅ Successfully parsed SEO data:", seoData)

        return {
          seoTitle: seoData.seoTitle || title.substring(0, 60),
          seoDescription: seoData.seoDescription || `Discover how ${title.toLowerCase()} can transform your business.`,
          keywords:
            seoData.keywords || (targetKeywords.length > 0 ? targetKeywords : ["customer service", "AI", "automation"]),
        }
      } else {
        console.error("❌ No valid JSON boundaries found in response")
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("❌ SEO JSON Parse Error Details:")
      console.error("Error message:", parseError.message)
      console.error("Error stack:", parseError.stack)
      console.error("Raw response that failed to parse:", result.text)
      console.warn("Failed to parse SEO JSON, using fallback", parseError)
      return {
        seoTitle: title.substring(0, 60),
        seoDescription: `Discover how ${title.toLowerCase()} can transform your business.`,
        keywords: targetKeywords.length > 0 ? targetKeywords : ["customer service", "AI", "automation"],
      }
    }
  } catch (error) {
    console.error("❌ SEO generation error:", error)
    return {
      seoTitle: title.substring(0, 60),
      seoDescription: `Discover how ${title.toLowerCase()} can transform your business.`,
      keywords: targetKeywords.length > 0 ? targetKeywords : ["customer service", "AI", "automation"],
    }
  }
}

/**
 * Build system prompt for blog generation
 * @returns {string} - System prompt
 */
function buildBlogSystemPrompt() {
  return `You are a controversial, opinionated content writer for an AI customer service platform.

${COMPANY_CONTEXT}

WRITING STYLE:
- Outspoken and opinionated
- Slightly controversial (but professional)
- Direct and no-nonsense
- Take jabs at outdated solutions
- Use emotional triggers (urgency, FOMO, frustration)
- Provide real business value and insights
- Include specific examples and scenarios
- Use data and statistics when relevant
- Challenge conventional wisdom

CONTENT STRUCTURE:
1. Attention-grabbing introduction with controversial hook
2. Problem identification (pain points of current solutions)
3. Controversial takes and industry criticism
4. Solution presentation (our AI platform benefits)
5. Real-world examples and case studies
6. Call-to-action (if requested)
7. Try not to use em-dahses 

TONE EXAMPLES:
- "While your competitors are sleeping, your customers are shopping"
- "Your chatbot isn't just bad - it's costing you customers"
- "Stop apologizing for terrible customer service and fix it"
- "The uncomfortable truth about human-only support"

FORMAT OUTPUT AS:
---TITLE---
[Blog title]

---EXCERPT---
[2-3 sentence excerpt/summary]

---CATEGORY---
[Category: technology/operations/customer-service]

---CONTENT---
[Full blog content in markdown format]

Write compelling, controversial content that grabs attention while providing genuine business value.`
}

/**
 * Build user prompt for blog generation
 * @param {Object} params - Prompt parameters
 * @returns {string} - User prompt
 */
function buildBlogUserPrompt({ title, hook, targetKeywords, tone, wordCount, includeCallToAction }) {
  return `Write a ${wordCount}-word blog post with the following specifications:

TITLE: ${title}
HOOK: ${hook}
TARGET KEYWORDS: ${targetKeywords.join(", ") || "customer service, AI, chatbots, automation"}
TONE: ${tone} (controversial, opinionated, direct)
INCLUDE CTA: ${includeCallToAction ? "Yes - include call-to-action for free trial" : "No"}

REQUIREMENTS:
- Be controversial and opinionated about outdated customer service
- Take jabs at sleeping chatbots and poor human support
- Provide real business value and insights
- Include specific examples of customer service failures
- Challenge readers to think differently
- Use emotional triggers (urgency, FOMO, frustration)
- Include statistics or data points when relevant
- Make it SEO-optimized for the target keywords
- Keep readers engaged throughout

FOCUS AREAS:
- 24/7 availability vs business hours limitations
- AI efficiency vs human inconsistency
- Cost savings and ROI
- Customer satisfaction improvements
- Competitive advantages
- Real-world business scenarios

Make it controversial enough to grab attention but professional enough to build trust.`
}

/**
 * Parse generated blog content into structured format
 * @param {string} content - Raw blog content
 * @returns {Object} - Parsed blog data
 */
function parseBlogContent(content) {
  try {
    console.log("📝 Blog Content Parsing - Raw Content:")
    console.log("=====================================")
    console.log(content)
    console.log("=====================================")
    console.log("Content length:", content.length)

    const sections = content.split("---")
    console.log("📂 Found", sections.length, "sections after splitting by '---'")

    const result = {}

    sections.forEach((section, index) => {
      const trimmed = section.trim()
      console.log(`📄 Section ${index}:`, trimmed.substring(0, 100) + (trimmed.length > 100 ? "..." : ""))

      if (trimmed === "TITLE" && index + 1 < sections.length) {
        const titleContent = sections[index + 1].trim()
        console.log("🏷️ Raw title before cleaning:", titleContent)
        // Clean markdown formatting from title
        let title = titleContent.replace(/^#+\s*\d*\.?\s*/, "").trim()
        title = title.replace(/^["']|["']$/g, "")
        console.log("🏷️ Cleaned title:", title)
        result.title = title
      } else if (trimmed === "EXCERPT" && index + 1 < sections.length) {
        result.excerpt = sections[index + 1].trim()
        console.log("📄 Extracted excerpt:", result.excerpt)
      } else if (trimmed === "CATEGORY" && index + 1 < sections.length) {
        result.category = sections[index + 1].trim()
        console.log("🏷️ Extracted category:", result.category)
      } else if (trimmed === "CONTENT" && index + 1 < sections.length) {
        result.content = sections[index + 1].trim()
        console.log("📝 Extracted content length:", result.content.length)
        console.log("📝 Content preview:", result.content.substring(0, 200) + "...")
      }
    })

    // If parsing fails, use the entire content
    if (!result.content) {
      console.warn("⚠️ No CONTENT section found, using entire raw content")
      result.content = content
    }

    console.log("✅ Final parsed result keys:", Object.keys(result))
    console.log("✅ Final parsed result summary:")
    console.log("- Title:", result.title || "NOT FOUND")
    console.log("- Excerpt length:", result.excerpt?.length || 0)
    console.log("- Category:", result.category || "NOT FOUND")
    console.log("- Content length:", result.content?.length || 0)

    return result
  } catch (error) {
    console.error("❌ Blog content parsing error:", error)
    console.warn("Failed to parse blog content, using raw content")
    return { content }
  }
}

/**
 * Parse topic suggestions from AI response
 * @param {string} content - Raw suggestions content
 * @returns {Array} - Parsed suggestions
 */
function parseTopicSuggestions(content) {
  try {
    console.log("💡 Topic Suggestions Parsing - Raw Content:")
    console.log("=====================================")
    console.log(content)
    console.log("=====================================")

    // Try to extract structured suggestions
    const suggestions = []
    const lines = content.split("\n")
    console.log("📄 Processing", lines.length, "lines")

    let currentSuggestion = {}

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed.length > 0) {
        console.log(`Line ${index}: ${trimmed}`)
      }

      if (trimmed.includes("Title:") || trimmed.includes("TITLE:")) {
        if (currentSuggestion.title) {
          // Only add if we have both title and hook
          if (currentSuggestion.hook) {
            console.log("✅ Adding suggestion:", currentSuggestion.title)
            suggestions.push(currentSuggestion)
          } else {
            console.warn("⚠️ Skipping suggestion without hook:", currentSuggestion.title)
          }
        }
        // Clean markdown formatting from title
        let title = trimmed.replace(/Title:|TITLE:/i, "").trim()
        console.log("🏷️ Raw title:", title)
        title = title.replace(/^#+\s*\d*\.?\s*/, "").trim() // Remove markdown headers and numbering
        title = title.replace(/^["']|["']$/g, "") // Remove quotes
        console.log("🏷️ Cleaned title:", title)
        currentSuggestion = {
          title,
          // Default hook in case none is provided
          hook: "A controversial take on modern customer service",
        }
      } else if (trimmed.includes("Hook:") || trimmed.includes("HOOK:")) {
        currentSuggestion.hook = trimmed.replace(/Hook:|HOOK:/i, "").trim()
        console.log("🎣 Extracted hook:", currentSuggestion.hook)
      } else if (trimmed.includes("Keywords:") || trimmed.includes("KEYWORDS:")) {
        const keywordText = trimmed.replace(/Keywords:|KEYWORDS:/i, "").trim()
        currentSuggestion.keywords = keywordText.split(",").map((k) => k.trim())
        console.log("🔑 Extracted keywords:", currentSuggestion.keywords)
      } else if (trimmed.includes("Controversy:") || trimmed.includes("CONTROVERSY:")) {
        currentSuggestion.controversy = trimmed.replace(/Controversy:|CONTROVERSY:/i, "").trim()
        console.log("💥 Extracted controversy:", currentSuggestion.controversy)
      }
    })

    if (currentSuggestion.title && currentSuggestion.hook) {
      console.log("✅ Adding final suggestion:", currentSuggestion.title)
      suggestions.push(currentSuggestion)
    }

    console.log("📊 Total suggestions extracted:", suggestions.length)
    suggestions.forEach((suggestion, index) => {
      console.log(`Suggestion ${index + 1}:`, {
        title: suggestion.title,
        hook: suggestion.hook?.substring(0, 50) + "...",
        keywordCount: suggestion.keywords?.length || 0,
      })
    })

    // If we didn't get any valid suggestions, use fallbacks
    if (suggestions.length === 0) {
      console.warn("⚠️ No valid suggestions found, using fallback topics")
      return BLOG_TOPICS_SUGGESTIONS.slice(0, 5).map((title) => ({
        title,
        hook: "A controversial take on modern customer service",
        keywords: ["customer service", "AI", "chatbots", "automation"],
        controversy: "Challenges traditional customer service approaches",
        value: "Helps businesses improve customer satisfaction and reduce costs",
      }))
    }

    return suggestions
  } catch (error) {
    console.error("❌ Topic suggestions parsing error:", error)
    console.warn("Failed to parse topic suggestions:", error)
    return BLOG_TOPICS_SUGGESTIONS.slice(0, 5).map((title) => ({
      title,
      hook: "A controversial take on modern customer service",
      keywords: ["customer service", "AI", "chatbots", "automation"],
      controversy: "Challenges traditional customer service approaches",
      value: "Helps businesses improve customer satisfaction and reduce costs",
    }))
  }
}

/**
 * Generate URL-friendly slug from title
 * @param {string} title - Blog title
 * @returns {string} - URL slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Calculate estimated read time
 * @param {string} content - Blog content
 * @returns {number} - Read time in minutes
 */
function calculateReadTime(content) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Save generated blog post to database
 * @param {Object} blogData - Blog post data
 * @param {string} organizationId - Organization ID
 * @param {string} authorId - Author ID
 * @returns {Promise<Object>} - Save result
 */
async function saveBlogPost(blogData, organizationId, authorId) {
  try {
    // Check if user is authorized
    if (!(await isUserClayoAdmin(authorId))) {
      throw new Error("Unauthorized: Only Clayo Admins can save blog posts")
    }

    const postRecord = {
      title: blogData.title,
      slug: blogData.slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      category: blogData.category,
      seo_title: blogData.seoTitle,
      seo_description: blogData.seoDescription,
      seo_keywords: blogData.seoKeywords,
      read_time: blogData.readTime,
      status: blogData.status || "draft",
      author_id: authorId,
      organization_id: organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("blog_posts").insert(postRecord).select().single()

    if (error) throw error

    return {
      success: true,
      post: data,
    }
  } catch (error) {
    console.error("❌ Save blog post error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Check if a blog title already exists in the database
 * @param {string} title - Blog title to check
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} - Check result
 */
async function checkTitleExists(title, userId) {
  try {
    // Check if user is authorized
    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can check titles")
    }

    if (!title) {
      throw new Error("Title is required")
    }

    const slug = generateSlug(title)
    const { data, error } = await supabaseAdmin.from("blog_posts").select("id, title, slug").eq("slug", slug).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return {
      exists: !!data,
      existingPost: data || null,
    }
  } catch (error) {
    console.error("❌ Title check error:", error)
    return {
      exists: false,
      existingPost: null,
      error: error.message,
    }
  }
}

module.exports = {
  generateBlogPost,
  generateBlogTopicSuggestions,
  generateSEOMetadata,
  saveBlogPost,
  parseBlogContent,
  generateSlug,
  calculateReadTime,
  checkTitleExists,
  isUserClayoAdmin,
  BLOG_TOPICS_SUGGESTIONS,
}
