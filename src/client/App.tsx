import React, { useState, useEffect } from 'react'
import type { GitDiffData, Comment } from '@/types/git'
import type { DiffResponse } from '@/types/api'
import Header from './components/Header'
import DiffViewer from './components/DiffViewer'
import ActionPanel from './components/ActionPanel'
import { LoadingSpinner } from './components/LoadingSpinner'

function App() {
  const [diffData, setDiffData] = useState<GitDiffData | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultMessage, setDefaultMessage] = useState('')

  // Load diff data on mount
  useEffect(() => {
    loadDiffData()
  }, [])

  const loadDiffData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/diff')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: DiffResponse = await response.json()
      setDiffData(data)
      setDefaultMessage(data.defaultMessage || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load diff data')
    } finally {
      setIsLoading(false)
    }
  }

  const addComment = (comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }
    setComments(prev => [...prev, newComment])
  }

  const removeComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Loading changes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading">
        <div style={{ color: '#f85149', fontSize: '16px' }}>Error loading changes</div>
        <div>{error}</div>
      </div>
    )
  }

  if (!diffData?.hasChanges) {
    return (
      <div className="loading">
        <div>No changes to review</div>
      </div>
    )
  }

  return (
    <div className="pb-32">
      <Header 
        stats={diffData.stats} 
        commentCount={comments.length}
      />
      
      <main className="container" style={{ padding: '16px' }}>
        <DiffViewer 
          diffData={diffData}
          comments={comments}
          onAddComment={addComment}
        />
      </main>
      
      <ActionPanel 
        comments={comments}
        onRemoveComment={removeComment}
        defaultMessage={defaultMessage}
      />
    </div>
  )
}

export default App