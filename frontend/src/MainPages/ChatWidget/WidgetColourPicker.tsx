"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

const presetColors = [
  "#4f46e5", // Indigo
  "#2563eb", // Blue
  "#0891b2", // Cyan
  "#059669", // Emerald
  "#16a34a", // Green
  "#ca8a04", // Yellow
  "#ea580c", // Orange
  "#dc2626", // Red
  "#db2777", // Pink
  "#7c3aed", // Violet
  "#6d28d9", // Purple
  "#000000", // Black
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color)

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value)
  }

  const handleColorChangeComplete = () => {
    onChange(currentColor)
  }

  const handlePresetClick = (preset: string) => {
    setCurrentColor(preset)
    onChange(preset)
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[120px] justify-start border-2 px-3"
            style={{ borderColor: currentColor }}
          >
            <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: currentColor }} />
            {currentColor}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full" style={{ backgroundColor: currentColor }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={currentColor}
                  onChange={handleColorChange}
                  onBlur={handleColorChangeComplete}
                  className="h-8 w-8 cursor-pointer p-0"
                />
                <Input
                  value={currentColor}
                  onChange={handleColorChange}
                  onBlur={handleColorChangeComplete}
                  className="h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  style={{ backgroundColor: preset }}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset === currentColor && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={currentColor}
        onChange={handleColorChange}
        onBlur={handleColorChangeComplete}
        className="w-[120px]"
      />
    </div>
  )
}
