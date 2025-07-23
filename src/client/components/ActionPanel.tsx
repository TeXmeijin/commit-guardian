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
        let message = 'Changes rejected'
        if (comments.length > 0) {
          message += `\n\nYour ${comments.length} comment(s) have been formatted for LLM analysis.`
        }
        alert(message)
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
    <div className="fixed bottom-0 left-0 right-0 bg-github-canvas-subtle border-t border-github-border-default shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-end space-x-4">
          {/* Commit Message */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-github-fg-muted mb-1">
              Commit Message:
            </label>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              onFocus={handleCommitMessageFocus}
              placeholder="Enter your commit message..."
              className="input-field w-full h-9 resize-none"
              required
            />
          </div>

          {/* Reject Reason */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-github-fg-muted mb-1">
              Reject Reason:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="input-field w-full h-9 resize-none"
            />
          </div>

          {/* Comments Summary */}
          {comments.length > 0 && (
            <div className="flex-shrink-0 text-xs text-github-fg-muted">
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={handleApprove}
              disabled={isApproveDisabled}
              className="btn btn-primary h-9 flex items-center space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Approve</span>
            </button>
            
            <button
              onClick={handleReject}
              disabled={isRejectDisabled}
              className="btn btn-danger h-9 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Reject</span>
            </button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between bg-github-canvas-default border border-github-border-default rounded p-2 text-xs"
              >
                <div className="flex-1">
                  <div className="text-github-fg-muted">
                    {comment.file}:{comment.line}
                  </div>
                  <div className="text-github-fg-default mt-1">{comment.text}</div>
                </div>
                <button
                  onClick={() => onRemoveComment(comment.id)}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-github-danger-subtle rounded transition-colors"
                  title="Remove comment"
                >
                  <Trash2 className="h-3 w-3 text-github-danger-fg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActionPanel