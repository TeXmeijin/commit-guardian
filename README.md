# Git Approve - CLI Commit Review Tool

A CLI tool that opens a browser-based diff viewer for reviewing git changes before committing. Inspired by [difit](https://github.com/yoshiko-pg/difit) but adds an approval workflow for safe commits.

## ✨ Features

- 🔍 **GitHub-style diff viewer** in browser
- 💬 **Line-by-line comments** on changes
- ✅ **Approval workflow** - approve to commit or reject to cancel
- 🚀 **Auto-commit** after approval with custom commit message
- 📋 **Staged & unstaged changes** support
- 🙈 **Respects .gitignore** - ignored files are not shown

## 📦 Installation

1. Clone or copy the `git-approve` script to your local machine
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Make the script executable:
   ```bash
   chmod +x git-approve
   ```
4. (Optional) Add to your PATH for global access:
   ```bash
   sudo ln -s $(pwd)/git-approve /usr/local/bin/git-approve
   ```

## 🚀 Usage

Navigate to any git repository and run:

```bash
./git-approve
```

Or if installed globally:
```bash
git-approve
```

### Command Line Options

```bash
# Basic usage
git-approve

# With default commit message
git-approve "Add new feature"
git-approve -m "Fix login bug"
git-approve --message "Update documentation"

# Show help
git-approve --help
```

### Workflow

1. **Run the command** in your git repository
2. **Browser opens** automatically showing your changes
3. **Review diffs** with GitHub-like interface
4. **Add comments** (optional) by clicking the 💬 button on any line
5. **Write commit message** in the text area
6. **Click "✅ Approve & Commit"** to commit or "❌ Reject" to cancel

### Example Output

```
🔍 Git Approve - Review changes before commit

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

## 🔧 Configuration

The tool runs on port 3456 by default. If you need to change this, edit the `PORT` constant in the script.

## ⚠️ Requirements

- Node.js (v14 or higher)
- Git repository
- Modern web browser

## 🆚 Differences from difit

| Feature | difit | git-approve |
|---------|-------|-------------|
| View diffs | ✅ | ✅ |
| Add comments | ✅ | ✅ |
| Browser interface | ✅ | ✅ |
| **Approval workflow** | ❌ | ✅ |
| **Auto-commit on approve** | ❌ | ✅ |
| **Pre-commit safety** | ❌ | ✅ |
| **Staged/unstaged combo** | ✅ | ✅ |

## 🔒 Safety Features

- Only shows changes that would be committed
- Requires explicit approval to commit
- Shows both staged and unstaged changes
- Respects .gitignore automatically
- Comments are preserved for review

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use and modify as needed.