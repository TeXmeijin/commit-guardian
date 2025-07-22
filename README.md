# Commit Guardian 🛡️

Interactive CLI tool with browser-based diff viewer for reviewing and approving git changes before commit. A safety-focused approach to git commits with approval workflow.

## ✨ Features

- 🔍 **GitHub-style diff viewer** in browser
- 💬 **Line-by-line comments** on changes
- ✅ **Approval workflow** - approve to commit or reject to cancel
- 🚀 **Auto-commit** after approval with custom commit message
- 📋 **Staged & unstaged changes** support
- 🛡️ **Pre-commit safety** - prevents accidental commits
- 🎯 **File status indicators** - see what's added, modified, or deleted
- 📱 **Responsive interface** - works on all screen sizes

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g commit-guardian
```

### Use with npx (No installation needed)
```bash
npx commit-guardian -m "Your commit message"
```

## 🚀 Usage

Navigate to any git repository and run:

```bash
commit-guardian -m "Your commit message"
```

Alternative command (both work identically):
```bash
git-approve -m "Your commit message"
```

### Command Line Options

```bash
# Basic usage with commit message (required)
commit-guardian -m "Add new feature"
git-approve -m "Fix login bug"

# Long form
commit-guardian --message "Update documentation"

# Show help
commit-guardian --help
```

### Workflow

1. **Stage your changes** using `git add`
2. **Run commit-guardian** with your commit message
3. **Browser opens** automatically showing your changes  
4. **Review diffs** with GitHub-like interface
5. **Add comments** (optional) by clicking the 💬 button on any line
6. **Click "✅ Approve & Commit"** to commit or "❌ Reject" to cancel

### Example Output

```
🔍 Commit Guardian - Review changes before commit

📊 Changes detected:
  • Staged changes found
  • Unstaged changes found
📝 Default commit message: "Add new feature"

🚀 Review server started at http://localhost:3456
🌐 Opening browser...

⏳ Waiting for your review...
   • Review changes in browser
   • Add comments if needed
   • Approve to commit or reject to cancel

Press Ctrl+C to cancel
```

After approval:
```
✅ Changes approved!
📝 Commit message: Add new feature with validation
💬 Comments:
   1. src/app.js:42 - Consider using const instead of let
   2. src/app.js:58 - Add error handling here
🎉 Successfully committed changes!
```

## ⚠️ Requirements

- Node.js (v14 or higher)
- Git repository
- Modern web browser

## 🎯 Design Philosophy

Commit Guardian focuses on **safety and simplicity** in the git commit process. While there are many excellent diff review tools available, our goal is to provide a lightweight, focused solution that:

- **Prevents accidental commits** through mandatory review
- **Keeps it simple** with essential features only
- **Integrates seamlessly** with existing git workflows
- **Requires minimal setup** - just npm install and go

## 🙏 Inspiration

This tool was inspired by the excellent [difit](https://github.com/yoshiko-pg/difit) project. Difit offers a comprehensive feature set and beautiful UI for diff viewing. Commit Guardian takes a different approach, focusing specifically on the approval workflow and commit safety aspect.

**When to use difit:** If you want a feature-rich diff viewer with advanced UI capabilities and comprehensive file management.

**When to use commit-guardian:** If you want a simple, safety-focused commit approval workflow that prevents accidental commits.

Both tools serve different needs in the developer toolkit! 🤝

## 🔒 Safety Features

- Requires explicit approval before any commit
- Shows both staged and unstaged changes for full context
- Respects .gitignore automatically  
- Comments are preserved for review
- Server auto-shuts down after commit for security
- No auto-commit on accidental actions

## 🤝 Contributing

Found a bug or have a feature request? Please check our [GitHub Issues](https://github.com/TeXmeijin/commit-guardian/issues).

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Happy Safe Committing!** 🛡️✨