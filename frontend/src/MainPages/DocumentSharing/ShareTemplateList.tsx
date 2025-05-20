"use client"

import { useState } from "react"
import { DocumentTemplates, type DocumentTemplate } from "../../MainComponents/DocumentTemplates/DocumentTemplatesModule"

export function ShareTemplateList() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined)

  // Mock document templates data
  const documentTemplates: DocumentTemplate[] = [
    {
      id: "template-1",
      name: "Singapore Port Entry",
      description: "Standard documents required for Singapore port entry",
      documentCount: 5,
      category: "port-entry",
      createdAt: "2025-04-15T10:30:00",
      tags: ["Singapore", "Port Entry", "Standard"],
      isDefault: true,
    },
    {
      id: "template-2",
      name: "Rotterdam PSC Inspection",
      description: "Documents for Port State Control inspection in Rotterdam",
      documentCount: 8,
      category: "psc",
      vesselType: "Crude Oil Tanker",
      createdAt: "2025-04-10T14:20:00",
      tags: ["Rotterdam", "PSC", "Inspection"],
    },
    {
      id: "template-3",
      name: "Annual Class Survey",
      description: "Documents required for annual class survey",
      documentCount: 12,
      category: "class",
      createdAt: "2025-03-22T09:15:00",
      tags: ["Class", "Survey", "Annual"],
    },
    {
      id: "template-4",
      name: "SIRE Vetting",
      description: "Complete document set for SIRE vetting inspection",
      documentCount: 15,
      category: "vetting",
      vesselType: "Crude Oil Tanker",
      createdAt: "2025-03-05T11:45:00",
      tags: ["SIRE", "Vetting", "Oil Tanker"],
    },
    {
      id: "template-5",
      name: "US Coast Guard COC",
      description: "Documents for US Coast Guard Certificate of Compliance",
      documentCount: 10,
      category: "port-entry",
      createdAt: "2025-02-18T16:30:00",
      tags: ["USCG", "COC", "US Ports"],
    },
  ]

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    console.log("Selected template:", templateId)
    // In a real app, you would load the documents from this template
  }

  return (
    <DocumentTemplates
      templates={documentTemplates}
      showCreateButton={false} // Don't show create button in sharing page
      onSelectTemplate={handleSelectTemplate}
      selectedTemplateId={selectedTemplateId}
    />
  )
}
