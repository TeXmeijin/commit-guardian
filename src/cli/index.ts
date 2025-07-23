#!/usr/bin/env node

import { Command } from 'commander'
import { simpleGit } from 'simple-git'
import open from 'open'
import { startServer } from '../server/server'

const program = new Command()

program
  .name('commit-guardian')
  .description('🛡️ Commit Guardian - Review changes before commit')
  .version('1.0.5')
  .option('-m, --message <message>', 'Commit message (REQUIRED)')
  .option('-p, --port <port>', 'Port number', '3456')
  .option('--no-open', 'Don\'t automatically open browser')
  .helpOption('-h, --help', 'Show this help message')
  .action(async (options) => {
    if (!options.message) {
      console.error('❌ Error: Commit message is required')
      console.error('')
      console.error('Usage: commit-guardian -m <commit-message>')
      console.error('')
      console.error('Examples:')
      console.error('  commit-guardian -m "Add new feature"')
      console.error('  commit-guardian --message "Fix bug in login"')
      process.exit(1)
    }

    try {
      // Check if we're in a git repository
      const git = simpleGit()
      const isRepo = await git.checkIsRepo()
      
      if (!isRepo) {
        console.error('❌ Error: Not a git repository')
        process.exit(1)
      }

      // Check for changes
      const status = await git.status()
      const stagedFiles = status.staged.length
      const modifiedFiles = status.modified.length
      const hasChanges = stagedFiles > 0 || modifiedFiles > 0

      if (!hasChanges) {
        console.error('❌ Error: No staged changes found')
        console.error('')
        console.error('You need to stage files before committing.')
        console.error('Please use git add to stage specific files:')
        console.error('')
        
        if (status.not_added.length > 0) {
          console.error('📋 Untracked files that can be added:')
          status.not_added.forEach(file => {
            console.error(`   git add ${file}`)
          })
          console.error('')
        }
        
        if (status.modified.length > 0) {
          console.error('📋 Modified files that can be staged:')
          status.modified.forEach(file => {
            console.error(`   git add ${file}`)
          })
          console.error('')
        }

        console.error('💡 Avoid using:')
        console.error('   git add .     (adds all files)')
        console.error('   git add -A    (adds all files)')
        console.error('')
        console.error('Instead, add files individually for better control.')
        console.error('')
        console.error('🛡️ Commit Guardian - Review changes before commit')
        process.exit(1)
      }

      console.log('🛡️ Commit Guardian - Review changes before commit')
      console.log('')
      
      console.log('📊 Changes detected:')
      if (stagedFiles > 0) console.log('  • Staged changes found')
      if (modifiedFiles > 0) console.log('  • Unstaged changes found')
      
      console.log(`📝 Default commit message: "${options.message}"`)
      console.log('')

      // Start the server
      const port = parseInt(options.port)
      const { server, url } = await startServer({
        port,
        commitMessage: options.message,
        onApproval: (approved, message, reason, comments) => {
          // This callback is called when approval/rejection happens
          // Server will shut down automatically
        }
      })

      console.log('🌐 Opening browser...')
      console.log('')
      console.log('⏳ Waiting for your review...')
      console.log('   • Review changes in browser')
      console.log('   • Add comments if needed')
      console.log('   • Approve to commit or reject to cancel')
      console.log('')
      console.log('Press Ctrl+C to cancel')

      // Open browser if not disabled
      if (options.open !== false) {
        try {
          await open(url)
        } catch (error) {
          console.log('Could not open browser automatically. Please visit:', url)
        }
      }

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n\n👋 Review cancelled')
        server.close(() => {
          process.exit(0)
        })
      })

      process.on('SIGTERM', () => {
        console.log('\n\n👋 Review cancelled')
        server.close(() => {
          process.exit(0)
        })
      })

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
      process.exit(1)
    }
  })

// Check for required dependencies
const checkDependencies = () => {
  try {
    require('express')
    require('simple-git')
    require('open')
    require('commander')
  } catch (error) {
    console.error('❌ Missing dependencies. Please install:')
    console.error('   npm install')
    process.exit(1)
  }
}

if (require.main === module) {
  checkDependencies()
  program.parse()
}