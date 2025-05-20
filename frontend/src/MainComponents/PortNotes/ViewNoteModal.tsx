"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Tag, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { PortNoteData } from "./add-note-modal"

interface ViewNoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: PortNoteData | null
  onEdit: () => void
  onDelete: () => void
}

export function ViewNoteModal({ isOpen, onClose, note, onEdit, onDelete }: ViewNoteModalProps) {
  if (!note) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {note.importance === "critical" && <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
            {note.title}
          </DialogTitle>
          <DialogDescription>
            Added by {note.author} on {format(new Date(note.date), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarFallback>
                {note.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{note.author}</p>
              <p className="text-sm text-gray-500">{note.authorRole}</p>
            </div>
            <Badge
              className={`ml-auto ${
                note.importance === "critical"
                  ? "bg-red-100 text-red-800"
                  : note.importance === "high"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {note.importance.charAt(0).toUpperCase() + note.importance.slice(1)}
            </Badge>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-line">{note.content}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-700">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {note.tags.length === 0 && <span className="text-sm text-gray-500">No tags</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Port:</p>
              <p>{note.portName}</p>
            </div>
            <div>
              <p className="text-gray-500">Vessel:</p>
              <p>{note.vesselName}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onDelete}
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
