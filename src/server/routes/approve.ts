import express from 'express'
import { simpleGit } from 'simple-git'
import type { ApproveRequest, ApproveResponse } from '@/types/api'

const router = express.Router()

router.post('/approve', async (req, res) => {
  try {
    const { message, fileComments }: ApproveRequest = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Commit message is required'
      })
    }

    console.log('\n✅ Changes approved!')
    console.log(`📝 Commit message: ${message}`)
    
    if (fileComments && fileComments.length > 0) {
      console.log(`💬 Comments: ${fileComments.length}`)
      fileComments.forEach((comment, index) => {
        console.log(`   ${index + 1}. ${comment.file}:${comment.line} - ${comment.text}`)
      })
    }

    // Execute git commit
    const git = simpleGit()
    await git.commit(message)
    
    console.log('🎉 Successfully committed changes!')

    // Call the approval callback if provided
    const options = (global as any).commitGuardianOptions
    if (options?.onApproval) {
      options.onApproval(true, message, undefined, fileComments)
    }

    const response: ApproveResponse = {
      success: true,
      autoClose: true, // Close browser after success
    }

    res.json(response)

    // Shutdown server after successful commit
    setTimeout(() => {
      console.log('🚪 Shutting down server after successful commit...')
      process.exit(0)
    }, 1000)

  } catch (error) {
    console.error('\n❌ Commit failed!')
    console.error('Error details:')
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Commit failed'
    })
    
    // Exit process after commit failure so LLM can continue
    setTimeout(() => {
      console.log('🚪 Shutting down server after commit failure...')
      process.exit(1)
    }, 1000)
  }
})

export default router