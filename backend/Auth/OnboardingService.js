const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Helper function to get user and organization data
 * @param {string} userId - The user ID
 */
async function getUserWithOrganization(userId) {
  const { data: userData, error: userError } = await supabaseAdmin
    .from("users")
    .select(`
      id,
      organization_id,
      email,
      full_name,
      role,
      onboarding_step,
      organizations (
        id,
        name,
        domain,
        settings,
        created_at
      )
    `)
    .eq("id", userId)
    .single()

  if (userError) {
    throw new Error(`User fetch error: ${userError.message}`)
  }

  if (!userData.organizations) {
    throw new Error("User organization not found")
  }

  return {
    user: userData,
    organization: userData.organizations,
    organizationId: userData.organization_id,
  }
}

/**
 * Updates user onboarding step and organization data
 * @param {string} userId - The user ID
 * @param {string} step - The onboarding step
 * @param {Object} stepData - The data for this step
 */
async function updateOnboardingStep(userId, step, stepData) {
  console.log(`Updating onboarding step ${step} for user ${userId}`)

  try {
    // Get user and organization data
    const { user, organization, organizationId } = await getUserWithOrganization(userId)

    // Get current organization settings
    const currentSettings = organization.settings || {}
    let updatedSettings = { ...currentSettings }

    // Handle step-specific logic
    switch (step) {
      case "company":
        updatedSettings = {
          ...updatedSettings,
          industry: stepData.industry,
          company_size: stepData.companySize,
          description: stepData.description,
        }

        // Update organization name and domain
        await supabaseAdmin
          .from("organizations")
          .update({
            name: stepData.companyName,
            domain: stepData.website,
          })
          .eq("id", organizationId)
        break

      case "team":
        updatedSettings = {
          ...updatedSettings,
          team_size: stepData.teamSize,
          departments: stepData.departments,
          working_hours: stepData.workingHours,
          timezone: stepData.timezone,
        }
        break

      case "channels":
        // Create integrations for enabled channels
        const integrations = []

        if (stepData.emailConfig?.enabled) {
          integrations.push({
            organization_id: organizationId,
            type: "email",
            name: "Email Support",
            config: { address: stepData.emailConfig.address },
            is_active: true,
          })
        }

        if (stepData.chatConfig?.enabled) {
          integrations.push({
            organization_id: organizationId,
            type: "chat",
            name: "Website Chat",
            config: { widget_enabled: stepData.chatConfig.widget },
            is_active: true,
          })
        }

        if (stepData.phoneConfig?.enabled) {
          integrations.push({
            organization_id: organizationId,
            type: "phone",
            name: "Phone Support",
            config: { number: stepData.phoneConfig.number },
            is_active: true,
          })
        }

        if (integrations.length > 0) {
          const { error: intError } = await supabaseAdmin.from("integrations").insert(integrations)

          if (intError) {
            throw new Error(`Integration creation error: ${intError.message}`)
          }
        }

        updatedSettings = {
          ...updatedSettings,
          enabled_channels: [
            ...(stepData.emailConfig?.enabled ? ["email"] : []),
            ...(stepData.chatConfig?.enabled ? ["chat"] : []),
            ...(stepData.phoneConfig?.enabled ? ["phone"] : []),
          ],
        }
        break

      case "ai":
        updatedSettings = {
          ...updatedSettings,
          ai_config: {
            personality: stepData.aiPersonality,
            response_style: stepData.responseStyle,
            knowledge_areas: stepData.knowledgeAreas,
            auto_response: stepData.autoResponse,
            escalation_rules: stepData.escalationRules,
          },
        }
        break
    }

    // Update organization settings
    const { data: orgData, error: updateError } = await supabaseAdmin
      .from("organizations")
      .update({ settings: updatedSettings })
      .eq("id", organizationId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Organization update error: ${updateError.message}`)
    }

    // Update user's onboarding step
    const { error: userError } = await supabaseAdmin.from("users").update({ onboarding_step: step }).eq("id", userId)

    if (userError) {
      throw new Error(`User update error: ${userError.message}`)
    }

    // Log analytics event
    await supabaseAdmin.from("analytics_events").insert({
      organization_id: organizationId,
      user_id: userId,
      event_type: "onboarding_step_completed",
      event_data: {
        step,
        data: stepData,
      },
    })

    return {
      success: true,
      step,
      organization: orgData,
    }
  } catch (error) {
    console.error(`Onboarding step ${step} update failed:`, error)
    throw error
  }
}

/**
 * Completes the entire onboarding process
 * @param {string} userId - The user ID
 * @param {Object} onboardingData - Complete onboarding data
 */
async function updateOrganizationOnboarding(userId, onboardingData) {
  console.log(`Completing onboarding for user ${userId}`)

  try {
    // Get user and organization data
    const { user, organization, organizationId } = await getUserWithOrganization(userId)

    // Prepare final settings
    const currentSettings = organization.settings || {}
    const finalSettings = {
      ...currentSettings,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      // Store all onboarding data
      industry: onboardingData.industry,
      company_size: onboardingData.companySize,
      description: onboardingData.description,
      team_size: onboardingData.teamSize,
      departments: onboardingData.departments,
      working_hours: onboardingData.workingHours,
      timezone: onboardingData.timezone,
      ai_config: {
        personality: onboardingData.aiPersonality,
        response_style: onboardingData.responseStyle,
        knowledge_areas: onboardingData.knowledgeAreas,
        auto_response: onboardingData.autoResponse,
        escalation_rules: onboardingData.escalationRules,
      },
    }

    // Update organization
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .update({
        name: onboardingData.companyName,
        domain: onboardingData.website,
        settings: finalSettings,
      })
      .eq("id", organizationId)
      .select()
      .single()

    if (orgError) {
      throw new Error(`Organization update error: ${orgError.message}`)
    }

    // Create integrations for enabled channels
    const integrations = []

    if (onboardingData.emailConfig?.enabled) {
      integrations.push({
        organization_id: organizationId,
        type: "email",
        name: "Email Support",
        config: { address: onboardingData.emailConfig.address },
        is_active: true,
      })
    }

    if (onboardingData.chatConfig?.enabled) {
      integrations.push({
        organization_id: organizationId,
        type: "chat",
        name: "Website Chat",
        config: { widget_enabled: onboardingData.chatConfig.widget },
        is_active: true,
      })
    }

    if (onboardingData.phoneConfig?.enabled) {
      integrations.push({
        organization_id: organizationId,
        type: "phone",
        name: "Phone Support",
        config: { number: onboardingData.phoneConfig.number },
        is_active: true,
      })
    }

    if (integrations.length > 0) {
      const { error: intError } = await supabaseAdmin.from("integrations").insert(integrations)

      if (intError) {
        throw new Error(`Integration error: ${intError.message}`)
      }
    }

    // Create initial knowledge base entries if knowledge areas are selected
    if (onboardingData.knowledgeAreas && onboardingData.knowledgeAreas.length > 0) {
      const knowledgeEntries = onboardingData.knowledgeAreas.map((area) => ({
        organization_id: organizationId,
        title: `${area} - Getting Started`,
        content: `This is a placeholder for ${area} knowledge. You can edit this content in the knowledge base section.`,
        category: area,
        tags: [area.toLowerCase().replace(/\s+/g, "-"), "onboarding"],
        is_active: true,
        created_by: userId,
      }))

      const { error: kbError } = await supabaseAdmin.from("knowledge_base").insert(knowledgeEntries)

      if (kbError) {
        console.warn("Knowledge base creation failed:", kbError)
        // Non-critical error, continue
      }
    }

    // Update user's onboarding step to completed
    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({ onboarding_step: "completed" })
      .eq("id", userId)

    if (userError) {
      throw new Error(`User update error: ${userError.message}`)
    }

    // Log completion event
    await supabaseAdmin.from("analytics_events").insert({
      organization_id: organizationId,
      user_id: userId,
      event_type: "onboarding_completed",
      event_data: {
        completed_at: new Date().toISOString(),
        steps_completed: ["company", "team", "channels", "ai"],
        integrations_enabled: integrations.map((i) => i.type),
        knowledge_areas: onboardingData.knowledgeAreas || [],
      },
    })

    return {
      success: true,
      organization: orgData,
      integrationsCreated: integrations.length,
    }
  } catch (error) {
    console.error("Onboarding completion failed:", error)
    throw error
  }
}

/**
 * Gets user's onboarding status
 * @param {string} userId - The user ID
 */
async function getUserOnboardingStatus(userId) {
  try {
    // Get user and organization data in one query
    const { user, organization, organizationId } = await getUserWithOrganization(userId)

    const currentStep = user.onboarding_step || "welcome"
    const isCompleted = currentStep === "completed"

    // Only fetch integrations if needed for UI pre-population
    let integrations = []
    if (!isCompleted && ["channels", "ai"].includes(currentStep)) {
      const { data: integrationsData, error: intError } = await supabaseAdmin
        .from("integrations")
        .select("*")
        .eq("organization_id", organizationId)

      if (intError) {
        console.warn("Failed to fetch integrations:", intError)
      } else {
        integrations = integrationsData || []
      }
    }

    return {
      success: true,
      currentStep,
      isCompleted,
      organization,
      integrations,
    }
  } catch (error) {
    console.error("Error getting onboarding status:", error)
    throw error
  }
}

module.exports = {
  updateOrganizationOnboarding,
  updateOnboardingStep,
  getUserOnboardingStatus,
}
