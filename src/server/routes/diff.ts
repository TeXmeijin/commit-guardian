import express from 'express'
import { simpleGit } from 'simple-git'
import type { DiffResponse } from '@/types/api'

const router = express.Router()

router.get('/diff', async (req, res) => {
  try {
    const git = simpleGit()
    
    // Get staged and unstaged changes
    const [stagedDiff, unstagedDiff] = await Promise.all([
      git.diff(['--cached']),
      git.diff()
    ])

    const hasChanges = Boolean(stagedDiff || unstagedDiff)
    
    // Get file stats
    const status = await git.status()
    const totalFiles = status.files.length
    
    // Calculate basic stats (we could enhance this later)
    const stats = {
      totalFiles,
      totalAdditions: 0, // TODO: Parse from diff
      totalDeletions: 0, // TODO: Parse from diff
    }

    // Get default commit message from global options
    const options = (global as any).commitGuardianOptions
    const defaultMessage = options?.commitMessage || ''

    const response: DiffResponse = {
      hasChanges,
      staged: stagedDiff || undefined,
      unstaged: unstagedDiff || undefined,
      files: [], // TODO: Parse files from diff
      stats,
      defaultMessage,
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting diff:', error)
    res.status(500).json({ 
      error: 'Failed to get diff',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router