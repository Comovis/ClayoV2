const { supabaseAdmin } = require("../../SupabaseClient")
const { v4: uuidv4 } = require("uuid")
const path = require("path")

/**
 * Upload a file to temporary storage for processing
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalFilename - Original file name
 * @param {String} mimeType - File MIME type
 * @param {String} userId - User ID
 * @returns {Object} Upload result with temp file path
 */
async function uploadToTempStorage(fileBuffer, originalFilename, mimeType, userId) {
  try {
    // Generate a unique filename
    const fileExtension = path.extname(originalFilename)
    const uniqueFileName = `${uuidv4()}${fileExtension}`
    
    // Create temp storage path: {userId}/{uniqueFileName}
    const tempPath = `${userId}/${uniqueFileName}`
    
    // Upload file to temp-uploads bucket
    const { data, error } = await supabaseAdmin.storage
      .from('temp-uploads')
      .upload(tempPath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Temp storage upload error:', error)
      return {
        success: false,
        error: `Failed to upload to temp storage: ${error.message}`
      }
    }

    return {
      success: true,
      tempPath,
      fileName: uniqueFileName
    }
  } catch (error) {
    console.error('Error uploading to temp storage:', error)
    return {
      success: false,
      error: 'Failed to upload to temp storage'
    }
  }
}

/**
 * Move file from temp storage to permanent document storage
 * @param {String} tempPath - Path in temp storage
 * @param {String} vesselId - Vessel ID
 * @param {String} documentType - Document type
 * @param {String} documentCategory - Document category
 * @param {String} userId - User ID
 * @returns {Object} Result with permanent file path and URL
 */
async function moveFromTempToPermanentStorage(tempPath, vesselId, documentType, documentCategory, userId) {
  try {
    // Get the file from temp storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('temp-uploads')
      .download(tempPath)

    if (downloadError) {
      console.error('Error downloading from temp storage:', downloadError)
      return {
        success: false,
        error: `Failed to download from temp storage: ${downloadError.message}`
      }
    }

    // Extract filename from temp path
    const fileName = path.basename(tempPath)
    
    // Create permanent storage path
    const permanentPath = `${vesselId}/${documentType}/${documentCategory}/${userId}/${fileName}`
    
    // Upload to permanent storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(permanentPath, fileData, {
        contentType: getMimeType(path.extname(fileName)),
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading to permanent storage:', uploadError)
      return {
        success: false,
        error: `Failed to upload to permanent storage: ${uploadError.message}`
      }
    }

    // Delete from temp storage
    await deleteTempFile(tempPath)

    // Get public URL for the file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(permanentPath)

    return {
      success: true,
      filePath: permanentPath,
      publicUrl
    }
  } catch (error) {
    console.error('Error moving file from temp to permanent storage:', error)
    return {
      success: false,
      error: 'Failed to move file to permanent storage'
    }
  }
}

/**
 * Upload a file directly to permanent storage (bypassing temp)
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalFilename - Original file name
 * @param {String} mimeType - File MIME type
 * @param {String} vesselId - Vessel ID
 * @param {String} documentType - Document type
 * @param {String} documentCategory - Document category
 * @param {String} userId - User ID
 * @returns {Object} Upload result with file path and URL
 */
async function uploadToPermanentStorage(fileBuffer, originalFilename, mimeType, vesselId, documentType, documentCategory, userId) {
  try {
    // Generate a unique filename
    const fileExtension = path.extname(originalFilename)
    const uniqueFileName = `${uuidv4()}${fileExtension}`
    
    // Create storage path
    const storagePath = `${vesselId}/${documentType}/${documentCategory}/${userId}/${uniqueFileName}`
    
    // Upload file to documents bucket
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return {
        success: false,
        error: `Failed to upload document to storage: ${error.message}`
      }
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(storagePath)

    return {
      success: true,
      filePath: storagePath,
      publicUrl
    }
  } catch (error) {
    console.error('Error uploading to storage:', error)
    return {
      success: false,
      error: 'Failed to upload document to storage'
    }
  }
}

/**
 * Delete a file from temp storage
 * @param {String} tempPath - Path to the file in temp storage
 * @returns {Object} Result of the operation
 */
async function deleteTempFile(tempPath) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('temp-uploads')
      .remove([tempPath])
    
    if (error) {
      console.error('Failed to delete temp file:', error)
      return {
        success: false,
        error: `Failed to delete temp file: ${error.message}`
      }
    }

    console.log(`Successfully deleted temp file: ${tempPath}`)
    return {
      success: true,
      message: 'Temp file deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting temp file:', error)
    return {
      success: false,
      error: 'Failed to delete temp file'
    }
  }
}

/**
 * Generate a signed URL for document download
 * @param {String} filePath - Path to the file in storage
 * @param {Number} expiresIn - Seconds until URL expires (default: 60)
 * @returns {Object} Result with signed URL
 */
async function generateDocumentDownloadUrl(filePath, expiresIn = 60) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('Error generating signed URL:', error)
      return {
        success: false,
        error: `Failed to generate download URL: ${error.message}`
      }
    }

    return {
      success: true,
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + (expiresIn * 1000)).toISOString()
    }
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return {
      success: false,
      error: 'Failed to generate download URL'
    }
  }
}

/**
 * Delete a file from permanent storage
 * @param {String} filePath - Path to the file in storage
 * @returns {Object} Result of the operation
 */
async function deleteDocumentFile(filePath) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .remove([filePath])
    
    if (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: `Failed to delete file: ${error.message}`
      }
    }

    return {
      success: true,
      message: 'File deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: 'Failed to delete file'
    }
  }
}

/**
 * Clean up old temp files (for scheduled jobs)
 * @param {Number} olderThanHours - Delete files older than this many hours
 * @returns {Object} Result with deleted files count
 */
async function cleanupOldTempFiles(olderThanHours = 24) {
  try {
    // List all files in temp-uploads
    const { data: files, error } = await supabaseAdmin.storage
      .from('temp-uploads')
      .list('', {
        sortBy: { column: 'created_at', order: 'asc' }
      })
      
    if (error) {
      console.error('Error listing temp files:', error)
      return {
        success: false,
        error: `Failed to list temp files: ${error.message}`
      }
    }
    
    // Find files older than specified hours
    const now = new Date()
    const oldFiles = files.filter(file => {
      const fileDate = new Date(file.created_at)
      const hoursDiff = (now - fileDate) / (1000 * 60 * 60)
      return hoursDiff > olderThanHours
    })
    
    if (oldFiles.length === 0) {
      console.log('No old temp files to clean up')
      return {
        success: true,
        message: 'No old temp files to clean up',
        deletedCount: 0
      }
    }
    
    // Delete old files
    const filePaths = oldFiles.map(file => file.name)
    const { error: deleteError } = await supabaseAdmin.storage
      .from('temp-uploads')
      .remove(filePaths)
      
    if (deleteError) {
      console.error('Error deleting temp files:', deleteError)
      return {
        success: false,
        error: `Failed to delete temp files: ${deleteError.message}`
      }
    }
    
    console.log(`Successfully cleaned up ${filePaths.length} temp files`)
    return {
      success: true,
      message: `Successfully cleaned up ${filePaths.length} temp files`,
      deletedCount: filePaths.length
    }
  } catch (error) {
    console.error('Error in cleanup job:', error)
    return {
      success: false,
      error: 'Failed to clean up temp files'
    }
  }
}

/**
 * Get MIME type from file extension
 * @param {String} extension - File extension
 * @returns {String} MIME type
 */
function getMimeType(extension) {
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}

module.exports = {
  uploadToTempStorage,
  moveFromTempToPermanentStorage,
  uploadToPermanentStorage,
  deleteTempFile,
  generateDocumentDownloadUrl,
  deleteDocumentFile,
  cleanupOldTempFiles
}