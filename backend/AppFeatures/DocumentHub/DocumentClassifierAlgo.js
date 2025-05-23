//Used to classify an uplaoded document the routes to approapriate place

const axios = require("axios")
const modelName = "gpt-4o" // Using the full GPT-4o model for better accuracy

async function classifyDocument(document, fileType) {
  if (!document) throw new Error("No document provided.")

  const systemPrompt = `
  You are an expert maritime document classifier with deep knowledge of vessel certificates, port documentation, and maritime regulatory requirements. Classify the following document into the most appropriate category:

  PRIMARY CATEGORIES (Classify into one of these first):
  1. 'Vessel Certificate' - Any official certificate related to vessel compliance
  2. 'Crew Document' - Documents related to crew members
  3. 'Port Document' - Documents specific to port entry/departure
  4. 'Cargo Document' - Documents related to cargo
  5. 'Commercial Document' - Commercial agreements, invoices, etc.
  6. 'General' - Documents that don't fit the above categories

  SECONDARY CLASSIFICATION (Only if primary category is 'Vessel Certificate'):
  A. 'Safety Certificate' - Documents related to vessel safety
  B. 'Environmental Certificate' - Documents related to environmental compliance
  C. 'Structural Certificate' - Documents related to vessel structure and class
  D. 'Operational Certificate' - Documents related to vessel operations
  E. 'Regulatory Certificate' - Other regulatory compliance documents

  SPECIFIC MARITIME DOCUMENT TYPES (Examples in each category):
  
  1. Vessel Certificate:
    - Safety Management Certificate (SMC)
    - Document of Compliance (DOC)
    - International Ship Security Certificate (ISSC)
    - International Oil Pollution Prevention Certificate (IOPP)
    - International Air Pollution Prevention Certificate (IAPP)
    - International Sewage Pollution Prevention Certificate (ISPP)
    - International Load Line Certificate
    - Cargo Ship Safety Construction Certificate
    - Cargo Ship Safety Equipment Certificate
    - Cargo Ship Safety Radio Certificate
    - Certificate of Registry
    - Minimum Safe Manning Document
    - Classification Certificate
    - International Tonnage Certificate
    - Continuous Synopsis Record (CSR)
    - Maritime Labour Certificate (MLC)
    - Ballast Water Management Certificate
    - Ship Sanitation Control Certificate
    - Certificate of Fitness (for carrying dangerous chemicals/gas)
    - Polar Ship Certificate
    - Antifouling System Certificate

  2. Crew Document:
    - Crew List
    - Seafarer's Identity Document
    - Seaman's Book
    - Certificate of Competency
    - Medical Certificate
    - STCW Endorsement
    - Crew Contract
    - Crew Vaccination Records
    - Crew Training Certificates
    - Crew Shore Pass

  3. Port Document:
    - Pre-Arrival Notification
    - Port Entry Form
    - Maritime Declaration of Health
    - Dangerous Goods Declaration
    - Waste Declaration
    - Ship's Stores Declaration
    - Passenger List
    - Port State Control Inspection Report
    - Notice of Readiness
    - Statement of Facts

  4. Cargo Document:
    - Bill of Lading (B/L)
    - Cargo Manifest
    - Mate's Receipt
    - Stowage Plan
    - Cargo Declaration
    - Dangerous Goods Manifest
    - Certificate of Origin
    - Packing List
    - Cargo Survey Report
    - Cargo Gear Certificate

  5. Commercial Document:
    - Charter Party
    - Sea Waybill
    - Commercial Invoice
    - Freight Invoice
    - Insurance Certificate
    - Letter of Credit
    - Ship Agency Agreement
    - Bunker Delivery Note
    - Voyage Estimate
    - Freight Report

  IMPORTANT: Return ONLY the raw JSON object with no markdown formatting, no code blocks (no \`\`\`), and no additional commentary. Your entire response must be valid JSON that can be directly parsed.

  Return the classification in the following JSON format:
  {
    "primaryCategory": "[One of the 6 primary categories]",
    "secondaryCategory": "[Only if primary is 'Vessel Certificate', otherwise null]",
    "specificDocumentType": "[Most specific document type if identifiable, otherwise null]",
    "confidence": "[High/Medium/Low]",
    "explanation": "[Brief explanation of classification reasoning]"
  }
`

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Document content: ${document}\n\nFile type (if available): ${fileType || "Not specified"}`,
    },
  ]

  const prompt = {
    model: modelName,
    messages: messages,
    temperature: 0.2,
    response_format: { type: "json_object" }, // Add this to force JSON response format
  }

  try {
    console.log("Sending classification request to OpenAI...")

    const response = await axios.post("https://api.openai.com/v1/chat/completions", prompt, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
    })

    // Extract the AI's response
    const responseText = response.data.choices[0].message.content.trim()

    try {
      // Clean up the response if it contains Markdown code blocks
      let jsonStr = responseText

      // Check if the response contains code blocks
      if (jsonStr.includes("```")) {
        // Try to extract JSON from code blocks
        const matches = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (matches && matches[1]) {
          // If we found a match between code fences, use that
          jsonStr = matches[1].trim()
        } else {
          // Otherwise just strip out all code fence markers
          jsonStr = jsonStr
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
        }
      }

      // Parse the cleaned JSON string
      const classification = JSON.parse(jsonStr)
      console.log("Document classified as:", classification)

      // Return the classification and additional info
      return {
        classification: classification.primaryCategory,
        secondaryCategory: classification.secondaryCategory,
        specificDocumentType: classification.specificDocumentType,
        confidence: classification.confidence,
        explanation: classification.explanation,
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error)
      console.log("Raw response that couldn't be parsed:", responseText)

      // Try a more aggressive approach to extract JSON
      try {
        // Look for anything that looks like JSON object
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const extractedJson = jsonMatch[0]
          console.log("Attempting to parse extracted JSON:", extractedJson)
          const classification = JSON.parse(extractedJson)

          return {
            classification: classification.primaryCategory,
            secondaryCategory: classification.secondaryCategory,
            specificDocumentType: classification.specificDocumentType,
            confidence: classification.confidence,
            explanation: classification.explanation,
          }
        }
      } catch (secondError) {
        console.error("Second attempt at JSON parsing failed:", secondError)
      }

      // If all parsing attempts fail, return uncertain classification
      return {
        classification: "Uncertain",
        documentType: "Uncertain",
        explanation: "Failed to parse AI response into valid classification data",
      }
    }
  } catch (error) {
    console.error("Error classifying document with OpenAI:", error)
    if (error.response) {
      console.error("OpenAI API response data:", JSON.stringify(error.response.data, null, 2))
      if (error.response.status === 401) {
        throw new Error("Authentication failed. Please check your OpenAI API key.")
      } else if (error.response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later or check your OpenAI plan limits.")
      }
    }
    throw new Error("Document classification failed: " + error.message)
  }
}

module.exports = {
  classifyDocument,
}
