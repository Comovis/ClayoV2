const { supabaseAdmin } = require("../../SupabaseClient")
const { processPDFDocument } = require("./EnhancedPDFAlgo")
const { extractTextFromImageBase64 } = require("./ExtractTextFromImageAlgo")
const { validateAndProcessAIClassification } = require("./DocumentCategories")
const {
  uploadToTempStorage,
  moveFromTempToPermanentStorage,
  deleteTempFile,
  generateDocumentDownloadUrl,
  deleteDocumentFile,
  cleanupOldTempFiles,
} = require("./DocumentStorageHandler")
const { v4: uuidv4 } = require("uuid")
const path = require("path")

/**
 * Convert DD/MM/YYYY date format to ISO YYYY-MM-DD format for PostgreSQL
 * @param {String} dateString - Date string in DD/MM/YYYY format
 * @returns {String|null} Date string in YYYY-MM-DD format or null
 */
function convertDDMMYYYYtoISO(dateString) {
  if (!dateString) return null

  // Handle DD/MM/YYYY format
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  return dateString // Return as-is if not DD/MM/YYYY format
}

/**
 * Extract text content from document with integrated classification
 * Enhanced with specialized PDF processing and OCR for images
 * NOW INCLUDES AI-FIRST CLASSIFICATION with proper validation
 * UPDATED: Now returns FULL text instead of truncated text
 *
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} mimeType - File MIME type
 * @param {String} documentType - Optional document type hint for better extraction
 * @returns {Object} Extracted text content, metadata, AND validated classification
 */
async function extractDocumentText(fileBuffer, mimeType, documentType = null) {
  try {
    // Use specialized PDF processing for PDF files
    if (mimeType === "application/pdf") {
      console.log("Processing PDF document with enhanced processor and classification...")
      // Process PDF using the enhanced module that returns text, metadata AND raw AI classification
      const pdfResult = await processPDFDocument(fileBuffer, documentType)

      // STAGE 2: Validate and process the raw AI classification
      const validatedClassification = validateAndProcessAIClassification(pdfResult.classification, pdfResult.metadata)

      // Return FULL text, metadata AND validated classification
      return {
        text: pdfResult.fullText, // REMOVED .substring(0, 4000) - now stores full text
        metadata: pdfResult.metadata,
        classification: validatedClassification, // Now properly validated
        keyValuePairs: pdfResult.keyValuePairs,
      }
    } else if (mimeType.startsWith("image/")) {
      // Use OCR for image files
      console.log("Processing image document with OCR and classification...")
      const base64Image = fileBuffer.toString("base64")
      const ocrResult = await extractTextFromImageBase64(base64Image, documentType)

      // STAGE 2: Validate and process the raw AI classification
      const validatedClassification = validateAndProcessAIClassification(ocrResult.classification, ocrResult.metadata)

      // Return FULL text, metadata AND validated classification
      return {
        text: ocrResult.fullText, // REMOVED .substring(0, 4000) - now stores full text
        metadata: ocrResult.metadata,
        classification: validatedClassification, // Now properly validated
        keyValuePairs: ocrResult.keyValuePairs || [],
      }
    } else {
      // Text-based documents (Word, TXT, etc)
      const rawClassification = {
        primaryCategory: "general",
        subcategory: "other",
        specificDocumentType: documentType || "Text Document",
        confidence: "Medium",
        explanation: "Text document - basic processing applied",
      }

      // STAGE 2: Validate even basic classifications
      const validatedClassification = validateAndProcessAIClassification(rawClassification, {
        documentType: documentType || "Text Document",
      })

      return {
        text: fileBuffer.toString("utf8"), // REMOVED .substring(0, 4000) - now stores full text
        metadata: null,
        classification: validatedClassification,
        keyValuePairs: [],
      }
    }
  } catch (error) {
    console.error("Error extracting document text:", error)

    // Even for errors, validate the fallback classification
    const rawClassification = {
      primaryCategory: "general",
      subcategory: "other",
      specificDocumentType: null,
      confidence: "Low",
      explanation: "Text extraction failed - manual review required",
    }

    const validatedClassification = validateAndProcessAIClassification(rawClassification, {})

    return {
      text: "Text extraction failed",
      metadata: null,
      classification: validatedClassification,
      keyValuePairs: [],
    }
  }
}

// Add this helper function to determine if document should be permanent
function shouldDocumentBePermanent(classification, documentType) {
  // Only certificates require expiry dates - everything else is permanent
  const certificateKeywords = [
    'certificate', 'cert', 'smc', 'doc', 'iopp', 'issc', 'mlc', 
    'safety management', 'document of compliance', 'classification',
    'load line', 'tonnage', 'registry', 'security', 'pollution'
  ];
  
  const docTypeText = (documentType || '').toLowerCase();
  const categoryText = (classification?.category || '').toLowerCase();
  const specificType = (classification?.originalAiClassification?.specificDocumentType || '').toLowerCase();
  
  // Check if it's a certificate based on keywords
  const isCertificate = certificateKeywords.some(keyword => 
    docTypeText.includes(keyword) || 
    specificType.includes(keyword) ||
    categoryText === 'statutory' // Most statutory docs are certificates
  );
  
  console.log(`Document type: ${documentType}, Category: ${categoryText}, Is Certificate: ${isCertificate}`);
  
  return !isCertificate; // If NOT a certificate, make it permanent
}

/**
 * Upload a document file to storage and create document record
 * Enhanced to handle AI extraction and update document with extracted data
 * UPDATED: Now uses proper two-stage AI-first classification with validation
 * UPDATED: Now stores full extracted text in full_text column
 *
 * @param {Object} fileData - The file data object
 * @param {Buffer} fileData.buffer - The file buffer
 * @param {String} fileData.originalname - Original filename
 * @param {String} fileData.mimetype - File MIME type
 * @param {Number} fileData.size - File size in bytes
 * @param {Object} documentData - Document metadata
 * @param {String} documentData.vesselId - ID of the vessel
 * @param {String} documentData.title - Document title
 * @param {String} documentData.documentType - Type of document
 * @param {String} documentData.category - Document category
 * @param {String} documentData.issuer - Document issuer
 * @param {String} documentData.certificateNumber - Certificate number
 * @param {Date} documentData.issueDate - Date of issue
 * @param {Date} documentData.expiryDate - Expiry date
 * @param {Boolean} documentData.isPermanent - Whether document never expires
 * @param {String} documentData.userId - ID of the user uploading the document
 * @param {String} documentData.userAgent - User agent string
 * @param {String} documentData.ipAddress - IP address of the user
 * @returns {Object} The created document record with success status
 */
async function uploadDocument(fileData, documentData) {
  try {
    // Add debugging logs
    console.log("=== UPLOAD DOCUMENT DEBUG ===")
    console.log("supabaseAdmin exists:", !!supabaseAdmin)
    console.log("supabaseAdmin.from exists:", typeof supabaseAdmin?.from === "function")
    console.log("documentData:", JSON.stringify(documentData, null, 2))

    // Validate inputs (with lenient validation for initial upload)
    const validationResult = validateDocumentData(documentData, true)
    if (!validationResult.success) {
      return validationResult
    }

    const fileValidationResult = validateFileData(fileData)
    if (!fileValidationResult.success) {
      return fileValidationResult
    }

    // Validate vessel exists
    const vesselExists = await validateVesselExists(documentData.vesselId)
    if (!vesselExists.success) {
      return vesselExists
    }

    // Step 1: Upload to temp storage first
    const tempUploadResult = await uploadToTempStorage(
      fileData.buffer,
      fileData.originalname,
      fileData.mimetype,
      documentData.userId,
    )

    if (!tempUploadResult.success) {
      return tempUploadResult
    }

    console.log(`File uploaded to temp storage: ${tempUploadResult.tempPath}`)

    // Step 2: Extract text, metadata AND classification from the document (with proper validation)
    let extractionResult = null
    let documentMetadata = null
    let validatedClassification = null
    let documentText = "Text extraction failed"

    try {
      console.log("Starting integrated document text, metadata and AI-first classification extraction...")

      // This now returns properly validated classification AND full text
      extractionResult = await extractDocumentText(fileData.buffer, fileData.mimetype, documentData.documentType)

      documentText = extractionResult.text // Now contains FULL text, not truncated
      documentMetadata = extractionResult.metadata
      validatedClassification = extractionResult.classification // Already validated in extractDocumentText

      console.log("Document metadata extracted:", documentMetadata)
      console.log("Validated classification result:", validatedClassification)
      console.log("Full text length:", documentText.length, "characters") // Log full text length
    } catch (extractionError) {
      console.error("Document extraction failed:", extractionError)
      // Continue with upload even if extraction fails - use fallback classification
      validatedClassification = validateAndProcessAIClassification(
        {
          primaryCategory: "general",
          subcategory: "other",
          specificDocumentType: null,
          confidence: "Low",
          explanation: "Extraction failed - manual review required",
        },
        {},
      )
    }

    // Determine document category using validated classification
    const documentCategory = validatedClassification?.category || documentData.category || "statutory"
    const documentSubcategory = validatedClassification?.subcategory || null

    // Step 3: Move from temp to permanent storage
    const storageResult = await moveFromTempToPermanentStorage(
      tempUploadResult.tempPath,
      documentData.vesselId,
      documentData.documentType,
      documentCategory,
      documentData.userId,
    )

    if (!storageResult.success) {
      // If moving fails, clean up the temp file
      await deleteTempFile(tempUploadResult.tempPath)
      return storageResult
    }

    // Step 4: Prepare document record with AI-extracted data taking precedence
    // UPDATED: Now includes full_text field
    const documentRecord = {
      id: uuidv4(),
      vessel_id: documentData.vesselId,
      title: documentMetadata?.documentTitle || documentData.title,
      document_type:
        validatedClassification?.originalAiClassification?.specificDocumentType ||
        documentMetadata?.documentType ||
        documentData.documentType,
      document_category: documentCategory,
      document_subcategory: documentSubcategory,
      classification_confidence: validatedClassification?.confidence || null,
      classification_explanation: validatedClassification?.explanation || null,
      issuer: documentMetadata?.issuer || documentData.issuer,
      certificate_number: documentMetadata?.documentNumber || documentData.certificateNumber,
      issue_date: convertDDMMYYYYtoISO(documentMetadata?.issueDate) || convertDDMMYYYYtoISO(documentData.issueDate),
      expiry_date: null, // Will be set below based on extracted data
      is_permanent: false, // Will be determined based on extracted data
      status: "valid",
      file_path: storageResult.filePath,
      file_type: fileData.mimetype,
      file_size: fileData.size,
      full_text: documentText, // NEW: Store the complete extracted text
      created_by: documentData.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
    }

    // Handle expiry date logic with AI-extracted data
    // NEW: Auto-determine if document should be permanent based on type
    const shouldBePermanent = shouldDocumentBePermanent(validatedClassification, documentData.documentType);

    if (shouldBePermanent) {
      // Non-certificate documents are automatically permanent
      documentRecord.expiry_date = null;
      documentRecord.is_permanent = true;
      console.log("Document automatically marked as permanent (non-certificate)");
    } else if (documentMetadata?.expiryDate) {
      // Certificate with AI-extracted expiry date
      documentRecord.expiry_date = convertDDMMYYYYtoISO(documentMetadata.expiryDate);
      documentRecord.is_permanent = false;
    } else if (documentData.isPermanent) {
      // User specified permanent
      documentRecord.expiry_date = null;
      documentRecord.is_permanent = true;
    } else if (documentData.expiryDate) {
      // User provided expiry date
      documentRecord.expiry_date = convertDDMMYYYYtoISO(documentData.expiryDate);
      documentRecord.is_permanent = false;
    } else {
      // Default for certificates without expiry info - require manual input
      documentRecord.expiry_date = null;
      documentRecord.is_permanent = true; // Default to permanent to avoid validation errors
    }

    console.log("Final document record before insert:", {
      title: documentRecord.title,
      document_type: documentRecord.document_type,
      document_category: documentRecord.document_category,
      document_subcategory: documentRecord.document_subcategory,
      classification_confidence: documentRecord.classification_confidence,
      issuer: documentRecord.issuer,
      issue_date: documentRecord.issue_date,
      expiry_date: documentRecord.expiry_date,
      is_permanent: documentRecord.is_permanent,
      full_text_length: documentRecord.full_text?.length || 0, // Log full text length
    })

    // Insert document record into database
    const { data: document, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert(documentRecord)
      .select()
      .single()

    if (dbError) {
      // If database insert fails, try to clean up the uploaded file
      await deleteDocumentFile(storageResult.filePath)
      console.error("Database insert error:", dbError)
      return {
        success: false,
        error: `Failed to create document record: ${dbError.message}`,
      }
    }

    // Create document access log
    await createAccessLog({
      documentId: document.id,
      userId: documentData.userId,
      action: "upload",
      userAgent: documentData.userAgent,
      ipAddress: documentData.ipAddress,
    })

    // Check document expiry (async)
    checkDocumentExpiry(document.id).catch((err) => console.error("Error checking document expiry:", err))

    // Return the created document with additional info
    return {
      success: true,
      data: {
        ...document,
        publicUrl: storageResult.publicUrl,
        classification: validatedClassification,
        extractedMetadata: documentMetadata,
        keyValuePairs: extractionResult?.keyValuePairs || [],
      },
    }
  } catch (error) {
    console.error("Document upload error:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred during document upload",
    }
  }
}

/**
 * Validate document data
 * @param {Object} documentData - Document metadata
 * @param {Boolean} isInitialUpload - Whether this is the initial upload (before AI processing)
 * @returns {Object} Validation result
 */
function validateDocumentData(documentData, isInitialUpload = false) {
  const requiredFields = ["vesselId", "title", "documentType", "userId"]

  for (const field of requiredFields) {
    if (!documentData[field]) {
      return {
        success: false,
        error: `Missing required field: ${field}`,
      }
    }
  }

  // During initial upload, we're more lenient with expiry date validation
  // since AI will extract this information
  if (!isInitialUpload) {
    // If not permanent, expiry date is required (only for final updates)
    if (!documentData.isPermanent && !documentData.expiryDate) {
      return {
        success: false,
        error: "Expiry date is required for non-permanent documents",
      }
    }
  }

  return { success: true }
}

/**
 * Validate file data
 * @param {Object} fileData - File data
 * @returns {Object} Validation result
 */
function validateFileData(fileData) {
  if (!fileData || !fileData.buffer || !fileData.originalname) {
    return {
      success: false,
      error: "Invalid file data",
    }
  }

  // Check file size (e.g., 50MB limit)
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
  if (fileData.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  // Validate file type (allow only PDF, images, and common document formats)
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]

  if (!allowedMimeTypes.includes(fileData.mimetype)) {
    return {
      success: false,
      error: "File type not allowed. Please upload PDF, images, or office documents.",
    }
  }

  return { success: true }
}

/**
 * Validate that a vessel exists
 * @param {String} vesselId - Vessel ID
 * @returns {Object} Validation result
 */
async function validateVesselExists(vesselId) {
  try {
    const { data, error } = await supabaseAdmin.from("vessels").select("id").eq("id", vesselId).single()

    if (error || !data) {
      return {
        success: false,
        error: `Vessel with ID ${vesselId} not found`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error validating vessel:", error)
    return {
      success: false,
      error: "Failed to validate vessel",
    }
  }
}

/**
 * Clean up a file from storage in case of error
 * @param {String} filePath - Path to the file in storage
 */
async function cleanupStorageFile(filePath) {
  try {
    // Use the deleteDocumentFile function from DocumentStorageHandler
    const result = await deleteDocumentFile(filePath)

    if (!result.success) {
      console.error("Failed to clean up file:", result.error)
    }
  } catch (error) {
    console.error("Error during file cleanup:", error)
  }
}

/**
 * Create a document access log
 * @param {Object} logData - Log data
 * @returns {Object} Result of the operation
 */
async function createAccessLog(logData) {
  try {
    const logRecord = {
      id: uuidv4(),
      document_id: logData.documentId,
      user_id: logData.userId,
      action: logData.action,
      timestamp: new Date().toISOString(),
      ip_address: logData.ipAddress,
      user_agent: logData.userAgent,
    }

    const { error } = await supabaseAdmin.from("document_access_logs").insert(logRecord)

    if (error) {
      console.error("Failed to create access log:", error)
      return {
        success: false,
        error: "Failed to create access log",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating access log:", error)
    return {
      success: false,
      error: "Error creating access log",
    }
  }
}

/**
 * Check document expiry and update status
 * @param {String} documentId - Document ID
 * @returns {Object} Check result
 */
async function checkDocumentExpiry(documentId) {
  try {
    // Get document
    const { data: document, error } = await supabaseAdmin.from("documents").select("*").eq("id", documentId).single()

    if (error || !document) {
      return {
        success: false,
        error: `Document with ID ${documentId} not found`,
      }
    }

    // Skip permanent documents
    if (document.is_permanent) {
      return {
        success: true,
        status: "permanent",
        documentId,
      }
    }

    // Calculate days until expiry
    const today = new Date()
    const expiryDate = new Date(document.expiry_date)
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

    let newStatus = document.status

    // Update status based on days until expiry
    if (daysUntilExpiry <= 0) {
      newStatus = "expired"
    } else if (daysUntilExpiry <= 30) {
      newStatus = "expiring_soon"
    } else {
      newStatus = "valid"
    }

    // Only update if status has changed
    if (newStatus !== document.status) {
      const { error: updateError } = await supabaseAdmin
        .from("documents")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", documentId)

      if (updateError) {
        return {
          success: false,
          error: `Failed to update document status: ${updateError.message}`,
        }
      }
    }

    return {
      success: true,
      status: newStatus,
      documentId,
      daysUntilExpiry,
    }
  } catch (error) {
    console.error("Error checking document expiry:", error)
    return {
      success: false,
      error: "Failed to check document expiry",
    }
  }
}

/**
 * Get document by ID with access logging
 * @param {String} documentId - Document ID
 * @param {Object} accessInfo - Access information
 * @returns {Object} Document data with success status
 */
async function getDocumentWithAccessLogging(documentId, accessInfo) {
  try {
    // Get document
    const { data: document, error } = await supabaseAdmin.from("documents").select("*").eq("id", documentId).single()

    if (error || !document) {
      return {
        success: false,
        error: `Document with ID ${documentId} not found`,
      }
    }

    // Create access log
    await createAccessLog({
      documentId,
      userId: accessInfo.userId,
      action: "view",
      userAgent: accessInfo.userAgent,
      ipAddress: accessInfo.ipAddress,
      shareId: accessInfo.shareId,
      userEmail: accessInfo.userEmail,
    })

    // Generate a signed URL for secure download
    let downloadUrl

    // If this is a shared document with download prevention enabled
    if (accessInfo.shareId && accessInfo.preventDownload) {
      // Get a short-lived URL for viewing only (30 seconds)
      const { success, signedUrl } = await generateDocumentDownloadUrl(document.file_path, 30)
      downloadUrl = success ? signedUrl : null
    } else {
      // Get a standard URL with longer expiry (10 minutes)
      const { success, signedUrl } = await generateDocumentDownloadUrl(document.file_path, 600)
      downloadUrl = success ? signedUrl : null
    }

    return {
      success: true,
      data: {
        ...document,
        downloadUrl,
      },
    }
  } catch (error) {
    console.error("Error getting document with access logging:", error)
    return {
      success: false,
      error: "Failed to retrieve document",
    }
  }
}

/**
 * Get all documents for a vessel
 * @param {String} vesselId - Vessel ID
 * @returns {Object} List of documents with success status
 */
async function getVesselDocuments(vesselId) {
  try {
    const { data: documents, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("vessel_id", vesselId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Add signed URLs to documents (valid for 10 minutes)
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        if (doc.file_path) {
          const { success, signedUrl } = await generateDocumentDownloadUrl(doc.file_path, 600)
          return {
            ...doc,
            downloadUrl: success ? signedUrl : null,
          }
        }
        return doc
      }),
    )

    return {
      success: true,
      data: documentsWithUrls,
    }
  } catch (error) {
    console.error("Error getting vessel documents:", error)
    return {
      success: false,
      error: "Failed to retrieve vessel documents",
    }
  }
}

/**
 * Update a document
 * @param {String} documentId - Document ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user making the update
 * @returns {Object} Updated document with success status
 */
async function updateDocument(documentId, updateData, userId) {
  try {
    // Check if document exists
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single()

    if (fetchError || !existingDoc) {
      return {
        success: false,
        error: "Document not found",
      }
    }

    // Prepare update data
    const documentUpdate = {
      title: updateData.title || existingDoc.title,
      document_type: updateData.documentType || existingDoc.document_type,
      document_category: updateData.category || existingDoc.document_category || "statutory",
      issuer: updateData.issuer || existingDoc.issuer,
      certificate_number: updateData.certificateNumber || existingDoc.certificate_number,
      issue_date: updateData.issueDate || existingDoc.issue_date,
      expiry_date: updateData.isPermanent ? null : updateData.expiryDate || existingDoc.expiry_date,
      is_permanent: updateData.isPermanent || existingDoc.is_permanent,
      updated_at: new Date().toISOString(),
      last_updated_by: userId,
    }

    // Update document
    const { data: updatedDoc, error: updateError } = await supabaseAdmin
      .from("documents")
      .update(documentUpdate)
      .eq("id", documentId)
      .select()
      .single()

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    // Create access log
    await createAccessLog({
      documentId,
      userId,
      action: "update",
      userAgent: updateData.userAgent,
      ipAddress: updateData.ipAddress,
    })

    // Check document expiry (async)
    checkDocumentExpiry(documentId).catch((err) => console.error("Error checking document expiry:", err))

    return {
      success: true,
      data: updatedDoc,
    }
  } catch (error) {
    console.error("Error updating document:", error)
    return {
      success: false,
      error: "Failed to update document",
    }
  }
}

/**
 * Archive a document (soft delete)
 * @param {String} documentId - Document ID
 * @param {String} userId - ID of the user archiving the document
 * @param {String} userAgent - User agent string
 * @param {String} ipAddress - IP address of the user
 * @returns {Object} Result with success status
 */
async function archiveDocument(documentId, userId, userAgent, ipAddress) {
  try {
    // Check if document exists
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single()

    if (fetchError || !existingDoc) {
      return {
        success: false,
        error: "Document not found",
      }
    }

    // Archive the document
    const { error: updateError } = await supabaseAdmin
      .from("documents")
      .update({
        is_archived: true,
        updated_at: new Date().toISOString(),
        last_updated_by: userId,
      })
      .eq("id", documentId)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    // Create access log
    await createAccessLog({
      documentId,
      userId,
      action: "archive",
      userAgent,
      ipAddress,
    })

    return {
      success: true,
      message: "Document archived successfully",
    }
  } catch (error) {
    console.error("Error archiving document:", error)
    return {
      success: false,
      error: "Failed to archive document",
    }
  }
}

/**
 * Handle document upload request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleDocumentUpload(req, res) {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Extract document data from request body
    const documentData = {
      vesselId: req.body.vesselId,
      title: req.body.title,
      documentType: req.body.documentType,
      category: req.body.category || "statutory", // Default to statutory if not provided
      issuer: req.body.issuer || null,
      certificateNumber: req.body.certificateNumber || null,
      issueDate: req.body.issueDate || null,
      expiryDate: req.body.expiryDate || null,
      isPermanent: req.body.isPermanent === "true",
      userId: req.user.user_id, // From auth middleware
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    }

    // Upload document
    const result = await uploadDocument(req.file, documentData)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    // Check document expiry (async)
    checkDocumentExpiry(result.data.id).catch((err) => console.error("Error checking document expiry:", err))

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: result.data,
    })
  } catch (error) {
    console.error("Document upload handler error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload document",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

/**
 * Handle get document request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGetDocument(req, res) {
  try {
    const documentId = req.params.id

    // Access information for logging
    const accessInfo = {
      userId: req.user.user_id,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    }

    // Get document with access logging
    const result = await getDocumentWithAccessLogging(documentId, accessInfo)

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      document: result.data,
    })
  } catch (error) {
    console.error("Get document handler error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve document",
    })
  }
}

/**
 * Handle get vessel documents request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGetVesselDocuments(req, res) {
  try {
    const vesselId = req.params.vesselId

    const result = await getVesselDocuments(vesselId)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      documents: result.data,
    })
  } catch (error) {
    console.error("Get vessel documents handler error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve vessel documents",
    })
  }
}

/**
 * Handle update document request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleUpdateDocument(req, res) {
  try {
    const documentId = req.params.id
    const userId = req.user.user_id

    // Check if user has permission to update
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("created_by")
      .eq("id", documentId)
      .single()

    if (fetchError || !existingDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      })
    }

    // Check if user has permission to update
    if (existingDoc.created_by !== userId && !req.user.is_company_admin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this document",
      })
    }

    // Update data with request info
    const updateData = {
      ...req.body,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    }

    const result = await updateDocument(documentId, updateData, userId)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document: result.data,
    })
  } catch (error) {
    console.error("Update document handler error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to update document",
    })
  }
}

/**
 * Handle archive document request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleArchiveDocument(req, res) {
  try {
    const documentId = req.params.id
    const userId = req.user.user_id

    // Check if user is company admin
    if (!req.user.is_company_admin) {
      return res.status(403).json({
        success: false,
        message: "Only company administrators can archive documents",
      })
    }

    const result = await archiveDocument(documentId, userId, req.headers["user-agent"], req.ip)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Document archived successfully",
    })
  } catch (error) {
    console.error("Archive document handler error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to archive document",
    })
  }
}

/**
 * Handle document download request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleDocumentDownload(req, res) {
  try {
    const documentId = req.params.id
    const userId = req.user.user_id

    // Get the document to check permissions and get file path
    const { data: document, error } = await supabaseAdmin.from("documents").select("*").eq("id", documentId).single()

    if (error || !document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      })
    }

    // Check if user has access to this document
    const { data: vessel } = await supabaseAdmin
      .from("vessels")
      .select("company_id")
      .eq("id", document.vessel_id)
      .single()

    // Get user's company
    const { data: user } = await supabaseAdmin.from("users").select("company_id").eq("id", userId).single()

    if (!vessel || !user || vessel.company_id !== user.company_id) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to download this document",
      })
    }

    // Generate a signed URL for download (10 minutes)
    const { success, signedUrl, error: urlError } = await generateDocumentDownloadUrl(document.file_path, 600)

    if (!success) {
      return res.status(500).json({
        success: false,
        error: urlError || "Failed to generate download URL",
      })
    }

    // Log the download access
    await createAccessLog({
      documentId,
      userId,
      action: "download",
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    })

    return res.status(200).json({
      success: true,
      downloadUrl: signedUrl,
      fileName: document.title,
      expiresIn: 600,
    })
  } catch (error) {
    console.error("Error generating document download URL:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to generate document download URL",
    })
  }
}

/**
 * Handle cleanup of old temp files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleCleanupTempFiles(req, res) {
  try {
    // Only allow service role or admin users to run cleanup
    if (req.user.role !== "service_role" && !req.user.is_company_admin) {
      return res.status(403).json({
        success: false,
        error: "Only administrators can run cleanup operations",
      })
    }

    const hours = req.query.hours ? Number.parseInt(req.query.hours) : 24

    const result = await cleanupOldTempFiles(hours)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error cleaning up temp files:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to clean up temp files",
    })
  }
}

module.exports = {
  uploadDocument,
  extractDocumentText,
  getDocumentWithAccessLogging,
  getVesselDocuments,
  updateDocument,
  archiveDocument,
  checkDocumentExpiry,
  handleDocumentUpload,
  handleGetDocument,
  handleGetVesselDocuments,
  handleUpdateDocument,
  handleArchiveDocument,
  handleDocumentDownload,
  handleCleanupTempFiles,
}