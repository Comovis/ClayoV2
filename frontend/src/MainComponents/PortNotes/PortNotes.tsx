"use client"

import { useState, useEffect } from "react"
import { AddNoteModal, type PortNoteData } from "./AddNoteModal"
import { PortNotesList } from "./PortNotesList"
import { ViewNoteModal } from "./ViewNoteModal"
import { v4 as uuidv4 } from "uuid"

// Sample initial notes data
const INITIAL_NOTES: PortNoteData[] = [
  {
    id: "1",
    title: "Previous Inspection Focus",
    content:
      "During our last port call, inspectors focused heavily on oil record book entries and MARPOL compliance. They specifically checked the calibration records for oil filtering equipment.",
    date: new Date("2023-03-10"),
    author: "Capt. John Doe",
    authorRole: "Master",
    portName: "Singapore",
    vesselName: "Humble Warrior",
    tags: ["inspection", "MARPOL", "oil record"],
    importance: "normal",
  },
  {
    id: "2",
    title: "Agent Contact Information",
    content:
      "Our agent Mr. Lee Kuan (+65 9123 4567, lee.kuan@sgmaritime.com) was very helpful with document submissions. He prefers to be contacted via WhatsApp for urgent matters.",
    date: new Date("2023-03-08"),
    author: "Sarah Chen",
    authorRole: "Operations Manager",
    portName: "Singapore",
    vesselName: "Humble Warrior",
    tags: ["agent", "contact"],
    importance: "normal",
  },
  {
    id: "3",
    title: "Ballast Water Reporting Tips",
    content:
      "Singapore MPA is very strict about ballast water reporting. Make sure to include all ballast water operations from the last 3 ports, not just the most recent one.",
    date: new Date("2023-03-05"),
    author: "Michael Chen",
    authorRole: "Chief Officer",
    portName: "Singapore",
    vesselName: "Humble Warrior",
    tags: ["ballast water", "reporting"],
    importance: "high",
  },
  {
    id: "4",
    title: "CRITICAL: New Sulfur Emissions Regulation",
    content:
      "Singapore has implemented a new sulfur emissions regulation effective immediately. All vessels must use fuel with sulfur content not exceeding 0.1% while in port. Inspectors are conducting spot checks and issuing heavy fines for non-compliance.\n\nOur vessel needs to switch to compliant fuel at least 12 hours before arrival. Coordinate with Chief Engineer to ensure timely fuel changeover.",
    date: new Date("2023-10-15"),
    author: "Capt. John Doe",
    authorRole: "Master",
    portName: "Singapore",
    vesselName: "Humble Warrior",
    tags: ["emissions", "regulation", "fuel", "compliance"],
    importance: "critical",
  },
]

interface PortNotesTabProps {
  portName?: string
  vesselName?: string
  userName?: string
  userRole?: string
}

export function PortNotesTab({
  portName = "Singapore",
  vesselName = "Humble Warrior",
  userName = "Capt. John Doe",
  userRole = "Master",
}: PortNotesTabProps) {
  const [notes, setNotes] = useState<PortNoteData[]>(INITIAL_NOTES)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<PortNoteData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`port-notes-${portName}`)
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        // Convert string dates back to Date objects
        const processedNotes = parsedNotes.map((note: any) => ({
          ...note,
          date: new Date(note.date),
        }))
        setNotes(processedNotes)
      } catch (error) {
        console.error("Error parsing saved notes:", error)
      }
    }
  }, [portName])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`port-notes-${portName}`, JSON.stringify(notes))
  }, [notes, portName])

  const handleAddNote = () => {
    setIsEditMode(false)
    setSelectedNote(null)
    setIsAddModalOpen(true)
  }

  const handleViewNote = (note: PortNoteData) => {
    setSelectedNote(note)
    setIsViewModalOpen(true)
  }

  const handleEditNote = () => {
    setIsViewModalOpen(false)
    setIsEditMode(true)
    setIsAddModalOpen(true)
  }

  const handleDeleteNote = () => {
    if (selectedNote?.id) {
      setNotes(notes.filter((note) => note.id !== selectedNote.id))
      setIsViewModalOpen(false)
      // You would add a toast notification here in a real app
      console.log("Note deleted:", selectedNote.title)
    }
  }

  const handleSaveNote = (noteData: PortNoteData) => {
    if (isEditMode && selectedNote?.id) {
      // Update existing note
      setNotes(notes.map((note) => (note.id === selectedNote.id ? { ...noteData, id: note.id } : note)))
      console.log("Note updated:", noteData.title)
    } else {
      // Add new note
      const newNote = {
        ...noteData,
        id: uuidv4(),
      }
      setNotes([newNote, ...notes])
      console.log("Note added:", newNote.title)
    }
    setIsAddModalOpen(false)
  }

  return (
    <div>
      <PortNotesList notes={notes} onAddNote={handleAddNote} onViewNote={handleViewNote} />

      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNote}
        portName={portName}
        vesselName={vesselName}
        userName={userName}
        userRole={userRole}
        initialData={isEditMode ? selectedNote : undefined}
      />

      <ViewNoteModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        note={selectedNote}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}
