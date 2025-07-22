# Commit Guardian 🛡️

**The Perfect Claude Code Companion for Safe Commits**

Interactive CLI tool designed specifically for **Claude Code** users who want to review changes before committing. Never accidentally commit code again - approve every change through a beautiful browser interface.

## 🎯 Why Commit Guardian?

**Built for Claude Code users** who want to maintain control over their commits while leveraging AI assistance. This tool creates the perfect workflow:

1. **Claude Code makes changes** to your codebase
2. **You stay in control** of what gets committed  
3. **Review everything** in a GitHub-style diff viewer
4. **Approve or reject** with confidence

## 🚀 Perfect Claude Code Integration

### Step 1: Configure Claude Code Settings

Add to your `~/.claude/settings.local.json`:

```json
{
  "tools": {
    "deny": [
      "Bash(git commit:*)"
    ],
    "allow": [
      "Bash(npx commit-guardian *)"
    ]
  }
}
```

This prevents Claude Code from making direct commits while allowing it to use Commit Guardian.

### Step 2: Usage with Claude Code

Simply tell Claude Code:
```
"Please run npx commit-guardian with an appropriate commit message"
```

Or add this to your `CLAUDE.md` for automatic usage:
```markdown
When committing changes, always use:
npx commit-guardian -m "descriptive commit message"
```

### Step 3: The Magic Happens

1. **Claude Code runs** `npx commit-guardian -m "your message"`
2. **Browser opens automatically** with your diff
3. **You review** the changes in GitHub-style interface
4. **Approve**: Browser closes, control returns to Claude Code, commit is made
5. **Reject**: Browser closes, control returns to Claude Code, no commit made

## ✨ Features

- 🔍 **GitHub-style diff viewer** in browser
- 💬 **Line-by-line comments** on changes  
- ✅ **Approval workflow** - approve to commit or reject to cancel
- 🚀 **Auto-commit** after approval with custom commit message
- 📋 **Staged & unstaged changes** support
- 🛡️ **Pre-commit safety** - prevents accidental commits
- 🎯 **File status indicators** - see what's added, modified, or deleted
- 📱 **Responsive interface** - works on all screen sizes
- 🤖 **Claude Code optimized** - seamless integration workflow

## 📦 Installation

### Option 1: Global Installation (Recommended)
```bash
npm install -g commit-guardian
```

### Option 2: Use with npx (No installation needed)
```bash
npx commit-guardian -m "Your commit message"
```

## 🚀 Usage Examples

### Basic Usage
```bash
commit-guardian -m "Add new feature"
commit-guardian -m "Fix login bug" 
commit-guardian --message "Update documentation"
```

### With Claude Code
```bash
# Claude Code will run this for you:
npx commit-guardian -m "Implement user authentication system"
```

## 📋 Typical Workflow

### Manual Usage
1. **Stage your changes** using `git add`
2. **Run commit-guardian** with your commit message
3. **Browser opens** automatically showing your changes  
4. **Review diffs** with GitHub-like interface
5. **Add comments** (optional) by clicking the 💬 button on any line
6. **Click "✅ Approve & Commit"** to commit or "❌ Reject" to cancel

### Claude Code Integration Workflow  
1. **Ask Claude Code** to make changes to your project
2. **Tell Claude Code** to commit with commit-guardian
3. **Review changes** when browser opens automatically
4. **Approve or reject** - control returns to Claude Code automatically
5. **Continue working** with Claude Code seamlessly

## 🎮 Example Session

```
🔍 Commit Guardian - Review changes before commit

📊 Changes detected:
  • 3 files modified
  • 2 files added
📝 Commit message: "Implement user authentication system"

🚀 Review server started at http://localhost:3456
🌐 Opening browser for review...

⏳ Waiting for your approval...
   • Review changes in browser
   • Add comments if needed  
   • Approve to commit or reject to cancel

Press Ctrl+C to cancel
```

After approval:
```
✅ Changes approved!
📝 Commit message: Implement user authentication system
💬 Comments:
   1. src/auth.js:42 - Good error handling implementation
   2. src/login.js:15 - Consider adding rate limiting
🎉 Successfully committed changes!
```

## ⚠️ Requirements

- Node.js (v14 or higher)
- Git repository
- Modern web browser
- Claude Code (for optimal experience)

## 🎯 Design Philosophy

Commit Guardian was built specifically for **Claude Code users** who want to:

- **Maintain control** over what gets committed to their repository
- **Review AI-generated changes** before they become permanent
- **Prevent accidental commits** through mandatory approval workflow  
- **Keep development velocity high** while ensuring code quality
- **Stay in the flow** with seamless tool integration

## 💡 Pro Tips

### For Claude Code Users

1. **Add to CLAUDE.md**: Include commit-guardian usage instructions in your project's CLAUDE.md
2. **Use descriptive messages**: Let Claude Code suggest commit messages based on the changes
3. **Review everything**: Even AI-generated code should be reviewed before committing
4. **Comment on changes**: Use the comment feature to note concerns or improvements

### Configuration Tip
```json
// ~/.claude/settings.local.json
{
  "tools": {
    "deny": ["Bash(git commit:*)"],
    "allow": ["Bash(npx commit-guardian *)"] 
  }
}
```

## 🤖 Claude Code Best Practices

When working with Claude Code:

```markdown
# In your CLAUDE.md or prompts:

When making commits, always use:
`npx commit-guardian -m "descriptive message"`

Never use `git commit` directly.
```

## 🙏 Inspiration

This tool was inspired by the excellent [difit](https://github.com/yoshiko-pg/difit) project, but designed specifically for Claude Code integration and approval workflows.

## 🔒 Safety Features

- **Explicit approval required** - no accidental commits
- **Full change visibility** - shows staged and unstaged changes
- **Respects .gitignore** automatically
- **Comments preserved** for review history  
- **Auto-shutdown** after commit for security
- **Claude Code integration** prevents AI from committing without review

## 🤝 Contributing

Found a bug or have a feature request? Please check our [GitHub Issues](https://github.com/TeXmeijin/commit-guardian/issues).

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Happy Safe Committing with Claude Code!** 🛡️🤖✨