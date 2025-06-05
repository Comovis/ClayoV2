//Extracts raw text from different file types (PDF, Word, images, URLs)


const pdf = require("pdf-parse")
const mammoth = require("mammoth")
const axios = require("axios")
const cheerio = require("cheerio")

/**
 * Processes a document and extracts text
 * @param {Object} file - The file object with buffer and metadata
 * @returns {Promise<Object>} - Extracted text and metadata
 */
async function processDocument(file) {
  try {
    let extractedText = ""

    switch (file.mimetype) {
      case "application/pdf":
        extractedText = await extractPdfText(file.buffer)
        break
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        extractedText = await extractWordText(file.buffer)
        break
      case "text/plain":
        extractedText = file.buffer.toString("utf8")
        break
      case "image/jpeg":
      case "image/png":
        // For images, you could add OCR here if needed
        extractedText = "Image content - OCR not implemented yet"
        break
      default:
        throw new Error(`Unsupported file type: ${file.mimetype}`)
    }

    return {
      text: extractedText,
      metadata: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        extractedLength: extractedText.length,
      },
    }
  } catch (error) {
    console.error("Document processing error:", error)
    throw error
  }
}

/**
 * Processes a URL and extracts text content
 * @param {string} url - The URL to process
 * @returns {Promise<Object>} - Extracted text and metadata
 */
async function processUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DocumentProcessor/1.0)",
      },
    })

    const $ = cheerio.load(response.data)

    // Remove script and style elements
    $("script, style").remove()

    // Extract text content
    const extractedText = $("body").text().replace(/\s+/g, " ").trim()

    return {
      text: extractedText,
      metadata: {
        url,
        title: $("title").text() || "No title",
        contentLength: extractedText.length,
      },
    }
  } catch (error) {
    console.error("URL processing error:", error)
    throw error
  }
}

/**
 * Extracts text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractPdfText(buffer) {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error("PDF extraction error:", error)
    throw new Error("Failed to extract text from PDF")
  }
}

/**
 * Extracts text from a Word document buffer
 * @param {Buffer} buffer - Word document buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractWordText(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error("Word extraction error:", error)
    throw new Error("Failed to extract text from Word document")
  }
}

module.exports = {
  processDocument,
  processUrl,
  extractPdfText,
  extractWordText,
}
