import express from 'express'
import type { RejectRequest, RejectResponse } from '@/types/api'

const router = express.Router()

router.post('/reject', async (req, res) => {
  try {
    const { rejectReason, fileComments }: RejectRequest = req.body

    console.log('\n❌ Changes rejected')
    
    if (rejectReason) {
      console.log('\n📝 Rejection reason:')
      console.log('='.repeat(50))
      console.log(rejectReason)
      console.log('')
    }
    
    if (fileComments && fileComments.length > 0) {
      console.log('\n📝 Review comments for LLM analysis:')
      console.log('='.repeat(50))
      
      fileComments.forEach((comment, index) => {
        console.log(`${index + 1}. File: ${comment.file}:${comment.line}`)
        console.log(`   Comment: ${comment.text}`)
        console.log('')
      })
      
      console.log('\n🤖 LLM Analysis Format:')
      console.log('='.repeat(30))
      if (rejectReason) {
        console.log(`Reject Reason: ${rejectReason}`)
      }
      fileComments.forEach(comment => {
        console.log(`${comment.file}:${comment.line} - ${comment.text}`)
      })
    } else {
      console.log('ℹ️  No comments provided')
    }

    // Call the approval callback if provided
    const options = (global as any).commitGuardianOptions
    if (options?.onApproval) {
      options.onApproval(false, undefined, rejectReason, fileComments)
    }

    const response: RejectResponse = {
      success: true
    }

    res.json(response)

    // Shutdown server after rejection
    setTimeout(() => {
      console.log('🚪 Shutting down server after rejection...')
      process.exit(0)
    }, 1000)

  } catch (error) {
    console.error('Error handling rejection:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Rejection failed'
    })
  }
})

export default router