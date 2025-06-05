const { supabaseAdmin } = require("../../SupabaseClient")
const { processDocument, processUrl } = require("./DocumentProcessor")
const { uploadFileToTemporaryStorage, deleteTemporaryFile, getFileFromStorage } = require("./StorageService")
const { v4: uuidv4 } = require("uuid")

/**
 * Uploads a document, stores it temporarily, and creates a knowledge base entry
 * @param {Object} params - Upload parameters
 * @returns {Promise<Object>} - Upload result
 */
async function uploadDocument({ file, organizationId, agentId, category, title, userId }) {
  try {
    // Step 1: Upload file to temporary storage
    const uploadResult = await uploadFileToTemporaryStorage(file.buffer, file.originalname, organizationId)

    if (!uploadResult.success) {
      throw new Error(`Failed to upload file: ${uploadResult.error}`)
    }

    console.log(`File uploaded to temporary storage: ${uploadResult.filePath}`)

    // Step 2: Create initial knowledge base entry with pending status
    const knowledgeItem = {
      id: uuidv4(),
      organization_id: organizationId,
      agent_id: agentId,
      title: title || file.originalname,
      content: "", // Will be populated after processing
      category: category || "General",
      source_type: "document",
      file_type: file.mimetype,
      file_size: file.size,
      file_path: uploadResult.filePath, // Store the path to the temporary file
      processing_status: "pending",
      metadata: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        temporaryPath: uploadResult.filePath,
      },
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: createdItem, error: insertError } = await supabaseAdmin
      .from("knowledge_base")
      .insert(knowledgeItem)
      .select()
      .single()

    if (insertError) throw insertError

    // Step 3: Process the document asynchronously
    // This could be moved to a background job/queue system for production
    processDocumentAsync(uploadResult.filePath, createdItem.id, organizationId).catch((error) =>
      console.error(`Async processing error for ${createdItem.id}:`, error),
    )

    return {
      success: true,
      data: createdItem,
      message: "Document uploaded and queued for processing",
    }
  } catch (error) {
    console.error("Upload document error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Process a document asynchronously
 * @param {string} filePath - Path to the file in storage
 * @param {string} knowledgeId - Knowledge base item ID
 * @param {string} organizationId - Organization ID
 */
async function processDocumentAsync(filePath, knowledgeId, organizationId) {
  try {
    // Update status to processing
    await updateKnowledgeStatus(knowledgeId, "processing")

    // Get the file from storage
    const fileResult = await getFileFromStorage(filePath)
    if (!fileResult.success) {
      throw new Error(`Failed to retrieve file: ${fileResult.error}`)
    }

    // Get the knowledge item to access metadata
    const { data: knowledgeItem, error: getError } = await supabaseAdmin
      .from("knowledge_base")
      .select("*")
      .eq("id", knowledgeId)
      .single()

    if (getError) throw getError

    // Create a file-like object for the document processor
    const fileObject = {
      buffer: fileResult.data,
      originalname: knowledgeItem.metadata.fileName,
      mimetype: knowledgeItem.metadata.mimeType,
      size: knowledgeItem.metadata.fileSize,
    }

    // Process the document
    const extractedData = await processDocument(fileObject)

    // Update the knowledge base item with extracted text
    await supabaseAdmin
      .from("knowledge_base")
      .update({
        content: extractedData.text,
        extracted_text: extractedData.text,
        processing_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", knowledgeId)

    console.log(`Document processed successfully: ${knowledgeId}`)

    // Delete the temporary file
    await deleteTemporaryFile(filePath)
    console.log(`Temporary file deleted: ${filePath}`)
  } catch (error) {
    console.error(`Document processing error for ${knowledgeId}:`, error)

    // Update status to failed
    await updateKnowledgeStatus(knowledgeId, "failed", error.message)

    // Still try to delete the temporary file
    try {
      await deleteTemporaryFile(filePath)
    } catch (deleteError) {
      console.error(`Failed to delete temporary file ${filePath}:`, deleteError)
    }
  }
}

/**
 * Updates the processing status of a knowledge base item
 * @param {string} id - Knowledge base item ID
 * @param {string} status - Processing status
 * @param {string} errorMessage - Optional error message
 */
async function updateKnowledgeStatus(id, status, errorMessage = null) {
  try {
    const updateData = {
      processing_status: status,
      updated_at: new Date().toISOString(),
    }

    if (errorMessage) {
      updateData.metadata = { error: errorMessage }
    }

    await supabaseAdmin.from("knowledge_base").update(updateData).eq("id", id)
  } catch (error) {
    console.error(`Failed to update status for ${id}:`, error)
  }
}

/**
 * Gets the processing status of a knowledge base item
 * @param {string} id - Knowledge base item ID
 * @returns {Promise<Object>} - Status result
 */
async function getProcessingStatus(id) {
  try {
    const { data, error } = await supabaseAdmin
      .from("knowledge_base")
      .select("id, processing_status, metadata")
      .eq("id", id)
      .single()

    if (error) throw error

    return {
      success: true,
      status: data.processing_status,
      metadata: data.metadata,
    }
  } catch (error) {
    console.error("Get processing status error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Adds a URL to the knowledge base
 * @param {Object} params - URL parameters
 * @returns {Promise<Object>} - Result
 */
async function addUrl({ url, organizationId, agentId, category, userId }) {
  try {
    const extractedData = await processUrl(url)

    const knowledgeItem = {
      id: uuidv4(),
      organization_id: organizationId,
      agent_id: agentId,
      title: new URL(url).hostname,
      content: extractedData.text,
      category: category || "Web Content",
      source_type: "url",
      source_url: url,
      processing_status: "completed",
      extracted_text: extractedData.text,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("knowledge_base").insert(knowledgeItem).select().single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Add URL error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Adds text content to the knowledge base
 * @param {Object} params - Text parameters
 * @returns {Promise<Object>} - Result
 */
async function addText({ title, content, organizationId, agentId, category, userId }) {
  try {
    const knowledgeItem = {
      id: uuidv4(),
      organization_id: organizationId,
      agent_id: agentId,
      title,
      content,
      category: category || "Custom",
      source_type: "text",
      processing_status: "completed",
      extracted_text: content,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("knowledge_base").insert(knowledgeItem).select().single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Add text error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Gets knowledge items for an organization
 * @param {string} organizationId - Organization ID
 * @param {string|null} agentId - Optional agent ID
 * @returns {Promise<Object>} - Knowledge items
 */
async function getKnowledgeItems(organizationId, agentId = null) {
  try {
    let query = supabaseAdmin
      .from("knowledge_base")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (agentId) {
      query = query.eq("agent_id", agentId)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, items: data }
  } catch (error) {
    console.error("Get knowledge items error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Deletes a knowledge item
 * @param {string} id - Knowledge item ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Result
 */
async function deleteKnowledgeItem(id, organizationId) {
  try {
    // First, get the item to check if it has a file path
    const { data: item, error: getError } = await supabaseAdmin
      .from("knowledge_base")
      .select("file_path, metadata")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single()

    if (getError) throw getError

    // If there's a file path, delete the file
    if (item.file_path) {
      await deleteTemporaryFile(item.file_path)
    } else if (item.metadata?.temporaryPath) {
      await deleteTemporaryFile(item.metadata.temporaryPath)
    }

    // Delete the knowledge item
    const { error } = await supabaseAdmin
      .from("knowledge_base")
      .delete()
      .eq("id", id)
      .eq("organization_id", organizationId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Delete knowledge item error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * THE SECRET SAUCE - Get ALL knowledge as one big context string
 * This is your proven approach: no vectors, no chunking, just everything!
 * @param {string} organizationId - Organization ID
 * @param {string|null} agentId - Optional agent ID
 * @returns {Promise<Object>} - Combined knowledge content
 */
async function getAllKnowledgeForOrganization(organizationId, agentId = null) {
  try {
    let query = supabaseAdmin
      .from("knowledge_base")
      .select("content, title, category")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .eq("processing_status", "completed")

    if (agentId) {
      query = query.eq("agent_id", agentId)
    }

    const { data, error } = await query

    if (error) throw error

    // Combine ALL content into one massive context string
    const combinedContent = data
      .map((item) => `Title: ${item.title}\nCategory: ${item.category}\nContent: ${item.content}\n\n---\n\n`)
      .join("")

    console.log(`Combined ${data.length} knowledge items into ${combinedContent.length} characters of context`)

    return {
      success: true,
      combinedContent,
      itemCount: data.length,
      totalCharacters: combinedContent.length,
    }
  } catch (error) {
    console.error("Get all knowledge error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  uploadDocument,
  addUrl,
  addText,
  getKnowledgeItems,
  deleteKnowledgeItem,
  getAllKnowledgeForOrganization,
  getProcessingStatus,
}
