const pdfParse = require("pdf-parse")
const axios = require("axios")
const { generateAIGuidancePrompt } = require("./DocumentCategories")
const modelName = "gpt-4o"

/**
 * Enhanced PDF processor that extracts text, structured metadata, AND classification
 * UPDATED: Now uses AI-first classification system with your exact categories
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} documentType - Optional document type hint
 * @returns {Object} Extracted text, metadata, and classification
 */
async function processPDFDocument(fileBuffer, documentType = null) {
  try {
    // Step 1: Extract raw text from PDF using pdf-parse
    console.log("Extracting text from PDF...")
    const pdfData = await pdfParse(fileBuffer)
    const extractedText = pdfData.text

    // Step 2: Use AI to extract structured metadata AND classification from the text
    console.log("Extracting metadata and classification from PDF text...")
    const extractionResult = await extractMetadataAndClassificationFromText(extractedText, documentType)

    return {
      fullText: extractedText,
      metadata: extractionResult.metadata,
      classification: extractionResult.classification,
      keyValuePairs: extractionResult.keyValuePairs,
    }
  } catch (error) {
    console.error("Error processing PDF document:", error)

    // Fallback to alternative PDF parser if primary fails
    try {
      console.log("Trying alternative PDF parser...")
      const fallbackData = await alternativePdfParse(fileBuffer)
      const extractionResult = await extractMetadataAndClassificationFromText(fallbackData.text, documentType)

      return {
        fullText: fallbackData.text,
        metadata: extractionResult.metadata,
        classification: extractionResult.classification,
        keyValuePairs: extractionResult.keyValuePairs,
      }
    } catch (fallbackError) {
      console.error("Error processing PDF with alternative parser:", fallbackError)
      throw new Error("PDF processing failed with both parsers: " + fallbackError.message)
    }
  }
}

/**
 * Alternative PDF parser using pdfjs-dist
 */
async function alternativePdfParse(fileBuffer) {
  const pdfjsLib = await import("pdfjs-dist/build/pdf")
  const loadingTask = pdfjsLib.getDocument({ data: fileBuffer })
  const pdf = await loadingTask.promise
  let text = ""

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1)
    const content = await page.getTextContent()
    const strings = content.items.map((item) => item.str)
    text += strings.join(" ")
  }

  return { text }
}

/**
 * UPDATED: Extract structured metadata AND classification using AI-first approach
 */
async function extractMetadataAndClassificationFromText(text, documentType = null) {
  // Get the AI guidance from our unified classification system
  const aiGuidance = generateAIGuidancePrompt()

  // Create a maritime-specific system prompt with integrated classification
  const systemPrompt = `
    You are an expert maritime document processor specialized in extracting structured data AND classifying maritime certificates, forms, and documents.
    
    EXTRACTION GUIDELINES:
    1. Analyze the provided text from a maritime document
    2. Extract key metadata including:
       - Document title and type
       - Certificate/document numbers and identifiers
       - Vessel details (name, IMO number, call sign, flag, tonnage)
       - Dates (issue date, expiry date, inspection dates)
       - Issuing authorities
    3. Format all dates in DD/MM/YYYY format
    4. Identify key-value pairs present in the document
    
    ${aiGuidance}
    
    DATE FORMAT RULES:
    - Always return dates in DD/MM/YYYY format (e.g., 15/01/2023)
    - If you see dates in other formats, convert them to DD/MM/YYYY
    
    ${documentType ? getDocumentSpecificInstructions(documentType) : ""}
    
    RESPONSE FORMAT:
    Return the extracted data in the following JSON format:
    {
      "metadata": {
        "documentTitle": "The title of the document if identifiable",
        "documentType": "The type of certificate or document if identifiable",
        "documentNumber": "Any unique identifier or certificate number",
        "vesselName": "Name of the vessel if present",
        "imoNumber": "IMO number if present",
        "callSign": "Call sign if present",
        "flagState": "Flag state if present",
        "grossTonnage": "Gross tonnage if present",
        "issuer": "Issuing authority or organization",
        "issueDate": "Date of issuance in DD/MM/YYYY format if present",
        "expiryDate": "Expiration date in DD/MM/YYYY format if present"
      },
      "classification": {
        "primaryCategory": "one of: statutory, classification, crew, commercial, inspection, general",
        "subcategory": "appropriate subcategory based on primary category",
        "specificDocumentType": "most specific document type if identifiable",
        "confidence": "High/Medium/Low",
        "explanation": "brief explanation of classification reasoning"
      },
      "keyValuePairs": [
        {"key": "Field name 1", "value": "Field value 1"},
        {"key": "Field name 2", "value": "Field value 2"}
      ]
    }
  `

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Extract structured data and classify this maritime document text using the exact categories provided: 

${text.substring(0, 8000)}`,
    },
  ]

  const prompt = {
    model: modelName,
    messages: messages,
    response_format: { type: "json_object" },
    temperature: 0.1,
  }

  try {
    console.log("Sending text to OpenAI for metadata extraction and classification...")

    const response = await axios.post("https://api.openai.com/v1/chat/completions", prompt, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let extractionResult

    try {
      extractionResult = JSON.parse(response.data.choices[0].message.content.trim())
      console.log("Successfully extracted structured data and classification from text")

      // Clean up the extraction result
      extractionResult = cleanExtractionResult(extractionResult)

      console.log("Document classified as:", extractionResult.classification)
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      extractionResult = {
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
    console.error("Error extracting metadata from text with OpenAI:", error)
    if (error.response) {
      console.error("API error details:", error.response.data)
      if (error.response.status === 401) {
        throw new Error("Authentication failed. Please check your OpenAI API key.")
      } else if (error.response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later or check your OpenAI plan limits.")
      }
    }
    throw new Error("Metadata extraction failed: " + (error.message || "Unknown error"))
  }
}

/**
 * Clean and validate extraction result
 */
function cleanExtractionResult(extractionResult) {
  // Ensure metadata object exists
  if (!extractionResult.metadata) {
    extractionResult.metadata = {}
  }

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

  const metadata = extractionResult.metadata

  // Clean IMO number (remove "IMO" prefix if present)
  if (metadata.imoNumber) {
    metadata.imoNumber = metadata.imoNumber.replace(/^IMO\s*/i, "").trim()
  }

  // Use the improved date conversion function
  if (metadata.issueDate) {
    metadata.issueDate = convertToDateFormat(metadata.issueDate)
  }

  if (metadata.expiryDate) {
    metadata.expiryDate = convertToDateFormat(metadata.expiryDate)
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

  // Clean up empty or null values in metadata
  Object.keys(metadata).forEach((key) => {
    if (metadata[key] === null || metadata[key] === "" || metadata[key] === "Not found" || metadata[key] === "N/A") {
      delete metadata[key]
    }
  })

  // Ensure keyValuePairs array exists
  if (!extractionResult.keyValuePairs) {
    extractionResult.keyValuePairs = []
  }

  return extractionResult
}

/**
 * Convert dates to DD/MM/YYYY format
 */
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

/**
 * Get document-specific extraction instructions
 */
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
  processPDFDocument,
}
