const pdfParse = require("pdf-parse")
const axios = require("axios")
const modelName = "gpt-4o-mini" // Using mini for cost efficiency

/**
 * Enhanced PDF processor that extracts both text and structured metadata
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} documentType - Optional document type hint
 * @returns {Object} Extracted text and metadata
 */
async function processPDFDocument(fileBuffer, documentType = null) {
  try {
    // Step 1: Extract raw text from PDF using pdf-parse
    console.log("Extracting text from PDF...")
    const pdfData = await pdfParse(fileBuffer)
    const extractedText = pdfData.text

    // Step 2: Use AI to extract structured metadata from the text
    console.log("Extracting metadata from PDF text...")
    const extractionResult = await extractMetadataFromText(extractedText, documentType)

    return {
      fullText: extractedText,
      metadata: extractionResult.metadata,
      keyValuePairs: extractionResult.keyValuePairs,
    }
  } catch (error) {
    console.error("Error processing PDF document:", error)

    // Fallback to alternative PDF parser if primary fails
    try {
      console.log("Trying alternative PDF parser...")
      const fallbackData = await alternativePdfParse(fileBuffer)
      const extractionResult = await extractMetadataFromText(fallbackData.text, documentType)

      return {
        fullText: fallbackData.text,
        metadata: extractionResult.metadata,
        keyValuePairs: extractionResult.keyValuePairs,
      }
    } catch (fallbackError) {
      console.error("Error processing PDF with alternative parser:", fallbackError)
      throw new Error("PDF processing failed with both parsers.")
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
 * Extract structured metadata from text using OpenAI
 */
async function extractMetadataFromText(text, documentType = null) {
  // Create a maritime-specific system prompt
  const systemPrompt = `
    You are an expert maritime document processor specialized in extracting structured data from maritime certificates, forms, and documents.
    
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
    5. Always return dates in YYYY-MM-DD format (e.g., 2025-06-01, not 01/06/2025)
    6. DATE FORMAT RULES:
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
        "flagState": "Flag state if present",
        "grossTonnage": "Gross tonnage if present",
        "issuer": "Issuing authority or organization",
        "issueDate": "Date of issuance in DD/MM/YYYY format if present",
        "expiryDate": "Expiration date in DD/MM/YYYY format if present"
      },
      "keyValuePairs": [
        {"key": "Field name 1", "value": "Field value 1"},
        {"key": "Field name 2", "value": "Field value 2"}
        // All other key-value pairs identified in the document
      ]
    }
  `

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Extract structured data from this maritime document text: 

${text.substring(0, 8000)}`, // Limit text length to avoid token limits
    },
  ]

  const prompt = {
    model: modelName,
    messages: messages,
    response_format: { type: "json_object" }, // Ensure JSON response
    temperature: 0.1, // Lower temperature for more consistent extraction
  }

  try {
    console.log("Sending text to OpenAI for metadata extraction...")

    const response = await axios.post("https://api.openai.com/v1/chat/completions", prompt, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let extractionResult

    try {
      // Parse the JSON response
      extractionResult = JSON.parse(response.data.choices[0].message.content.trim())
      console.log("Successfully extracted structured data from text")

      // Clean up the extraction result
      extractionResult = cleanExtractionResult(extractionResult)
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      extractionResult = {
        metadata: {},
        keyValuePairs: [],
      }
    }

    return extractionResult
  } catch (error) {
    console.error("Error extracting metadata from text with OpenAI:", error)
    if (error.response) {
      console.error("API error details:", error.response.data)
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

  const metadata = extractionResult.metadata

  // Clean IMO number (remove "IMO" prefix if present)
  if (metadata.imoNumber) {
    metadata.imoNumber = metadata.imoNumber.replace(/^IMO\s*/i, "").trim()
  }

  // Validate date formats (should be DD/MM/YYYY)
  if (metadata.issueDate) {
    metadata.issueDate = validateDateFormat(metadata.issueDate)
  }

  if (metadata.expiryDate) {
    metadata.expiryDate = validateDateFormat(metadata.expiryDate)
  }

  // Clean up empty or null values
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
 * Validate and normalize date format to DD/MM/YYYY
 */
function validateDateFormat(dateString) {
  if (!dateString) return null

  // If already in DD/MM/YYYY format, return as is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString
  }

  // Try to parse and convert other formats
  try {
    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    }

    // MM/DD/YYYY format (convert to DD/MM/YYYY)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [month, day, year] = dateString.split("/")
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`
    }

    // DD-MM-YYYY format
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-")
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`
    }

    // Try parsing with Date object for other formats
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
  } catch (error) {
    console.warn("Could not parse date:", dateString)
  }

  // Return original if we can't parse it
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
    `,
    "International Oil Pollution Prevention Certificate": `
      For IOPP Certificate, pay special attention to:
      - Ship type (oil tanker, non-oil tanker)
      - Equipment details (15ppm equipment, slop tanks, etc.)
      - Exemptions granted
      - Endorsements and additional inspections
      - Oil filtering equipment specifications
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
    `,
  }

  return documentInstructions[documentType] || ""
}

module.exports = {
  processPDFDocument,
}
