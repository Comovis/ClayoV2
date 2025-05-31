// Update the import to use supabaseAdmin
const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Creates a new contact
 * @param {Object} contactData - Data for the new contact
 * @param {string} contactData.vesselId - ID of the vessel
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.role - Contact role
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.phone - Contact phone (optional)
 * @param {string} contactData.company - Contact company (optional)
 * @param {string} contactData.location - Contact location
 * @param {string} contactData.contactType - Type of contact
 * @param {string} contactData.associatedPort - Associated port (optional)
 * @param {string} contactData.notes - Notes (optional)
 * @param {boolean} contactData.emergencyContact - Emergency contact flag
 * @param {boolean} contactData.primaryContact - Primary contact flag
 * @param {string} userId - ID of the user creating the contact
 * @returns {Promise<Object>} Contact details or error
 */
async function createContact(contactData, userId) {
  try {
    console.log("=== CREATE CONTACT ===")
    console.log("contactData:", JSON.stringify(contactData, null, 2))
    console.log("userId:", userId)

    const {
      vesselId,
      name,
      role,
      email,
      phone,
      company,
      location,
      contactType,
      associatedPort,
      notes,
      emergencyContact,
      primaryContact
    } = contactData

    // Validation
    if (!vesselId || !name || !role || !email || !location) {
      const missingFields = []
      if (!vesselId) missingFields.push("vesselId")
      if (!name) missingFields.push("name")
      if (!role) missingFields.push("role")
      if (!email) missingFields.push("email")
      if (!location) missingFields.push("location")

      console.log("VALIDATION FAILED - Missing fields:", missingFields)
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }

    // Verify vessel exists and user has access
    const { data: vesselData, error: vesselError } = await supabaseAdmin
      .from("vessels")
      .select("id, name, company_id")
      .eq("id", vesselId)
      .single()

    if (vesselError || !vesselData) {
      throw new Error("Vessel not found")
    }

    // Check for duplicate email for this vessel
    const { data: existingContact, error: duplicateError } = await supabaseAdmin
      .from("contacts")
      .select("id")
      .eq("vessel_id", vesselId)
      .eq("email", email)
      .single()

    if (existingContact) {
      throw new Error("A contact with this email already exists for this vessel")
    }

    // Create contact record
    const contactRecord = {
      vessel_id: vesselId,
      name,
      role,
      email,
      phone: phone || null,
      company: company || null,
      location,
      contact_type: contactType || 'other',
      associated_port: associatedPort || null,
      notes: notes || null,
      emergency_contact: emergencyContact || false,
      primary_contact: primaryContact || false,
      created_by: userId
    }

    const { data: contact, error } = await supabaseAdmin
      .from("contacts")
      .insert(contactRecord)
      .select("*")
      .single()

    if (error) {
      console.error("Contact creation failed:", error)
      throw new Error("Failed to create contact")
    }

    console.log("Contact created successfully:", contact.id)

    return {
      id: contact.id,
      vesselId: contact.vessel_id,
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      location: contact.location,
      contactType: contact.contact_type,
      associatedPort: contact.associated_port,
      notes: contact.notes,
      emergencyContact: contact.emergency_contact,
      primaryContact: contact.primary_contact,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    }
  } catch (error) {
    console.error("Error in createContact:", error)
    throw error
  }
}

/**
 * Gets contacts for a vessel
 * @param {string} vesselId - ID of the vessel
 * @param {string} userId - ID of the requesting user
 * @returns {Promise<Array>} List of contacts or error
 */
async function getVesselContacts(vesselId, userId) {
  try {
    console.log("=== GET VESSEL CONTACTS ===")
    console.log("vesselId:", vesselId, "userId:", userId)

    if (!vesselId) {
      throw new Error("Vessel ID is required")
    }

    // Verify vessel exists and user has access
    const { data: vesselData, error: vesselError } = await supabaseAdmin
      .from("vessels")
      .select("id, name, company_id")
      .eq("id", vesselId)
      .single()

    if (vesselError || !vesselData) {
      throw new Error("Vessel not found or access denied")
    }

    const { data: contacts, error } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("vessel_id", vesselId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error("Failed to fetch contacts")
    }

    // Transform data
    const transformedContacts = (contacts || []).map(contact => ({
      id: contact.id,
      vesselId: contact.vessel_id,
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      location: contact.location,
      contactType: contact.contact_type,
      associatedPort: contact.associated_port,
      notes: contact.notes,
      emergencyContact: contact.emergency_contact,
      primaryContact: contact.primary_contact,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    }))

    return transformedContacts
  } catch (error) {
    console.error("Error in getVesselContacts:", error)
    throw error
  }
}

/**
 * Updates a contact
 * @param {string} contactId - ID of the contact to update
 * @param {Object} updateData - Data to update
 * @param {string} userId - ID of the user updating the contact
 * @returns {Promise<Object>} Updated contact or error
 */
async function updateContact(contactId, updateData, userId) {
  try {
    console.log("=== UPDATE CONTACT ===")
    console.log("contactId:", contactId, "userId:", userId)
    console.log("updateData:", JSON.stringify(updateData, null, 2))

    // Check if contact exists and user has permission
    const { data: existingContact, error: fetchError } = await supabaseAdmin
      .from("contacts")
      .select("id, vessel_id, email")
      .eq("id", contactId)
      .single()

    if (fetchError || !existingContact) {
      throw new Error("Contact not found")
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== existingContact.email) {
      const { data: duplicateContact } = await supabaseAdmin
        .from("contacts")
        .select("id")
        .eq("vessel_id", existingContact.vessel_id)
        .eq("email", updateData.email)
        .neq("id", contactId)
        .single()

      if (duplicateContact) {
        throw new Error("A contact with this email already exists for this vessel")
      }
    }

    // Prepare update data
    const updateRecord = {
      ...updateData,
      contact_type: updateData.contactType,
      associated_port: updateData.associatedPort,
      emergency_contact: updateData.emergencyContact,
      primary_contact: updateData.primaryContact,
      updated_at: new Date().toISOString()
    }

    // Remove undefined fields and camelCase fields
    Object.keys(updateRecord).forEach(key => {
      if (updateRecord[key] === undefined || 
          ['contactType', 'associatedPort', 'emergencyContact', 'primaryContact'].includes(key)) {
        delete updateRecord[key]
      }
    })

    const { data: contact, error } = await supabaseAdmin
      .from("contacts")
      .update(updateRecord)
      .eq("id", contactId)
      .select("*")
      .single()

    if (error) {
      console.error("Contact update failed:", error)
      throw new Error("Failed to update contact")
    }

    console.log("Contact updated successfully:", contact.id)

    return {
      id: contact.id,
      vesselId: contact.vessel_id,
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      location: contact.location,
      contactType: contact.contact_type,
      associatedPort: contact.associated_port,
      notes: contact.notes,
      emergencyContact: contact.emergency_contact,
      primaryContact: contact.primary_contact,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    }
  } catch (error) {
    console.error("Error in updateContact:", error)
    throw error
  }
}

/**
 * Deletes a contact
 * @param {string} contactId - ID of the contact to delete
 * @param {string} userId - ID of the user deleting the contact
 * @returns {Promise<Object>} Success status or error
 */
async function deleteContact(contactId, userId) {
  try {
    console.log("=== DELETE CONTACT ===")
    console.log("contactId:", contactId, "userId:", userId)

    // Check if contact exists
    const { data: existingContact, error: fetchError } = await supabaseAdmin
      .from("contacts")
      .select("id, name")
      .eq("id", contactId)
      .single()

    if (fetchError || !existingContact) {
      throw new Error("Contact not found")
    }

    const { error } = await supabaseAdmin
      .from("contacts")
      .delete()
      .eq("id", contactId)

    if (error) {
      console.error("Contact deletion failed:", error)
      throw new Error("Failed to delete contact")
    }

    console.log("Contact deleted successfully:", contactId)

    return { 
      message: "Contact deleted successfully",
      deletedContact: existingContact.name
    }
  } catch (error) {
    console.error("Error in deleteContact:", error)
    throw error
  }
}

/**
 * API Handlers - These handle the Express requests/responses
 */
async function handleCreateContact(req, res) {
  try {
    console.log("=== API HANDLER: CREATE CONTACT ===")
    console.log("Request body:", JSON.stringify(req.body, null, 2))

    const contactData = req.body
    const userId = req.user?.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await createContact(contactData, userId)

    console.log("Contact created, returning 201 with data:", result)
    return res.status(201).json(result)
  } catch (error) {
    console.error("Error in handleCreateContact:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleGetVesselContacts(req, res) {
  try {
    console.log("=== API HANDLER: GET VESSEL CONTACTS ===")
    
    const { vesselId } = req.params
    const userId = req.user?.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await getVesselContacts(vesselId, userId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleGetVesselContacts:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleUpdateContact(req, res) {
  try {
    console.log("=== API HANDLER: UPDATE CONTACT ===")
    
    const { contactId } = req.params
    const updateData = req.body
    const userId = req.user?.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await updateContact(contactId, updateData, userId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleUpdateContact:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleDeleteContact(req, res) {
  try {
    console.log("=== API HANDLER: DELETE CONTACT ===")
    
    const { contactId } = req.params
    const userId = req.user?.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await deleteContact(contactId, userId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleDeleteContact:", error)
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createContact,
  getVesselContacts,
  updateContact,
  deleteContact,
  handleCreateContact,
  handleGetVesselContacts,
  handleUpdateContact,
  handleDeleteContact,
}