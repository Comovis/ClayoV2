#!/bin/bash

# List of components to install (based on your JSX files)
components=(
  "avatar"
  "badge"
  "breadcrumb"
  "card"
  "carousel"
  "checkbox"
  "command"
  "dialog"
  "dropdown-menu"
  "input"
  "label"
  "navigation-menu"
  "pagination"
  "progress"
  "radio-group"
  "scroll-area"
  "select"
  "separator"
  "slider"
  "switch"
  "table"
  "tabs"
  "textarea"
  "toast"
  "toaster"
  "tooltip"
)

# Install each component
for component in "${components[@]}"; do
  echo "Installing $component..."
  npx shadcn@latest add $component --overwrite
  
  # Add a small delay to prevent rate limiting or other issues
  sleep 1
done

echo "All components installed successfully!"