import React from 'react'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-github-border-default border-t-github-success-fg"></div>
      <div className="text-github-fg-muted">Loading changes...</div>
    </div>
  )
}