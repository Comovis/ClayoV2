"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, Plus, Calendar, MoreHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type DocumentTemplate = {
  id: string
  name: string
  description: string
  documentCount: number
  category: string
  vesselType?: string
  lastUsed?: string
  createdBy?: string
  createdAt: string
  isDefault?: boolean
  tags: string[]
}

export type DocumentTemplatesProps = {
  templates: DocumentTemplate[]
  showCreateButton?: boolean
  onSelectTemplate?: (templateId: string) => void
  onCreateTemplate?: (template: Omit<DocumentTemplate, "id" | "createdAt">) => void
  onEditTemplate?: (template: DocumentTemplate) => void
  onDeleteTemplate?: (templateId: string) => void
  onDuplicateTemplate?: (templateId: string) => void
  selectedTemplateId?: string
  documents?: any[] // The available documents to select from when creating a template
  vesselTypes?: string[]
}

export function DocumentTemplates({
  templates,
  showCreateButton = true,
  onSelectTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  selectedTemplateId,
  documents = [],
  vesselTypes = [],
}: DocumentTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null)

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "port-entry",
    vesselType: "",
    isDefault: false,
    tags: [],
    selectedDocuments: [],
  })

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || template.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Templates" },
    { id: "port-entry", name: "Port Entry" },
    { id: "vetting", name: "Vetting" },
    { id: "class", name: "Classification" },
    { id: "psc", name: "Port State Control" },
    { id: "custom", name: "Custom" },
  ]

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (onCreateTemplate) {
      onCreateTemplate({
        name: newTemplate.name,
        description: newTemplate.description,
        documentCount: newTemplate.selectedDocuments.length,
        category: newTemplate.category,
        vesselType: newTemplate.vesselType,
        isDefault: newTemplate.isDefault,
        tags: newTemplate.tags,
      })
    }

    // Reset form and close dialog
    setNewTemplate({
      name: "",
      description: "",
      category: "port-entry",
      vesselType: "",
      isDefault: false,
      tags: [],
      selectedDocuments: [],
    })
    setCreateDialogOpen(false)
  }

  // Handle editing a template
  const handleEditTemplate = () => {
    if (editingTemplate && onEditTemplate) {
      onEditTemplate(editingTemplate)
    }
    setEditingTemplate(null)
  }

  // Toggle document selection for template creation
  const toggleDocumentSelection = (docId: string) => {
    if (newTemplate.selectedDocuments.includes(docId)) {
      setNewTemplate({
        ...newTemplate,
        selectedDocuments: newTemplate.selectedDocuments.filter((id) => id !== docId),
      })
    } else {
      setNewTemplate({
        ...newTemplate,
        selectedDocuments: [...newTemplate.selectedDocuments, docId],
      })
    }
  }

  // Add a tag to the template
  const addTag = (tag: string) => {
    if (tag && !newTemplate.tags.includes(tag)) {
      setNewTemplate({
        ...newTemplate,
        tags: [...newTemplate.tags, tag],
      })
    }
  }

  // Remove a tag from the template
  const removeTag = (tag: string) => {
    setNewTemplate({
      ...newTemplate,
      tags: newTemplate.tags.filter((t) => t !== tag),
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {/* Only show this if not being rendered from parent with showCreateButton=false */}
      {showCreateButton && (
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create Document Template</DialogTitle>
                <DialogDescription>Create a reusable template for document sharing</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Singapore Port Entry Documents"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Input
                      id="template-description"
                      placeholder="e.g., Standard documents required for Singapore port entry"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                      >
                        <SelectTrigger id="template-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="port-entry">Port Entry</SelectItem>
                          <SelectItem value="vetting">Vetting</SelectItem>
                          <SelectItem value="class">Classification</SelectItem>
                          <SelectItem value="psc">Port State Control</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-vessel-type">Vessel Type (Optional)</Label>
                      <Select
                        value={newTemplate.vesselType}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, vesselType: value })}
                      >
                        <SelectTrigger id="template-vessel-type">
                          <SelectValue placeholder="All vessel types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All vessel types</SelectItem>
                          {vesselTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="template-tag"
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = document.getElementById("template-tag") as HTMLInputElement
                          addTag(input.value)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="template-default"
                      checked={newTemplate.isDefault}
                      onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isDefault: checked as boolean })}
                    />
                    <Label htmlFor="template-default">Set as default template for this category</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Documents</Label>
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search documents..." className="pl-8" />
                    </div>

                    <Card className="border">
                      <ScrollArea className="h-[300px]">
                        <CardContent className="p-3">
                          <div className="space-y-1">
                            {documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between py-2 border-b">
                                <div className="flex items-center">
                                  <Checkbox
                                    id={`doc-${doc.id}`}
                                    checked={newTemplate.selectedDocuments.includes(doc.id)}
                                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                                  />
                                  <div className="ml-2">
                                    <Label htmlFor={`doc-${doc.id}`} className="cursor-pointer">
                                      {doc.name}
                                    </Label>
                                    <p className="text-xs text-gray-500">{doc.category}</p>
                                  </div>
                                </div>
                                <Badge variant="outline">{doc.status}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </ScrollArea>
                    </Card>

                    <div className="text-sm text-gray-500">
                      {newTemplate.selectedDocuments.length} documents selected
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name || newTemplate.selectedDocuments.length === 0}
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full bg-white">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-1">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                    selectedTemplateId === template.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onSelectTemplate && onSelectTemplate(template.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">{template.name}</h3>
                        <p className="text-gray-500">{template.description}</p>
                      </div>

                      {showCreateButton && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingTemplate(template)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDuplicateTemplate && onDuplicateTemplate(template.id)
                              }}
                            >
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteTemplate && onDeleteTemplate(template.id)
                              }}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-500">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{template.documentCount} documents</span>
                      </div>

                      {template.lastUsed && (
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Last used: {formatDate(template.lastUsed)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      {template.category && (
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-0">
                          {template.category === "port-entry"
                            ? "Port Entry"
                            : template.category === "vetting"
                              ? "Vetting"
                              : template.category === "class"
                                ? "Classification"
                                : template.category === "psc"
                                  ? "Port State Control"
                                  : "Custom"}
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">Use Template</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No templates found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery ? "Try a different search term" : "Create your first template to get started"}
                </p>
                {showCreateButton && (
                  <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
              <DialogDescription>Update your document template</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Description</Label>
                <Input
                  id="edit-template-description"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-category">Category</Label>
                <Select
                  value={editingTemplate.category}
                  onValueChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                >
                  <SelectTrigger id="edit-template-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="port-entry">Port Entry</SelectItem>
                    <SelectItem value="vetting">Vetting</SelectItem>
                    <SelectItem value="class">Classification</SelectItem>
                    <SelectItem value="psc">Port State Control</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditTemplate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
