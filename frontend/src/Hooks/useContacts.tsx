import { supabase } from "../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

/**
 * Creates a new contact
 * @param {Object} contactData - Contact data to create
 * @returns {Promise<Object>} Created contact data
 */
const createContact = async (contactData) => {
  try {
    // Get the current session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    // Get the access token from the session
    const token = sessionData.session.access_token

    // Call the API to create contact
    const response = await fetch(`${apiBaseUrl}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create contact")
    }

    return data
  } catch (error) {
    console.error("Error creating contact:", error)
    throw error
  }
}

/**
 * Fetches contacts for a vessel
 * @param {string} vesselId - ID of the vessel
 * @returns {Promise<Array>} Array of contacts
 */
const fetchVesselContacts = async (vesselId) => {
  try {
    // Get the current session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    // Get the access token from the session
    const token = sessionData.session.access_token

    // Call the API to get vessel contacts
    const response = await fetch(`${apiBaseUrl}/api/vessels/${vesselId}/contacts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch vessel contacts")
    }

    return data
  } catch (error) {
    console.error("Error fetching vessel contacts:", error)
    throw error
  }
}

/**
 * Updates a contact
 * @param {string} contactId - ID of the contact to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated contact data
 */
const updateContact = async (contactId, updateData) => {
  try {
    // Get the current session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    // Get the access token from the session
    const token = sessionData.session.access_token

    // Call the API to update contact
    const response = await fetch(`${apiBaseUrl}/api/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to update contact")
    }

    return data
  } catch (error) {
    console.error("Error updating contact:", error)
    throw error
  }
}

/**
 * Deletes a contact
 * @param {string} contactId - ID of the contact to delete
 * @returns {Promise<Object>} Success message
 */
const deleteContact = async (contactId) => {
  try {
    // Get the current session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    // Get the access token from the session
    const token = sessionData.session.access_token

    // Call the API to delete contact
    const response = await fetch(`${apiBaseUrl}/api/contacts/${contactId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete contact")
    }

    return data
  } catch (error) {
    console.error("Error deleting contact:", error)
    throw error
  }
}

export {
  createContact,
  fetchVesselContacts,
  updateContact,
  deleteContact,
}