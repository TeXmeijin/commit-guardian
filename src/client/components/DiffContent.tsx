import React, { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import type { Comment } from '@/types/git'
import CommentForm from './CommentForm'

interface DiffContentProps {
  diffText: string
  type: 'staged' | 'unstaged'
  comments: Comment[]
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void
}

interface ParsedDiffLine {
  type: 'add' | 'del' | 'context' | 'header' | 'file'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
  lineIndex: number
  file?: string
}

const DiffContent: React.FC<DiffContentProps> = ({
  diffText,
  type,
  comments,
  onAddComment,
}) => {
  const [activeCommentLine, setActiveCommentLine] = useState<number | null>(null)
  const [activeFile, setActiveFile] = useState<string>('')

  const parseDiff = (text: string): ParsedDiffLine[] => {
    const lines = text.split('\n')
    const parsed: ParsedDiffLine[] = []
    let currentFile = ''
    let oldLineNum = 0
    let newLineNum = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('diff --git')) {
        const match = line.match(/diff --git a\/(.*?) b\/(.*)/)
        if (match) {
          currentFile = match[2]
          parsed.push({
            type: 'file',
            content: currentFile,
            lineIndex: i,
            file: currentFile,
          })
        }
        continue
      }

      if (line.startsWith('@@')) {
        const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/)
        if (match) {
          oldLineNum = parseInt(match[1]) - 1
          newLineNum = parseInt(match[2]) - 1
          parsed.push({
            type: 'header',
            content: line,
            lineIndex: i,
            file: currentFile,
          })
        }
        continue
      }

      if (line.startsWith('index ') || line.startsWith('+++') || line.startsWith('---')) {
        continue
      }

      let lineType: 'add' | 'del' | 'context' = 'context'
      let displayOldNum: number | undefined
      let displayNewNum: number | undefined
      let lineContent = line

      if (line.startsWith('+')) {
        lineType = 'add'
        newLineNum++
        displayNewNum = newLineNum
        lineContent = line.substring(1)
      } else if (line.startsWith('-')) {
        lineType = 'del'
        oldLineNum++
        displayOldNum = oldLineNum
        lineContent = line.substring(1)
      } else if (line.length > 0) {
        oldLineNum++
        newLineNum++
        displayOldNum = oldLineNum
        displayNewNum = newLineNum
        lineContent = line.substring(1)
      }

      parsed.push({
        type: lineType,
        content: lineContent,
        oldLineNumber: displayOldNum,
        newLineNumber: displayNewNum,
        lineIndex: i,
        file: currentFile,
      })
    }

    return parsed
  }

  const lines = parseDiff(diffText)

  const getLineComments = (file: string, lineNumber: number) => {
    return comments.filter(c => c.file === file && c.line === lineNumber)
  }

  const handleAddComment = (file: string, lineNumber: number) => {
    setActiveCommentLine(lineNumber)
    setActiveFile(file)
  }

  const handleSubmitComment = (text: string) => {
    if (activeFile && activeCommentLine !== null) {
      onAddComment({
        file: activeFile,
        line: activeCommentLine,
        text,
      })
      setActiveCommentLine(null)
      setActiveFile('')
    }
  }

  const handleCancelComment = () => {
    setActiveCommentLine(null)
    setActiveFile('')
  }

  const renderLine = (parsedLine: ParsedDiffLine) => {
    const { type, content, oldLineNumber, newLineNumber, lineIndex, file } = parsedLine
    const displayLineNumber = newLineNumber || oldLineNumber || 0
    
    if (type === 'file') {
      return (
        <div key={lineIndex} className="bg-github-canvas-subtle border-b border-github-border-default p-2">
          <div className="font-medium text-github-fg-default text-sm">{content}</div>
        </div>
      )
    }

    if (type === 'header') {
      return (
        <div key={lineIndex} className="bg-github-border-muted text-github-fg-muted px-2 py-1 text-xs font-mono">
          {content}
        </div>
      )
    }

    const lineComments = file ? getLineComments(file, displayLineNumber) : []
    const canComment = type !== 'context' && file

    return (
      <React.Fragment key={lineIndex}>
        <div
          className={`flex group hover:bg-github-border-muted/30 ${
            type === 'add' ? 'bg-github-diff-addition-bg/20' :
            type === 'del' ? 'bg-github-diff-deletion-bg/20' : ''
          }`}
        >
          <div className="flex-shrink-0 w-16 px-2 py-1 text-xs text-github-fg-subtle font-mono text-right bg-github-canvas-subtle border-r border-github-border-default">
            {displayLineNumber > 0 ? displayLineNumber : ''}
          </div>
          
          <div className="flex-1 px-2 py-1 text-sm font-mono relative">
            <span className={`${
              type === 'add' ? 'text-github-diff-addition-fg' :
              type === 'del' ? 'text-github-diff-deletion-fg' :
              'text-github-fg-default'
            }`}>
              {content}
            </span>
            
            {canComment && (
              <button
                onClick={() => handleAddComment(file, displayLineNumber)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-github-success-subtle transition-all"
                title="Add comment"
              >
                <MessageSquarePlus className="h-3 w-3 text-github-success-fg" />
              </button>
            )}
          </div>
        </div>

        {/* Render existing comments */}
        {lineComments.map(comment => (
          <div key={comment.id} className="bg-github-canvas-subtle border-l-2 border-github-success-subtle px-4 py-2">
            <div className="text-xs text-github-fg-muted mb-1">
              {file}:{displayLineNumber}
            </div>
            <div className="text-sm text-github-fg-default">{comment.text}</div>
          </div>
        ))}

        {/* Render active comment form */}
        {activeCommentLine === displayLineNumber && activeFile === file && (
          <div className="bg-github-canvas-subtle border-l-2 border-github-success-subtle px-4 py-3">
            <CommentForm
              onSubmit={handleSubmitComment}
              onCancel={handleCancelComment}
            />
          </div>
        )}
      </React.Fragment>
    )
  }

  return (
    <div className="bg-github-canvas-default">
      {lines.map(renderLine)}
    </div>
  )
}

export default DiffContent