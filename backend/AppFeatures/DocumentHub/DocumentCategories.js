/**
 * Unified Maritime Document Classification System
 * AI-FIRST APPROACH - Trust the AI to classify intelligently
 * This file provides structure and validation, NOT manual mapping
 */

// High-level categories matching your client UI exactly
const DOCUMENT_CATEGORIES = {
  STATUTORY: {
    value: "statutory",
    label: "Statutory",
    description: "Mandatory certificates and regulatory documents required by international maritime law",
    aiGuidance: [
      "SOLAS certificates (Safety of Life at Sea)",
      "MARPOL certificates (Marine Pollution)",
      "ISM certificates (International Safety Management)",
      "ISPS certificates (International Ship and Port Facility Security)",
      "MLC certificates (Maritime Labour Convention)",
      "Load Line, Tonnage, Registry certificates",
      "Radio Safety, Cargo Ship Safety certificates",
      "Any certificate required by IMO conventions",
    ],
    subcategories: {
      SAFETY: {
        value: "safety",
        description: "Safety-related statutory certificates",
        examples: ["Safety Management Certificate", "Cargo Ship Safety Certificate", "Radio Safety Certificate"],
      },
      ENVIRONMENTAL: {
        value: "environmental",
        description: "Environmental compliance certificates",
        examples: ["IOPP Certificate", "IAPP Certificate", "Ballast Water Management Certificate"],
      },
      SECURITY: {
        value: "security",
        description: "Security-related certificates",
        examples: ["International Ship Security Certificate", "ISPS Certificate"],
      },
      STRUCTURAL: {
        value: "structural",
        description: "Structural and technical certificates",
        examples: ["Load Line Certificate", "Tonnage Certificate", "Certificate of Registry"],
      },
      OPERATIONAL: {
        value: "operational",
        description: "Operational compliance certificates",
        examples: ["Maritime Labour Certificate", "Document of Compliance"],
      },
    },
  },

  CLASSIFICATION: {
    value: "classification",
    label: "Classification",
    description: "Classification society certificates, surveys, and structural assessments",
    aiGuidance: [
      "Classification society certificates (Lloyd's Register, DNV, ABS, BV, etc.)",
      "Hull and machinery surveys",
      "Annual, Intermediate, Special surveys",
      "Dry dock surveys and inspections",
      "Class notations and endorsements",
      "Structural assessments and reports",
    ],
    subcategories: {
      HULL: {
        value: "hull",
        description: "Hull structure and integrity",
        examples: ["Hull Survey Report", "Classification Certificate", "Structural Assessment"],
      },
      MACHINERY: {
        value: "machinery",
        description: "Machinery and propulsion systems",
        examples: ["Machinery Survey", "Engine Survey", "Propulsion Assessment"],
      },
      SURVEY: {
        value: "survey",
        description: "Periodic surveys and inspections",
        examples: ["Annual Survey", "Special Survey", "Intermediate Survey", "Dry Dock Survey"],
      },
      NOTATION: {
        value: "notation",
        description: "Class notations and special requirements",
        examples: ["Class Notation Certificate", "Additional Class Requirements"],
      },
    },
  },

  CREW: {
    value: "crew",
    label: "Crew",
    description: "Crew-related documents including certificates, manning, and medical records",
    aiGuidance: [
      "Crew lists and manning documents",
      "Officer and crew certificates of competency",
      "STCW certificates and endorsements",
      "Medical certificates and health records",
      "Seafarer identity documents",
      "Training records and qualifications",
      "Safe manning certificates",
    ],
    subcategories: {
      CERTIFICATES: {
        value: "certificates",
        description: "Professional certificates and qualifications",
        examples: ["Certificate of Competency", "STCW Certificate", "Seafarer's Identity Document"],
      },
      MANNING: {
        value: "manning",
        description: "Manning and crew list documents",
        examples: ["Crew List", "Safe Manning Certificate", "Manning Document"],
      },
      MEDICAL: {
        value: "medical",
        description: "Medical certificates and health records",
        examples: ["Medical Certificate", "Health Declaration", "Vaccination Records"],
      },
      TRAINING: {
        value: "training",
        description: "Training records and qualifications",
        examples: ["Training Certificate", "Drill Records", "Safety Training"],
      },
    },
  },

  COMMERCIAL: {
    value: "commercial",
    label: "Commercial",
    description: "Commercial operations, cargo, and business documents",
    aiGuidance: [
      "Bills of lading and cargo documents",
      "Charter parties and commercial agreements",
      "Cargo manifests and stowage plans",
      "Commercial invoices and financial documents",
      "Insurance certificates and P&I documents",
      "Freight and demurrage documents",
      "Commercial contracts and agreements",
    ],
    subcategories: {
      CHARTER: {
        value: "charter",
        description: "Charter parties and voyage agreements",
        examples: ["Charter Party", "Voyage Charter", "Time Charter Agreement"],
      },
      CARGO: {
        value: "cargo",
        description: "Cargo documentation and manifests",
        examples: ["Bill of Lading", "Cargo Manifest", "Stowage Plan", "Dangerous Goods Declaration"],
      },
      FINANCIAL: {
        value: "financial",
        description: "Financial and commercial documents",
        examples: ["Commercial Invoice", "Freight Invoice", "Demurrage Statement"],
      },
      INSURANCE: {
        value: "insurance",
        description: "Insurance and liability documents",
        examples: ["P&I Certificate", "Hull Insurance", "Cargo Insurance Certificate"],
      },
    },
  },

  INSPECTION_REPORTS: {
    value: "inspection",
    label: "Inspection Reports",
    description: "Port state control, vetting inspections, and audit reports",
    aiGuidance: [
      "Port State Control (PSC) inspection reports",
      "Flag state inspection reports",
      "Vetting inspections (SIRE, CDI, etc.)",
      "ISM and other management system audits",
      "Third-party inspection reports",
      "Deficiency reports and corrective actions",
      "Detention reports and clearances",
    ],
    subcategories: {
      PSC: {
        value: "psc",
        description: "Port State Control inspections",
        examples: ["PSC Inspection Report", "Port State Control Deficiency", "PSC Detention Report"],
      },
      FLAG_STATE: {
        value: "flag_state",
        description: "Flag state inspections and audits",
        examples: ["Flag State Inspection", "Flag Administration Audit", "Flag State Survey"],
      },
      VETTING: {
        value: "vetting",
        description: "Commercial vetting inspections",
        examples: ["SIRE Inspection", "CDI Inspection", "Vetting Report", "Terminal Inspection"],
      },
      AUDIT: {
        value: "audit",
        description: "Management system audits",
        examples: ["ISM Audit", "ISPS Audit", "Quality Audit", "Environmental Audit"],
      },
    },
  },

  GENERAL: {
    value: "general",
    label: "General",
    description: "Documents that don't fit into specific maritime categories",
    aiGuidance: [
      "General correspondence and communications",
      "Technical manuals and procedures",
      "General reports and documentation",
      "Administrative documents",
      "Unknown or unclassifiable documents",
      "Miscellaneous maritime documents",
    ],
    subcategories: {
      CORRESPONDENCE: {
        value: "correspondence",
        description: "Letters, emails, and communications",
        examples: ["Official Correspondence", "Email Communications", "Letters"],
      },
      REPORTS: {
        value: "reports",
        description: "General reports and documentation",
        examples: ["Technical Report", "Incident Report", "General Documentation"],
      },
      MANUALS: {
        value: "manuals",
        description: "Manuals, procedures, and instructions",
        examples: ["Operation Manual", "Safety Procedures", "Technical Instructions"],
      },
      OTHER: {
        value: "other",
        description: "Other documents not fitting specific categories",
        examples: ["Miscellaneous Documents", "Unknown Document Type"],
      },
    },
  },
}

/**
 * AI-FIRST Classification Function
 * Trust the AI completely - only validate that categories are valid
 * Smart fallback for subcategories when AI can't determine them
 */
function validateAndProcessAIClassification(aiClassification, extractedMetadata = {}) {
  console.log("=== AI-FIRST DOCUMENT CLASSIFICATION ===")
  console.log("AI Classification:", aiClassification)
  console.log("Extracted Metadata:", extractedMetadata)

  // Validate that AI returned a valid primary category
  const validCategories = ["statutory", "classification", "crew", "commercial", "inspection", "general"]

  let primaryCategory = aiClassification?.primaryCategory?.toLowerCase()
  let subcategory = aiClassification?.subcategory?.toLowerCase()

  // Only validate - don't override AI intelligence
  if (!validCategories.includes(primaryCategory)) {
    console.warn(`⚠️ AI returned invalid category: ${primaryCategory}, defaulting to 'general'`)
    primaryCategory = "general"
    subcategory = "other"
  } else {
    // Primary category is valid, now handle subcategory fallback
    const categoryConfig = Object.values(DOCUMENT_CATEGORIES).find((cat) => cat.value === primaryCategory)

    if (categoryConfig) {
      const validSubcategories = Object.values(categoryConfig.subcategories).map((sub) => sub.value)

      // Check if AI provided a valid subcategory
      if (!subcategory || !validSubcategories.includes(subcategory)) {
        // Smart fallback: use the first subcategory as default
        const defaultSubcategory = Object.values(categoryConfig.subcategories)[0].value

        console.warn(
          `⚠️ AI returned invalid/missing subcategory: '${subcategory}' for '${primaryCategory}'. ` +
            `Using default: '${defaultSubcategory}'`,
        )

        subcategory = defaultSubcategory
      } else {
        console.log(`✅ Valid subcategory: '${subcategory}' for '${primaryCategory}'`)
      }
    }
  }

  const finalClassification = {
    category: primaryCategory,
    subcategory: subcategory,
    originalAiClassification: aiClassification,
    confidence: aiClassification?.confidence || "Medium",
    explanation: aiClassification?.explanation || "AI classification processed with subcategory fallback if needed",
  }

  console.log("✅ Final Classification:", finalClassification)
  return finalClassification
}

/**
 * Get category configuration for display
 */
function getCategoryInfo(categoryValue) {
  return Object.values(DOCUMENT_CATEGORIES).find((cat) => cat.value === categoryValue)
}

/**
 * Get all categories for frontend dropdowns
 */
function getAllCategories() {
  return Object.values(DOCUMENT_CATEGORIES).map((cat) => ({
    value: cat.value,
    label: cat.label,
    description: cat.description,
  }))
}

/**
 * Get subcategories for a specific category
 */
function getSubcategories(categoryValue) {
  const category = getCategoryInfo(categoryValue)
  if (!category) return []

  return Object.values(category.subcategories).map((sub) => ({
    value: sub.value,
    description: sub.description,
    examples: sub.examples || [],
  }))
}

/**
 * Generate AI guidance prompt for classification
 * This helps the AI understand our category structure
 */
function generateAIGuidancePrompt() {
  const guidance = Object.values(DOCUMENT_CATEGORIES)
    .map((category) => {
      const subcategoryInfo = Object.values(category.subcategories)
        .map((sub) => `    - ${sub.value}: ${sub.description}`)
        .join("\n")

      return `
${category.value.toUpperCase()} (${category.label}):
  Description: ${category.description}
  AI Guidance: ${category.aiGuidance.join(", ")}
  Subcategories:
${subcategoryInfo}`
    })
    .join("\n")

  return `
MARITIME DOCUMENT CLASSIFICATION GUIDANCE:

Use these EXACT categories and subcategories:
${guidance}

CLASSIFICATION RULES:
1. Always return primaryCategory as one of: statutory, classification, crew, commercial, inspection, general
2. Always include appropriate subcategory
3. Be confident in your classification - you understand maritime documents better than manual rules
4. If truly uncertain, use 'general' category with 'other' subcategory
5. Trust your maritime knowledge - don't second-guess yourself
`
}

module.exports = {
  DOCUMENT_CATEGORIES,
  validateAndProcessAIClassification,
  getCategoryInfo,
  getAllCategories,
  getSubcategories,
  generateAIGuidancePrompt,
}
