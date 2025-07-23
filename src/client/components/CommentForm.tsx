import React, { useState } from 'react'

interface CommentFormProps {
  onSubmit: (text: string) => void
  onCancel: () => void
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedText = text.trim()
    if (trimmedText) {
      onSubmit(trimmedText)
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="input-field w-full min-h-[80px]"
        autoFocus
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn btn-primary text-xs px-3 py-1"
        >
          Add Comment
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn border-github-border-default text-github-fg-default hover:bg-github-border-muted text-xs px-3 py-1"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CommentForm