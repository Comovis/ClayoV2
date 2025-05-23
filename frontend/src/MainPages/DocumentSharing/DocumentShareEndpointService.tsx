import { supabase } from "../../Auth/SupabaseAuth"

// API Base URL Configuration - matching your pattern
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

// Types for the document sharing service
export interface DocumentShareRequest {
  vesselId: string
  documentIds: string[]
  recipients: Recipient[]
  expiresAt: string
  message?: string
  securityOptions: SecurityOptions
}

export interface DocumentShareResponse {
  id: string
  shareToken: string
  shareUrl: string
  expiresAt: string
  createdAt: string
  recipients: Recipient[]
  documents: string[]
}

export interface Recipient {
  email: string
  name?: string
  type: string
}

export interface SecurityOptions {
  watermark: boolean
  preventDownloads: boolean
  accessTracking: boolean
  emailVerification: boolean
}

export interface DocumentShare {
  id: string
  vesselId: string
  vesselName: string
  vesselIMO: string
  shareUrl: string
  recipients: Recipient[]
  documents: Document[]
  documentCount: number
  createdAt: string
  expiresAt: string
  isRevoked: boolean
  isExpired: boolean
  securityOptions: SecurityOptions
  accessLogs?: AccessLog[]
}

export interface Document {
  id: string
  title: string
  document_type: string
  vessel_id: string
  category?: string
  issuer?: string
  certificate_number?: string
  issue_date?: string
  expiry_date?: string
  is_permanent?: boolean
  status?: string
  file_path?: string
  file_type?: string
  file_size?: number
}

export interface AccessLog {
  id: string
  documentId: string
  documentTitle: string
  userId?: string
  userEmail: string
  action: string
  timestamp: string
  ipAddress: string
  userAgent?: string
}

/**
 * Helper function to get authenticated session and token
 */
async function getAuthenticatedSession() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    throw new Error("Authentication required. Please log in again.")
  }

  if (!sessionData.session) {
    throw new Error("No active session found. Please log in again.")
  }

  return sessionData.session.access_token
}

/**
 * Helper function to make authenticated API calls with timeout
 */
async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
  timeout = 10000,
): Promise<Response> {
  const token = await getAuthenticatedSession()

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (fetchError) {
    clearTimeout(timeoutId)

    if (fetchError.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    } else {
      throw fetchError
    }
  }
}

/**
 * Helper function to make public API calls (no auth required)
 */
async function makePublicRequest(endpoint: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (fetchError) {
    clearTimeout(timeoutId)

    if (fetchError.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    } else {
      throw fetchError
    }
  }
}

/**
 * Creates a new document share
 */
export async function createDocumentShare(shareData: DocumentShareRequest): Promise<DocumentShareResponse> {
  try {
    const response = await makeAuthenticatedRequest("/api/document-shares", {
      method: "POST",
      body: JSON.stringify(shareData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create document share")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data.shareDetails
  } catch (error) {
    console.error("Error creating document share:", error)
    throw error
  }
}

/**
 * Sends emails to recipients for a document share
 */
export async function sendShareEmail(
  shareId: string,
): Promise<{ success: boolean; totalSent: number; totalFailed: number }> {
  try {
    const response = await makeAuthenticatedRequest("/api/send-document-share-email", {
      method: "POST",
      body: JSON.stringify({ shareId }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to send share emails")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return {
      success: data.success,
      totalSent: data.totalSent || 0,
      totalFailed: data.totalFailed || 0,
    }
  } catch (error) {
    console.error("Error sending share emails:", error)
    throw error
  }
}

/**
 * Fetches a document share by token (public endpoint - no auth required)
 */
export async function fetchShareByToken(token: string) {
  try {
    const response = await makePublicRequest(`/api/document-shares/${token}`)

    if (!response.ok) {
      if (response.status === 404) {
        return { notFound: true }
      }
      if (response.status === 410) {
        const errorData = await response.json()
        return { expired: true, shareInfo: errorData.shareInfo }
      }
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch share")
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data.shareData
  } catch (error) {
    console.error("Error fetching share by token:", error)
    throw error
  }
}

/**
 * Logs document access (public endpoint - no auth required)
 */
export async function logDocumentAccess(shareId: string, documentId: string | null, action: string, email?: string) {
  try {
    const response = await makePublicRequest("/api/document-access-logs", {
      method: "POST",
      body: JSON.stringify({
        shareId,
        documentId,
        action, // 'view_share', 'view_document', 'download'
        email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to log document access")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error logging document access:", error)
    // Don't throw here - we don't want to block the UI if logging fails
    return { success: false }
  }
}

/**
 * Fetches document shares for a user
 */
export async function getDocumentShares(vesselId?: string): Promise<DocumentShare[]> {
  try {
    let endpoint = "/api/document-shares"
    if (vesselId) {
      endpoint += `?vesselId=${encodeURIComponent(vesselId)}`
    }

    const response = await makeAuthenticatedRequest(endpoint)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch document shares")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    // Ensure we return an array
    return Array.isArray(data.shares) ? data.shares : []
  } catch (error) {
    console.error("Error fetching document shares:", error)
    throw error
  }
}

/**
 * Revokes a document share
 */
export async function revokeDocumentShare(shareId: string) {
  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/revoke`, {
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to revoke share")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data
  } catch (error) {
    console.error("Error revoking share:", error)
    throw error
  }
}

/**
 * Extends the expiry date of a document share
 */
export async function extendShareAccess(shareId: string, newExpiryDate: string) {
  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/extend`, {
      method: "POST",
      body: JSON.stringify({ expiresAt: newExpiryDate }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to extend share access")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data
  } catch (error) {
    console.error("Error extending share access:", error)
    throw error
  }
}

/**
 * Gets access logs for a specific share
 */
export async function getShareAccessLogs(shareId: string): Promise<AccessLog[]> {
  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/access-logs`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch access logs")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    // Ensure we return an array
    return Array.isArray(data.accessLogs) ? data.accessLogs : []
  } catch (error) {
    console.error("Error fetching access logs:", error)
    throw error
  }
}

/**
 * Batch operations for multiple shares
 */
export async function batchRevokeShares(shareIds: string[]) {
  try {
    const response = await makeAuthenticatedRequest("/api/document-shares/batch-revoke", {
      method: "POST",
      body: JSON.stringify({ shareIds }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to revoke shares")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data
  } catch (error) {
    console.error("Error batch revoking shares:", error)
    throw error
  }
}

/**
 * Get sharing analytics/statistics
 */
export async function getShareAnalytics(vesselId?: string, dateRange?: { from: string; to: string }) {
  try {
    let endpoint = "/api/document-shares/analytics"
    const params = new URLSearchParams()

    if (vesselId) {
      params.append("vesselId", vesselId)
    }

    if (dateRange) {
      params.append("from", dateRange.from)
      params.append("to", dateRange.to)
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const response = await makeAuthenticatedRequest(endpoint)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch share analytics")
    }

    if (!data.success) {
      throw new Error(data.error || "API returned unsuccessful response")
    }

    return data.analytics
  } catch (error) {
    console.error("Error fetching share analytics:", error)
    throw error
  }
}
