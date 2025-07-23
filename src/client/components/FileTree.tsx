import React from 'react'
import { FileText, FilePlus, FileMinus } from 'lucide-react'
import type { DiffFile } from '@/types/git'

interface FileTreeProps {
  files: DiffFile[]
}

const FileTree: React.FC<FileTreeProps> = ({ files }) => {
  const getFileIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <FilePlus className="h-4 w-4 text-github-diff-addition-fg" />
      case 'deleted':
        return <FileMinus className="h-4 w-4 text-github-diff-deletion-fg" />
      default:
        return <FileText className="h-4 w-4 text-github-fg-muted" />
    }
  }

  return (
    <div className="border border-github-border-default rounded-md bg-github-canvas-subtle">
      <div className="p-3 border-b border-github-border-default">
        <h3 className="font-medium text-github-fg-default">Changed Files</h3>
      </div>
      
      <div className="divide-y divide-github-border-default">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-github-border-muted/30">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.status)}
              <span className="text-sm font-mono text-github-fg-default">{file.path}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              {file.additions > 0 && (
                <span className="text-github-diff-addition-fg">+{file.additions}</span>
              )}
              {file.deletions > 0 && (
                <span className="text-github-diff-deletion-fg">-{file.deletions}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileTree