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
        <div key={lineIndex} style={{ 
          background: '#21262d', 
          borderBottom: '1px solid #30363d', 
          padding: '8px 12px',
          fontWeight: '500',
          fontSize: '12px'
        }}>
          {content}
        </div>
      )
    }

    if (type === 'header') {
      return (
        <div key={lineIndex} className="diff-line-header" style={{ padding: '2px 8px' }}>
          {content}
        </div>
      )
    }

    const lineComments = file ? getLineComments(file, displayLineNumber) : []
    const canComment = type !== 'context' && file

    return (
      <React.Fragment key={lineIndex}>
        <div
          className={`diff-line ${
            type === 'add' ? 'diff-line-add' :
            type === 'del' ? 'diff-line-del' : ''
          }`}
        >
          <div className="diff-line-number">
            {displayLineNumber > 0 ? displayLineNumber : ''}
          </div>
          
          <div className="diff-line-content" style={{ position: 'relative' }}>
            {content}
            
            {canComment && (
              <button
                onClick={() => handleAddComment(file, displayLineNumber)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#238636',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
                className="comment-btn"
                title="Add comment"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              >
                <MessageSquarePlus size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Render existing comments */}
        {lineComments.map(comment => (
          <div key={comment.id} style={{
            background: '#161b22',
            borderLeft: '2px solid #238636',
            padding: '8px 16px',
            fontSize: '11px'
          }}>
            <div className="text-muted" style={{ marginBottom: '4px' }}>
              {file}:{displayLineNumber}
            </div>
            <div>{comment.text}</div>
          </div>
        ))}

        {/* Render active comment form */}
        {activeCommentLine === displayLineNumber && activeFile === file && (
          <div style={{
            background: '#161b22',
            borderLeft: '2px solid #238636',
            padding: '12px 16px'
          }}>
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
    <div className="diff-content">
      {lines.map(renderLine)}
    </div>
  )
}

export default DiffContent