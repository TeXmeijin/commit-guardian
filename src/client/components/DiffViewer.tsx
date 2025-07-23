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
    <div>
      {/* Staged Changes */}
      {diffData.staged && (
        <div className="diff-container">
          <div
            className="diff-header"
            onClick={() => toggleSection('staged')}
          >
            <span>{collapsedSections.staged ? '▶' : '▼'}</span>
            <span>Staged Changes</span>
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
        <div className="diff-container">
          <div
            className="diff-header"
            onClick={() => toggleSection('unstaged')}
          >
            <span>{collapsedSections.unstaged ? '▶' : '▼'}</span>
            <span>Unstaged Changes</span>
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