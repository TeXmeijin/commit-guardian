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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="input-field"
        style={{ minHeight: '60px', width: '100%' }}
        autoFocus
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn btn-primary"
          style={{ fontSize: '11px', padding: '4px 12px' }}
        >
          Add Comment
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ 
            fontSize: '11px', 
            padding: '4px 12px', 
            background: 'transparent',
            border: '1px solid #30363d',
            color: '#e6edf3',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CommentForm