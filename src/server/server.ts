import express from 'express'
import path from 'path'
import cors from 'cors'
import diffRoutes from './routes/diff'
import approveRoutes from './routes/approve'
import rejectRoutes from './routes/reject'

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// API routes
app.use('/api', diffRoutes)
app.use('/api', approveRoutes)
app.use('/api', rejectRoutes)

// Serve static files (both development and production)
const clientDistPath = path.join(__dirname, '../client')
app.use(express.static(clientDistPath))

// Handle client-side routing (except API routes)
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

// Fallback for other non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

export default app

export interface ServerOptions {
  port: number
  commitMessage: string
  onApproval?: (approved: boolean, message?: string, reason?: string, comments?: any[]) => void
}

export function startServer(options: ServerOptions): Promise<{ server: any; url: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(options.port, () => {
      const url = `http://localhost:${options.port}`
      console.log(`🚀 Review server started at ${url}`)
      
      // Store options globally for routes to access
      ;(global as any).commitGuardianOptions = options
      
      resolve({ server, url })
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        const nextPort = options.port + 1
        startServer({ ...options, port: nextPort })
          .then(resolve)
          .catch(reject)
      } else {
        reject(err)
      }
    })
  })
}