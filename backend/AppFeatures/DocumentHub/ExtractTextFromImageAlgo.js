const axios = require("axios")
const { generateAIGuidancePrompt } = require("./DocumentCategories")
const modelName = "gpt-4o"

/**
 * UPDATED: Extract text from image using AI-first classification system
 */
async function extractTextFromImageBase64(base64Image, documentType = null) {
  // Get the AI guidance from our unified classification system
  const aiGuidance = generateAIGuidancePrompt()

  // UPDATED: Maritime-specific system prompt aligned with client categories
  const systemPrompt = `
    You are an expert maritime document OCR system specialized in extracting text, structured data, AND classifying maritime certificates, forms, and documents.
    
    EXTRACTION GUIDELINES:
    1. Extract ALL text visible in the image with high accuracy
    2. Pay special attention to:
       - Document title and type
       - Certificate/document numbers and identifiers
       - Vessel details (name, IMO number, call sign, flag, tonnage)
       - Dates (issue date, expiry date, inspection dates)
       - Issuing authorities and signatures
       - Technical specifications and measurements
       - Compliance standards and regulations referenced
       - Any conditions, limitations or endorsements
    3. Maintain the original formatting where relevant (tables, sections, hierarchies)
    4. For tables, preserve the row/column structure in your extraction
    5. Extract ALL text even if it appears in stamps, watermarks, or handwriting
    6. If text is partially visible or unclear, indicate with [unclear: best guess]
    
    ${aiGuidance}
    
    DATE FORMAT RULES:
    - Always return dates in DD/MM/YYYY format (e.g., 15/01/2023)
    - If you see dates in other formats, convert them to DD/MM/YYYY
    
    ${documentType ? getDocumentSpecificInstructions(documentType) : ""}
    
    RESPONSE FORMAT:
    Return the extracted data in the following JSON format:
    {
      "fullText": "The complete extracted text preserving original structure as much as possible",
      "metadata": {
        "documentTitle": "The title of the document if identifiable",
        "documentType": "The type of certificate or document if identifiable",
        "documentNumber": "Any unique identifier or certificate number",
        "vesselName": "Name of the vessel if present",
        "imoNumber": "IMO number if present",
        "callSign": "Call sign if present",
        "flagState": "Flag state if present",
        "issuer": "Issuing authority or organization",
        "issueDate": "Date in DD/MM/YYYY format if present",
        "expiryDate": "Expiration date in DD/MM/YYYY format if present"
      },
      "classification": {
        "primaryCategory": "one of: statutory, classification, crew, commercial, inspection, general",
        "subcategory": "appropriate subcategory based on primary category",
        "specificDocumentType": "most specific document type if identifiable",
        "confidence": "High/Medium/Low based on image quality and text clarity",
        "explanation": "brief explanation of classification reasoning"
      },
      "keyValuePairs": [
        {"key": "Field name 1", "value": "Field value 1"},
        {"key": "Field name 2", "value": "Field value 2"}
      ]
    }
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Extract all text, structured data, and classify this maritime document image using the exact categories provided. Return the results in the specified JSON format with dates in DD/MM/YYYY format.",
        },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
      ],
    },
  ]

  const prompt = {
    model: modelName,
    messages: messages,
    response_format: { type: "json_object" },
    temperature: 0.1,
  }

  try {
    console.log("Sending image to OpenAI for text extraction and classification...")

    const response = await axios.post("https://api.openai.com/v1/chat/completions", prompt, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let extractionResult

    try {
      extractionResult = JSON.parse(response.data.choices[0].message.content.trim())
      console.log("Successfully extracted structured data and classification from image")

      // Ensure classification object exists with proper defaults
      if (!extractionResult.classification) {
        extractionResult.classification = {
          primaryCategory: "general",
          subcategory: "other",
          specificDocumentType: null,
          confidence: "Low",
          explanation: "Classification data not provided by AI",
        }
      }

      // Validate that primaryCategory is one of our allowed values
      const allowedCategories = ["statutory", "classification", "crew", "commercial", "inspection", "general"]
      if (!allowedCategories.includes(extractionResult.classification.primaryCategory)) {
        console.warn(
          `Invalid primary category: ${extractionResult.classification.primaryCategory}, defaulting to 'general'`,
        )
        extractionResult.classification.primaryCategory = "general"
        extractionResult.classification.subcategory = "other"
      }

      // Convert dates to DD/MM/YYYY format if needed
      if (extractionResult.metadata) {
        if (extractionResult.metadata.issueDate) {
          extractionResult.metadata.issueDate = convertToDateFormat(extractionResult.metadata.issueDate)
        }
        if (extractionResult.metadata.expiryDate) {
          extractionResult.metadata.expiryDate = convertToDateFormat(extractionResult.metadata.expiryDate)
        }
      }

      // Also convert dates in keyValuePairs
      if (extractionResult.keyValuePairs && Array.isArray(extractionResult.keyValuePairs)) {
        extractionResult.keyValuePairs = extractionResult.keyValuePairs.map((pair) => {
          if (
            pair.value &&
            (pair.key.toLowerCase().includes("date") ||
              pair.key.toLowerCase().includes("issued") ||
              pair.key.toLowerCase().includes("expiry") ||
              pair.key.toLowerCase().includes("valid"))
          ) {
            pair.value = convertToDateFormat(pair.value)
          }
          return pair
        })
      }

      console.log("Document classified as:", extractionResult.classification)
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      const rawText = response.data.choices[0].message.content.trim()
      extractionResult = {
        fullText: rawText,
        metadata: {},
        classification: {
          primaryCategory: "general",
          subcategory: "other",
          specificDocumentType: null,
          confidence: "Low",
          explanation: "JSON parsing failed - manual review required",
        },
        keyValuePairs: [],
      }
    }

    return extractionResult
  } catch (error) {
    console.error("Error extracting text from image with OpenAI:", error)
    if (error.response) {
      console.error("API error details:", error.response.data)
      if (error.response.status === 401) {
        throw new Error("Authentication failed. Please check your OpenAI API key.")
      } else if (error.response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later or check your OpenAI plan limits.")
      }
    }
    throw new Error("Text extraction from image failed: " + (error.message || "Unknown error"))
  }
}

// Helper function to convert dates to DD/MM/YYYY format
function convertToDateFormat(dateString) {
  if (!dateString) return dateString

  // If already in DD/MM/YYYY format, return as is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString
  }

  // Try to convert from YYYY-MM-DD format
  const isoFormatMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoFormatMatch) {
    const [_, year, month, day] = isoFormatMatch
    return `${day}/${month}/${year}`
  }

  // Try to parse other date formats
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
  } catch (e) {
    console.warn("Could not parse date:", dateString)
  }

  return dateString
}

// Helper function to get document-specific extraction instructions
function getDocumentSpecificInstructions(documentType) {
  const documentInstructions = {
    "Safety Management Certificate": `
      For Safety Management Certificate (SMC), pay special attention to:
      - The company name and address
      - Type of ship
      - Gross tonnage
      - Compliance with ISM Code requirements
      - Interim or full certificate status
      - Verification audit dates
      - Any conditions of issue
      CLASSIFICATION: This should be classified as 'statutory' with subcategory 'safety'
    `,
    "International Oil Pollution Prevention Certificate": `
      For IOPP Certificate, pay special attention to:
      - Ship type (oil tanker, non-oil tanker)
      - Equipment details (15ppm equipment, slop tanks, etc.)
      - Exemptions granted
      - Endorsements and additional inspections
      - Oil filtering equipment specifications
      CLASSIFICATION: This should be classified as 'statutory' with subcategory 'environmental'
    `,
    "Certificate of Registry": `
      For Certificate of Registry, pay special attention to:
      - Official number and IMO number
      - Port of registry
      - Vessel dimensions (length, breadth, depth)
      - Gross and net tonnage
      - Propulsion details
      - Owner details
      - Build information (shipyard, year)
      CLASSIFICATION: This should be classified as 'statutory' with subcategory 'structural'
    `,
    "Crew List": `
      For Crew List documents, pay special attention to:
      - Table structure with crew details
      - Full names of all crew members
      - Ranks/positions
      - Nationality
      - Date of birth
      - Passport or seaman's book numbers
      - Date and port of embarkation/disembarkation
      CLASSIFICATION: This should be classified as 'crew' with subcategory 'manning'
    `,
    "Bill of Lading": `
      For Bill of Lading, pay special attention to:
      - Shipper and consignee details
      - Notify party
      - Vessel name and voyage number
      - Port of loading and discharge
      - Cargo description
      - Container numbers
      - Quantity, weight, and measurement
      - Freight terms
      - Number of original B/Ls issued
      CLASSIFICATION: This should be classified as 'commercial' with subcategory 'cargo'
    `,
  }

  return documentInstructions[documentType] || ""
}

module.exports = {
  extractTextFromImageBase64,
}
