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
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-title">
            <Shield size={24} style={{ color: '#3fb950' }} />
            <h1>Commit Guardian - Review Changes</h1>
          </div>
          
          <div className="header-stats">
            <div className="header-stat">
              <GitCommit size={16} />
              <span>{stats.totalFiles} files</span>
            </div>
            
            {stats.totalAdditions > 0 && (
              <div className="text-green">
                +{stats.totalAdditions}
              </div>
            )}
            
            {stats.totalDeletions > 0 && (
              <div className="text-red">
                -{stats.totalDeletions}
              </div>
            )}
            
            {commentCount > 0 && (
              <div style={{ color: '#e6edf3' }}>
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