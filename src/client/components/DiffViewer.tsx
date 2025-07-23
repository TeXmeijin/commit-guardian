import React, { useState } from 'react'
import type { GitDiffData, Comment } from '@/types/git'
import FileTree from './FileTree'
import DiffContent from './DiffContent'

interface DiffViewerProps {
  diffData: GitDiffData
  comments: Comment[]
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  diffData,
  comments,
  onAddComment,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    unstaged: true, // Collapse unstaged by default
  })

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Staged Changes */}
      {diffData.staged && (
        <div className="border border-github-border-default rounded-md bg-github-canvas-subtle">
          <div
            className="flex items-center justify-between p-3 bg-github-canvas-subtle border-b border-github-border-default cursor-pointer hover:bg-github-border-muted/50"
            onClick={() => toggleSection('staged')}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {collapsedSections.staged ? '▶' : '▼'}
              </span>
              <h3 className="font-medium text-github-fg-default">Staged Changes</h3>
            </div>
          </div>
          
          {!collapsedSections.staged && (
            <DiffContent
              diffText={diffData.staged}
              type="staged"
              comments={comments}
              onAddComment={onAddComment}
            />
          )}
        </div>
      )}

      {/* Unstaged Changes */}
      {diffData.unstaged && (
        <div className="border border-github-border-default rounded-md bg-github-canvas-subtle">
          <div
            className="flex items-center justify-between p-3 bg-github-canvas-subtle border-b border-github-border-default cursor-pointer hover:bg-github-border-muted/50"
            onClick={() => toggleSection('unstaged')}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {collapsedSections.unstaged ? '▶' : '▼'}
              </span>
              <h3 className="font-medium text-github-fg-default">Unstaged Changes</h3>
            </div>
          </div>
          
          {!collapsedSections.unstaged && (
            <DiffContent
              diffText={diffData.unstaged}
              type="unstaged"
              comments={comments}
              onAddComment={onAddComment}
            />
          )}
        </div>
      )}

      {/* File Tree (if we have parsed files) */}
      {diffData.files.length > 0 && (
        <FileTree files={diffData.files} />
      )}
    </div>
  )
}

export default DiffViewer