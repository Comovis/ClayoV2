"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Plus, Search, Filter, Tag, MessageSquare, ThumbsUp, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { PortNoteData } from "./add-note-modal"
import { format } from "date-fns"

interface PortNotesListProps {
  notes: PortNoteData[]
  onAddNote: () => void
  onViewNote: (note: PortNoteData) => void
}

export function PortNotesList({ notes, onAddNote, onViewNote }: PortNotesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort()

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Filter notes based on search query and selected tags
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => note.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Port Knowledge Base</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notes..."
              className="pl-8 h-9 w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={onAddNote}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">Filter by tag:</span>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedTags.includes(tag) ? "" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery || selectedTags.length > 0 ? (
            <div>
              <p className="mb-2">No notes match your search criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTags([])
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-2">No notes have been added yet</p>
              <Button onClick={onAddNote}>Add Your First Note</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <PortNoteItem key={note.id || note.title} note={note} onView={() => onViewNote(note)} />
          ))}
        </div>
      )}
    </div>
  )
}

interface PortNoteItemProps {
  note: PortNoteData
  onView: () => void
}

function PortNoteItem({ note, onView }: PortNoteItemProps) {
  // Truncate content if it's too long
  const truncatedContent = note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content

  return (
    <div
      className={`p-4 border rounded-md ${
        note.importance === "critical"
          ? "border-l-4 border-l-red-500"
          : note.importance === "high"
            ? "border-l-4 border-l-amber-500"
            : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium flex items-center">
          {note.importance === "critical" && <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5" />}
          {note.title}
        </h4>
        <div className="text-xs text-gray-500">{format(new Date(note.date), "MMM d, yyyy")}</div>
      </div>

      <div className="flex items-center mb-3">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback>
            {note.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-gray-500">
          {note.author} ({note.authorRole})
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{truncatedContent}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {note.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-700">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">Port: {note.portName}</div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500">
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Helpful</span>
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500" onClick={onView}>
            <Eye className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">View</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
