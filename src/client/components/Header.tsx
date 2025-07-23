import React from 'react'
import { Shield, GitCommit } from 'lucide-react'

interface HeaderProps {
  stats: {
    totalFiles: number
    totalAdditions: number
    totalDeletions: number
  }
  commentCount: number
}

const Header: React.FC<HeaderProps> = ({ stats, commentCount }) => {
  return (
    <header className="border-b border-github-border-default bg-github-canvas-subtle">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-github-success-fg" />
            <h1 className="text-lg font-semibold text-github-fg-default">
              Commit Guardian - Review Changes
            </h1>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-github-fg-muted">
            <div className="flex items-center space-x-1">
              <GitCommit className="h-4 w-4" />
              <span>{stats.totalFiles} files</span>
            </div>
            
            {stats.totalAdditions > 0 && (
              <div className="text-github-diff-addition-fg">
                +{stats.totalAdditions}
              </div>
            )}
            
            {stats.totalDeletions > 0 && (
              <div className="text-github-diff-deletion-fg">
                -{stats.totalDeletions}
              </div>
            )}
            
            {commentCount > 0 && (
              <div className="text-github-fg-default">
                💬 {commentCount} comment{commentCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header