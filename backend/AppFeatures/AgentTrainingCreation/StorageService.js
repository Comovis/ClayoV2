const { supabaseAdmin } = require("../../SupabaseClient")
const { v4: uuidv4 } = require("uuid")
const path = require("path")

/**
 * Uploads a file to temporary storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Upload result with file path
 */
async function uploadFileToTemporaryStorage(fileBuffer, fileName, organizationId) {
  try {
    console.log("📤 Starting file upload to storage:", {
      fileName,
      organizationId,
      bufferSize: fileBuffer.length,
      isBuffer: Buffer.isBuffer(fileBuffer),
    })

    // Generate a unique file name to avoid collisions
    const fileExtension = path.extname(fileName)
    const uniqueFileName = `${uuidv4()}${fileExtension}`

    // Create path: temp/{organizationId}/{uniqueFileName}
    const filePath = `temp/${organizationId}/${uniqueFileName}`

    console.log("📁 Upload details:", {
      filePath,
      uniqueFileName,
      fileExtension,
      contentType: getMimeType(fileExtension),
    })

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("documents").upload(filePath, fileBuffer, {
      contentType: getMimeType(fileExtension),
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("❌ Supabase upload error:", error)
      throw error
    }

    console.log("✅ File uploaded to Supabase storage:", data)

    // Get public URL (if needed)
    const { data: urlData } = await supabaseAdmin.storage.from("documents").getPublicUrl(filePath)

    console.log("✅ File upload completed successfully:", {
      filePath,
      publicUrl: urlData.publicUrl,
      fileSize: fileBuffer.length,
    })

    return {
      success: true,
      filePath,
      publicUrl: urlData.publicUrl,
      originalName: fileName,
      fileSize: fileBuffer.length,
    }
  } catch (error) {
    console.error("❌ File upload error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * FIXED: Gets a file from storage and converts Blob to Buffer
 * This is the critical fix for the PDF extraction error
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - File data as proper Buffer
 */
async function getFileFromStorage(filePath) {
  try {
    console.log("📥 Starting file download from storage:", filePath)

    const { data, error } = await supabaseAdmin.storage.from("documents").download(filePath)

    if (error) {
      console.error("❌ Supabase download error:", error)
      throw error
    }

    console.log("📊 Downloaded data analysis:", {
      type: typeof data,
      constructor: data.constructor.name,
      isBlob: data instanceof Blob,
      isBuffer: Buffer.isBuffer(data),
      size: data.size || data.length || "unknown",
    })

    // CRITICAL FIX: Convert Blob to Buffer
    let buffer

    if (data instanceof Blob) {
      console.log("🔄 Converting Blob to Buffer using arrayBuffer method...")
      
      try {
        // Method 1: Using arrayBuffer() - most reliable
        const arrayBuffer = await data.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
        
        console.log("✅ Blob converted to Buffer successfully:", {
          originalSize: data.size,
          bufferSize: buffer.length,
          isBuffer: Buffer.isBuffer(buffer),
          firstBytes: buffer.slice(0, 10).toString("hex"),
        })
      } catch (arrayBufferError) {
        console.warn("⚠️ arrayBuffer method failed, trying stream method:", arrayBufferError.message)
        
        // Method 2: Using stream as fallback
        try {
          const reader = data.stream().getReader()
          const chunks = []

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }

          buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))
          console.log("✅ Stream conversion successful:", {
            bufferSize: buffer.length,
            isBuffer: Buffer.isBuffer(buffer),
          })
        } catch (streamError) {
          console.error("❌ Stream conversion also failed:", streamError.message)
          throw new Error(`Failed to convert Blob to Buffer: arrayBuffer failed (${arrayBufferError.message}), stream failed (${streamError.message})`)
        }
      }
    } else if (Buffer.isBuffer(data)) {
      console.log("✅ Data is already a Buffer")
      buffer = data
    } else if (data instanceof ArrayBuffer) {
      console.log("🔄 Converting ArrayBuffer to Buffer...")
      buffer = Buffer.from(data)
    } else if (data instanceof Uint8Array) {
      console.log("🔄 Converting Uint8Array to Buffer...")
      buffer = Buffer.from(data)
    } else {
      console.log("🔄 Converting unknown type to Buffer...")
      try {
        buffer = Buffer.from(data)
      } catch (conversionError) {
        console.error("❌ Failed to convert data to Buffer:", conversionError)
        throw new Error(`Cannot convert data type ${typeof data} (${data.constructor.name}) to Buffer`)
      }
    }

    // Final validation
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("Failed to create valid Buffer from downloaded data")
    }

    if (buffer.length === 0) {
      throw new Error("Downloaded file is empty (0 bytes)")
    }

    // Additional validation for PDF files
    if (filePath.toLowerCase().endsWith('.pdf')) {
      const pdfHeader = buffer.slice(0, 4).toString()
      if (pdfHeader !== '%PDF') {
        console.warn("⚠️ File doesn't start with PDF header:", pdfHeader)
        console.log("First 20 bytes:", buffer.slice(0, 20).toString())
        // Don't throw error as some PDFs might have different headers
      } else {
        console.log("✅ PDF header validation passed")
      }
    }

    console.log("✅ File download and conversion completed successfully:", {
      filePath,
      bufferSize: buffer.length,
      isBuffer: Buffer.isBuffer(buffer),
      isPDF: filePath.toLowerCase().endsWith('.pdf'),
    })

    return {
      success: true,
      data: buffer, // Now returns proper Buffer!
    }
  } catch (error) {
    console.error("❌ File download error:", error)
    console.error("Error context:", {
      filePath,
      errorMessage: error.message,
      errorStack: error.stack,
    })
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Alternative method using different approach (backup method)
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - File data as Buffer
 */
async function getFileFromStorageAlternative(filePath) {
  try {
    console.log("📥 Using alternative download method for:", filePath)

    // Get signed URL and fetch directly
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (urlError) throw urlError

    console.log("🔗 Created signed URL, fetching with axios...")

    const axios = require('axios')
    const response = await axios.get(signedUrlData.signedUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    })

    const buffer = Buffer.from(response.data)

    console.log("✅ Alternative method successful:", {
      bufferSize: buffer.length,
      isBuffer: Buffer.isBuffer(buffer),
    })

    return {
      success: true,
      data: buffer,
    }
  } catch (error) {
    console.error("❌ Alternative download method failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Deletes a file from temporary storage
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Deletion result
 */
async function deleteTemporaryFile(filePath) {
  try {
    console.log("🗑️ Deleting file from storage:", filePath)

    const { error } = await supabaseAdmin.storage.from("documents").remove([filePath])

    if (error) {
      console.error("❌ File deletion error:", error)
      throw error
    }

    console.log("✅ File deleted successfully:", filePath)

    return {
      success: true,
    }
  } catch (error) {
    console.error("❌ File deletion error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Gets MIME type from file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
function getMimeType(extension) {
  const mimeTypes = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".webp": "image/webp",
  }

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream"
}

/**
 * Validates if a file exists in storage
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Validation result
 */
async function validateFileExists(filePath) {
  try {
    console.log("🔍 Validating file exists:", filePath)

    const { data, error } = await supabaseAdmin.storage
      .from("documents")
      .list(path.dirname(filePath), {
        search: path.basename(filePath)
      })

    if (error) throw error

    const fileExists = data && data.length > 0
    
    console.log("📋 File validation result:", {
      filePath,
      exists: fileExists,
      foundFiles: data ? data.length : 0,
    })

    return {
      success: true,
      exists: fileExists,
      files: data,
    }
  } catch (error) {
    console.error("❌ File validation error:", error)
    return {
      success: false,
      error: error.message,
      exists: false,
    }
  }
}

/**
 * Gets file info without downloading
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - File info
 */
async function getFileInfo(filePath) {
  try {
    const { data: urlData } = await supabaseAdmin.storage
      .from("documents")
      .getPublicUrl(filePath)

    // Try to get file metadata
    const validation = await validateFileExists(filePath)
    
    return {
      success: true,
      filePath,
      publicUrl: urlData.publicUrl,
      exists: validation.exists,
      fileInfo: validation.files?.[0] || null,
    }
  } catch (error) {
    console.error("❌ Get file info error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  uploadFileToTemporaryStorage,
  deleteTemporaryFile,
  getFileFromStorage, // Fixed version
  getFileFromStorageAlternative, // Backup method
  validateFileExists,
  getFileInfo,
  getMimeType,
}