"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X, Tag, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Common tags for port notes
const COMMON_TAGS = [
  "inspection",
  "agent",
  "ballast water",
  "MARPOL",
  "contact",
  "reporting",
  "pilot",
  "berth",
  "safety",
  "crew",
  "documentation",
  "customs",
]

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (noteData: PortNoteData) => void
  portName?: string
  vesselName?: string
  userName?: string
  userRole?: string
  initialData?: PortNoteData
}

export interface PortNoteData {
  id?: string
  title: string
  content: string
  date: Date
  author: string
  authorRole: string
  portName: string
  vesselName: string
  tags: string[]
  importance: "normal" | "high" | "critical"
}

export function AddNoteModal({
  isOpen,
  onClose,
  onSave,
  portName = "Singapore",
  vesselName = "Humble Warrior",
  userName = "Capt. John Doe",
  userRole = "Master",
  initialData,
}: AddNoteModalProps) {
  const [noteData, setNoteData] = useState<PortNoteData>({
    title: "",
    content: "",
    date: new Date(),
    author: userName,
    authorRole: userRole,
    portName: portName,
    vesselName: vesselName,
    tags: [],
    importance: "normal",
  })

  const [customTag, setCustomTag] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPreview, setIsPreview] = useState(false)

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNoteData(initialData)
      } else {
        setNoteData({
          title: "",
          content: "",
          date: new Date(),
          author: userName,
          authorRole: userRole,
          portName: portName,
          vesselName: vesselName,
          tags: [],
          importance: "normal",
        })
      }
      setIsPreview(false)
      setErrors({})
    }
  }, [isOpen, portName, vesselName, userName, userRole, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNoteData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNoteData((prev) => ({ ...prev, date }))
    }
  }

  const handleImportanceChange = (importance: "normal" | "high" | "critical") => {
    setNoteData((prev) => ({ ...prev, importance }))
  }

  // FIX: Modified tag adding function
  const addTag = (tag: string) => {
    if (tag && !noteData.tags.includes(tag)) {
      setNoteData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  // FIX: Modified tag removal function to ensure it always works with a proper stop propagation
  const handleRemoveTag = (e: React.MouseEvent, tagToRemove: string) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    setNoteData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim().toLowerCase())
      setCustomTag("")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!noteData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!noteData.content.trim()) {
      newErrors.content = "Note content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(noteData)
      onClose()
    }
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isPreview ? "Preview Note" : "Add Port Note"}</DialogTitle>
          <DialogDescription>
            {isPreview
              ? "Preview how your note will appear to the team"
              : "Share important information about this port with your team"}
          </DialogDescription>
        </DialogHeader>

        {isPreview ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{noteData.title || "Untitled Note"}</h4>
                <div className="flex items-center">
                  <Badge
                    className={cn(
                      noteData.importance === "critical"
                        ? "bg-red-100 text-red-800"
                        : noteData.importance === "high"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800",
                    )}
                  >
                    {noteData.importance.charAt(0).toUpperCase() + noteData.importance.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    {noteData.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-500">
                  {noteData.author} ({noteData.authorRole}) • {format(noteData.date, "MMM d, yyyy")}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{noteData.content}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {noteData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-700">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Port: {noteData.portName} • Vessel: {noteData.vesselName}
              </div>
            </div>

            <Button onClick={togglePreview} variant="outline" className="w-full">
              Back to Edit
            </Button>
          </div>
        ) : (
          <>
            {/* FIX: Improved grid layout to prevent UI breaking when switching importance */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    name="title"
                    value={noteData.title}
                    onChange={handleChange}
                    placeholder="Brief title for your note"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
              </div>

              {/* FIX: Modified importance section to maintain layout */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="importance" className="text-right">
                  Importance
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={noteData.importance === "normal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleImportanceChange("normal")}
                    >
                      Normal
                    </Button>
                    <Button
                      type="button"
                      variant={noteData.importance === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleImportanceChange("high")}
                      className={noteData.importance === "high" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      High
                    </Button>
                    <Button
                      type="button"
                      variant={noteData.importance === "critical" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleImportanceChange("critical")}
                      className={noteData.importance === "critical" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      Critical
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Note
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="content"
                    name="content"
                    value={noteData.content}
                    onChange={handleChange}
                    placeholder="Share important information about this port..."
                    className={cn("min-h-[120px]", errors.content ? "border-red-500" : "")}
                  />
                  {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {noteData.date ? format(noteData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={noteData.date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Tags</Label>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* FIX: Modified tag display to ensure X works */}
                    {noteData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        <span>{tag}</span>
                        {/* FIX: Added a more explicit click handler */}
                        <div
                          className="flex items-center cursor-pointer ml-1"
                          onClick={(e) => handleRemoveTag(e, tag)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCustomTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Common tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {COMMON_TAGS.filter((tag) => !noteData.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer bg-gray-50 hover:bg-gray-100"
                            onClick={() => addTag(tag)}
                          >
                            + {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Context</Label>
                <div className="col-span-3">
                  <div className="text-sm text-gray-500">
                    <p>Port: {noteData.portName}</p>
                    <p>Vessel: {noteData.vesselName}</p>
                  </div>
                </div>
              </div>

              {/* FIX: Changed col-span-4 to col-span-full to properly span the entire grid */}
              {noteData.importance === "critical" && (
                <div className="col-span-full mt-2">
                  <Alert className="bg-red-50 text-red-800 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This note will be marked as critical and will be highlighted for all users.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {noteData.content.length > 0 && noteData.title.length > 0 && (
                <div className="col-span-full mt-2">
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Your note looks good! Click Preview to see how it will appear.</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between mt-4">
              <Button variant="outline" onClick={togglePreview} disabled={!noteData.title || !noteData.content}>
                Preview
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Note</Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
