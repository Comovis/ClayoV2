const { supabaseAdmin } = require("../../SupabaseClient")
const { generateDocumentDownloadUrl, createAccessLog } = require("./DocumentUploadsHandler")

/**
 * Generate batch download URLs for multiple documents
 * @param {Array} documentIds - Array of document IDs to download
 * @param {String} userId - ID of the user requesting the download
 * @param {String} userAgent - User agent string
 * @param {String} ipAddress - IP address of the user
 * @returns {Promise<Object>} Result with download URLs
 */
async function generateBatchDownloadUrls(documentIds, userId, userAgent, ipAddress) {
  try {
    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return {
        success: false,
        error: 'No document IDs provided'
      }
    }
    
    // Get all documents
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('id, title, file_path, vessel_id')
      .in('id', documentIds)
      
    if (error) {
      console.error('Error retrieving documents:', error)
      return {
        success: false,
        error: 'Failed to retrieve documents'
      }
    }
    
    if (documents.length === 0) {
      return {
        success: false,
        error: 'No documents found with the provided IDs'
      }
    }
    
    // Get vessel IDs to check permissions
    const vesselIds = [...new Set(documents.map(doc => doc.vessel_id))]
    
    // Check if user has access to all vessels
    const { data: vessels } = await supabaseAdmin
      .from('vessels')
      .select('id, company_id')
      .in('id', vesselIds)
      
    // Get user's company
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()
      
    // Check if all vessels belong to user's company
    const hasAccess = vessels.every(vessel => vessel.company_id === user.company_id)
    
    if (!hasAccess) {
      return {
        success: false,
        error: 'You do not have permission to download some of these documents'
      }
    }
    
    // Generate signed URLs for all documents
    const downloadUrls = await Promise.all(
      documents.map(async (doc) => {
        const { success, signedUrl } = await generateDocumentDownloadUrl(
          doc.file_path,
          600 // 10 minutes
        )
        
        // Log the download access
        await createAccessLog({
          documentId: doc.id,
          userId,
          action: 'batch_download',
          userAgent,
          ipAddress
        })
        
        return {
          id: doc.id,
          title: doc.title,
          downloadUrl: success ? signedUrl : null
        }
      })
    )
    
    return {
      success: true,
      documents: downloadUrls.filter(doc => doc.downloadUrl !== null),
      expiresIn: 600
    }
  } catch (error) {
    console.error('Error generating batch download URLs:', error)
    return {
      success: false,
      error: 'Failed to generate batch download URLs'
    }
  }
}

/**
 * Handle batch document download request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleBatchDocumentDownload(req, res) {
  try {
    const { documentIds } = req.body
    const userId = req.user.user_id
    
    const result = await generateBatchDownloadUrls(
      documentIds,
      userId,
      req.headers['user-agent'],
      req.ip
    )
    
    if (!result.success) {
      const statusCode = result.error.includes('permission') ? 403 : 
                         result.error.includes('No documents found') ? 404 : 400
      
      return res.status(statusCode).json({
        success: false,
        error: result.error
      })
    }
    
    return res.status(200).json({
      success: true,
      documents: result.documents,
      expiresIn: result.expiresIn
    })
  } catch (error) {
    console.error('Error handling batch document download:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate batch download URLs'
    })
  }
}

module.exports = {
  generateBatchDownloadUrls,
  handleBatchDocumentDownload
}