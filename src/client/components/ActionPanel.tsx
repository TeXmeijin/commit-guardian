import React, { useState } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import type { Comment } from '@/types/git'
import type { ApproveRequest, RejectRequest } from '@/types/api'

interface ActionPanelProps {
  comments: Comment[]
  onRemoveComment: (commentId: string) => void
  defaultMessage: string
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  comments,
  onRemoveComment,
  defaultMessage,
}) => {
  const [commitMessage, setCommitMessage] = useState(defaultMessage)
  const [rejectReason, setRejectReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isApproveDisabled = !commitMessage.trim() || rejectReason.trim().length > 0 || isSubmitting
  const isRejectDisabled = !rejectReason.trim() || isSubmitting

  const handleApprove = async () => {
    if (isApproveDisabled) return

    setIsSubmitting(true)
    try {
      const request: ApproveRequest = {
        message: commitMessage.trim(),
        fileComments: comments,
      }

      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      const result = await response.json()
      
      if (result.success) {
        if (result.autoClose) {
          document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-github-canvas-default">
              <div class="text-center">
                <div class="text-2xl text-github-success-fg mb-4">✅ Changes committed successfully!</div>
                <div class="text-github-fg-muted">Closing...</div>
              </div>
            </div>
          `
          setTimeout(() => window.close(), 2000)
        } else {
          alert('Changes approved and committed successfully!')
        }
      } else {
        alert('Error: ' + (result.error || 'Unknown error occurred'))
      }
    } catch (error) {
      alert('Error approving changes: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (isRejectDisabled) return

    if (!confirm('Are you sure you want to reject these changes?')) {
      return
    }

    setIsSubmitting(true)
    try {
      const request: RejectRequest = {
        rejectReason: rejectReason.trim(),
        fileComments: comments,
      }

      const response = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      const result = await response.json()
      
      if (result.success) {
        document.body.innerHTML = `
          <div class="min-h-screen flex items-center justify-center bg-github-canvas-default">
            <div class="text-center">
              <div class="text-2xl text-github-danger-fg mb-4">❌ Changes rejected</div>
              ${comments.length > 0 ? `<div class="text-github-fg-muted mb-2">Your ${comments.length} comment(s) have been formatted for LLM analysis.</div>` : ''}
              <div class="text-github-fg-muted">Closing...</div>
            </div>
          </div>
        `
        setTimeout(() => window.close(), 2000)
      } else {
        alert('Error rejecting changes: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Error rejecting changes: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clear reject reason when commit message is focused
  const handleCommitMessageFocus = () => {
    if (rejectReason.trim()) {
      setRejectReason('')
    }
  }

  return (
    <div className="action-panel">
      <div className="action-content">
        {/* Commit Message */}
        <div className="action-field">
          <label>Commit Message:</label>
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            onFocus={handleCommitMessageFocus}
            placeholder="Enter your commit message..."
            className="input-field"
            required
          />
        </div>

        {/* Reject Reason */}
        <div className="action-field">
          <label>Reject Reason:</label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="input-field"
          />
        </div>

        {/* Comments Summary */}
        {comments.length > 0 && (
          <div className="text-muted" style={{ fontSize: '11px', padding: '8px 0' }}>
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={handleApprove}
            disabled={isApproveDisabled}
            className="btn btn-primary"
          >
            <Check size={16} />
            <span>Approve</span>
          </button>
          
          <button
            onClick={handleReject}
            disabled={isRejectDisabled}
            className="btn btn-danger"
          >
            <X size={16} />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div style={{ marginTop: '12px', maxHeight: '120px', overflowY: 'auto' }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'start',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '8px',
                marginBottom: '4px',
                fontSize: '11px'
              }}
            >
              <div>
                <div className="text-muted">{comment.file}:{comment.line}</div>
                <div style={{ marginTop: '2px', color: '#e6edf3' }}>{comment.text}</div>
              </div>
              <button
                onClick={() => onRemoveComment(comment.id)}
                style={{ 
                  marginLeft: '8px',
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                title="Remove comment"
              >
                <Trash2 size={12} style={{ color: '#f85149' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionPanel