import { supabase } from "../Auth/SupabaseAuth"

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
  console.log("Frontend: Getting authenticated session...")

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Frontend: Session error:", sessionError)
    throw new Error("Authentication required. Please log in again.")
  }

  if (!sessionData.session) {
    console.error("Frontend: No active session found")
    throw new Error("No active session found. Please log in again.")
  }

  console.log("Frontend: Session retrieved successfully")
  return sessionData.session.access_token
}

/**
 * Helper function to make authenticated API calls
 */
async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  console.log("Frontend: Making authenticated request to:", `${apiBaseUrl}${endpoint}`)
  console.log("Frontend: Request options:", {
    method: options.method || "GET",
    headers: { ...options.headers, Authorization: "[REDACTED]" },
    body: options.body ? "Present" : "None",
  })

  const token = await getAuthenticatedSession()

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  console.log("Frontend: Response received - Status:", response.status, "OK:", response.ok)
  return response
}

/**
 * Helper function to make public API calls (no auth required)
 */
async function makePublicRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  console.log("Frontend: Making public request to:", `${apiBaseUrl}${endpoint}`)
  console.log("Frontend: Request options:", {
    method: options.method || "GET",
    body: options.body ? "Present" : "None",
  })

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  console.log("Frontend: Public response received - Status:", response.status, "OK:", response.ok)
  return response
}

/**
 * Creates a new document share
 */
export async function createDocumentShare(shareData: DocumentShareRequest): Promise<DocumentShareResponse> {
  console.log("Frontend: Creating document share with data:", shareData)

  try {
    const response = await makeAuthenticatedRequest("/api/document-shares", {
      method: "POST",
      body: JSON.stringify(shareData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Create share error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Document share created successfully:", data)

    // Backend now returns data directly (no success wrapper)
    return data
  } catch (error) {
    console.error("Frontend: Error creating document share:", error)
    throw error
  }
}

/**
 * Sends emails to recipients for a document share
 */
export async function sendShareEmail(
  shareId: string,
): Promise<{ success: boolean; totalSent: number; totalFailed: number }> {
  console.log("Frontend: Sending share email for shareId:", shareId)

  try {
    const response = await makeAuthenticatedRequest("/api/send-document-share-email", {
      method: "POST",
      body: JSON.stringify({ shareId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Send email error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Share email sent successfully:", data)

    // Handle the response format from the email service
    return {
      success: true,
      totalSent: data.totalSent || 0,
      totalFailed: data.totalFailed || 0,
    }
  } catch (error) {
    console.error("Frontend: Error sending share emails:", error)
    throw error
  }
}

/**
 * Fetches a document share by token (public endpoint - no auth required)
 */
export async function fetchShareByToken(token: string) {
  console.log("Frontend: Fetching share by token:", token)

  try {
    const response = await makePublicRequest(`/api/document-shares/${token}`)

    if (response.status === 404) {
      console.log("Frontend: Share not found (404)")
      return { notFound: true }
    }

    if (response.status === 410) {
      console.log("Frontend: Share expired or revoked (410)")
      const errorData = await response.json()
      return { expired: true, shareInfo: errorData.shareInfo }
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Fetch share error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Share fetched successfully:", data)

    // Backend returns data directly
    return data
  } catch (error) {
    console.error("Frontend: Error fetching share by token:", error)
    throw error
  }
}

/**
 * Logs document access (public endpoint - no auth required)
 */
export async function logDocumentAccess(shareId: string, documentId: string | null, action: string, email?: string) {
  console.log("Frontend: Logging document access:", { shareId, documentId, action, email })

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
      console.error("Frontend: Log access error response:", errorData)
      return { success: false }
    }

    const data = await response.json()
    console.log("Frontend: Document access logged successfully:", data)
    return data
  } catch (error) {
    console.error("Frontend: Error logging document access:", error)
    // Don't throw here - we don't want to block the UI if logging fails
    return { success: false }
  }
}

/**
 * Fetches document shares for a user
 */
export async function getDocumentShares(vesselId?: string): Promise<DocumentShare[]> {
  console.log("Frontend: Fetching document shares for vesselId:", vesselId)

  try {
    let endpoint = "/api/document-shares"
    if (vesselId) {
      endpoint += `?vesselId=${encodeURIComponent(vesselId)}`
    }

    const response = await makeAuthenticatedRequest(endpoint)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Get shares error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Document shares fetched successfully:", data)

    // Backend returns array directly
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Frontend: Error fetching document shares:", error)
    throw error
  }
}

/**
 * Revokes a document share
 */
export async function revokeDocumentShare(shareId: string) {
  console.log("Frontend: Revoking document share:", shareId)

  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/revoke`, {
      method: "POST",
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Revoke share error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Document share revoked successfully:", data)

    // Backend returns data directly
    return data
  } catch (error) {
    console.error("Frontend: Error revoking share:", error)
    throw error
  }
}

/**
 * Extends the expiry date of a document share
 */
export async function extendShareAccess(shareId: string, newExpiryDate: string) {
  console.log("Frontend: Extending share access:", shareId, "to:", newExpiryDate)

  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/extend`, {
      method: "POST",
      body: JSON.stringify({ expiresAt: newExpiryDate }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Extend access error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Share access extended successfully:", data)

    // Backend returns data directly
    return data
  } catch (error) {
    console.error("Frontend: Error extending share access:", error)
    throw error
  }
}

/**
 * Gets access logs for a specific share
 */
export async function getShareAccessLogs(shareId: string): Promise<AccessLog[]> {
  console.log("Frontend: Fetching access logs for share:", shareId)

  try {
    const response = await makeAuthenticatedRequest(`/api/document-shares/${shareId}/access-logs`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Get access logs error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Access logs fetched successfully:", data)

    // Backend returns array directly
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Frontend: Error fetching access logs:", error)
    throw error
  }
}

/**
 * Batch operations for multiple shares
 */
export async function batchRevokeShares(shareIds: string[]) {
  console.log("Frontend: Batch revoking shares:", shareIds)

  try {
    const response = await makeAuthenticatedRequest("/api/document-shares/batch-revoke", {
      method: "POST",
      body: JSON.stringify({ shareIds }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Batch revoke error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Shares batch revoked successfully:", data)

    // Backend returns data directly
    return data
  } catch (error) {
    console.error("Frontend: Error batch revoking shares:", error)
    throw error
  }
}

/**
 * Get sharing analytics/statistics
 */
export async function getShareAnalytics(vesselId?: string, dateRange?: { from: string; to: string }) {
  console.log("Frontend: Fetching share analytics:", { vesselId, dateRange })

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

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Frontend: Get analytics error response:", errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Frontend: Share analytics fetched successfully:", data)

    // Backend returns data directly
    return data
  } catch (error) {
    console.error("Frontend: Error fetching share analytics:", error)
    throw error
  }
}
