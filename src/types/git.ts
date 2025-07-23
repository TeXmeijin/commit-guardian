export interface DiffFile {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  additions: number
  deletions: number
  chunks: DiffChunk[]
}

export interface DiffChunk {
  header: string
  lines: DiffLine[]
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
}

export interface DiffLine {
  type: 'add' | 'del' | 'context' | 'header'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
  lineNumber: number
}

export interface GitDiffData {
  hasChanges: boolean
  staged?: string
  unstaged?: string
  files: DiffFile[]
  stats: {
    totalFiles: number
    totalAdditions: number
    totalDeletions: number
  }
}

export interface Comment {
  id: string
  file: string
  line: number
  text: string
  timestamp: number
}