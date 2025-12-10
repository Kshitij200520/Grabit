# 🚀 Advanced Git Workflows & CI/CD

## Git Branch Strategy

### Branch Structure
```
main (production)
├── develop (development)
├── feature/* (feature branches)
├── release/* (release branches)
└── hotfix/* (hotfix branches)
```

### Workflow Commands

#### Feature Development
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "feat: add JWT authentication system"

# Push feature branch
git push origin feature/user-authentication

# Create Pull Request to develop
# After review and approval, merge to develop
```

#### Release Process
```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Finalize release
git commit -m "chore: bump version to v1.2.0"
git push origin release/v1.2.0

# Merge to main
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.2.0
git push origin develop
```

#### Hotfix Process
```bash
# Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# Fix critical issue
git commit -m "fix: resolve security vulnerability"

# Merge to main
git checkout main
git merge hotfix/security-patch
git tag v1.2.1
git push origin main --tags

# Merge to develop
git checkout develop
git merge hotfix/security-patch
git push origin develop
```

## Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(auth): add JWT token refresh mechanism
fix(cart): resolve cart total calculation error
docs(api): update authentication endpoints documentation
style(components): format React components with Prettier
refactor(database): optimize MongoDB queries
test(users): add unit tests for user registration
chore(deps): update dependencies to latest versions
```

## Git Hooks Setup

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run tests
npm test

# Run linting
npm run lint

# Check for sensitive data
git diff --cached --name-only | xargs grep -l "password\|secret\|key" && echo "⚠️ Potential sensitive data detected!" && exit 1

echo "✅ Pre-commit checks passed"
```

### Pre-push Hook
```bash
#!/bin/sh
# .git/hooks/pre-push

# Run full test suite
npm run test:full

# Security audit
npm audit

# Build check
npm run build

echo "✅ Pre-push checks passed"
```

## GitHub Actions CI/CD

### Workflow File: `.github/workflows/ci-cd.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install Backend Dependencies
      run: |
        cd server
        npm ci
    
    - name: Install Frontend Dependencies
      run: |
        cd client
        npm ci
    
    - name: Run Backend Tests
      run: |
        cd server
        npm run test
      env:
        NODE_ENV: test
        MONGODB_URI: mongodb://localhost:27017/test
        REDIS_HOST: localhost
    
    - name: Run Frontend Tests
      run: |
        cd client
        npm run test -- --coverage --watchAll=false
    
    - name: Run Security Audit
      run: |
        cd server && npm audit
        cd ../client && npm audit
    
    - name: Build Frontend
      run: |
        cd client
        npm run build
    
    - name: Upload Coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./client/coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install Dependencies
      run: |
        cd server && npm ci
        cd ../client && npm ci
    
    - name: Build Application
      run: |
        cd client
        npm run build
    
    - name: Deploy to Production
      run: |
        # Add your deployment commands here
        echo "🚀 Deploying to production..."
        # Example: Deploy to Vercel, Heroku, AWS, etc.
```

## Advanced Git Configuration

### Global Git Config
```bash
# User configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Editor configuration
git config --global core.editor "code --wait"

# Merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Pretty log format
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Push configuration
git config --global push.default simple
git config --global pull.rebase true

# Line ending configuration
git config --global core.autocrlf input  # Linux/Mac
# git config --global core.autocrlf true  # Windows
```

### Project-specific Git Config
```bash
# In project root
echo "node_modules/
.env
*.log
.DS_Store
dist/
build/
coverage/
.vscode/settings.json" > .gitignore

# Git attributes for proper line endings
echo "* text=auto
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf" > .gitattributes
```

## Code Quality Tools

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "no-console": "warn",
    "no-debugger": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Husky Configuration
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Release Management

### Semantic Versioning
- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features (v1.1.0)
- **PATCH**: Bug fixes (v1.0.1)

### Release Script
```bash
#!/bin/bash
# release.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./release.sh <version>"
  exit 1
fi

echo "🚀 Starting release process for version $VERSION"

# Update version
npm version $VERSION --no-git-tag-version

# Update changelog
echo "## Version $VERSION - $(date)" >> CHANGELOG.md

# Commit changes
git add .
git commit -m "chore: release version $VERSION"

# Create tag
git tag v$VERSION

# Push changes
git push origin develop
git push origin --tags

echo "✅ Release $VERSION completed!"
```

## Monitoring & Analytics

### Git Statistics
```bash
# Commit activity
git log --oneline --since="1 month ago" | wc -l

# Contributors
git shortlog -sn

# Files changed most often
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

# Code frequency
git log --since="1 month ago" --stat --pretty="" | grep -E "file[s]* changed" | awk '{files+=$1; inserted+=$4; deleted+=$6} END {print "Files changed:", files, "Lines inserted:", inserted, "Lines deleted:", deleted}'
```

## Best Practices

### 1. Commit Frequently
- Make small, focused commits
- Commit working code only
- Write meaningful commit messages

### 2. Branch Naming
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/critical-fix`
- `release/version-number`

### 3. Pull Request Guidelines
- Keep PRs small and focused
- Write descriptive PR descriptions
- Include tests for new features
- Request appropriate reviewers

### 4. Security
- Never commit sensitive data
- Use environment variables
- Regular security audits
- Dependency updates

### 5. Documentation
- Update README.md
- Document API changes
- Maintain CHANGELOG.md
- Code comments where necessary

## Integration with IDEs

### VS Code Settings
```json
{
  "git.autofetch": true,
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "gitLens.advanced.messages": {
    "suppressCommitHasNoPreviousCommitWarning": false,
    "suppressCommitNotFoundWarning": false,
    "suppressFileNotUnderSourceControlWarning": false,
    "suppressGitVersionWarning": false,
    "suppressLineUncommittedWarning": false,
    "suppressNoRepositoryWarning": false
  }
}
```

This comprehensive Git workflow ensures:
- ✅ **Professional Development Process**
- ✅ **Automated Quality Checks**
- ✅ **Continuous Integration/Deployment**
- ✅ **Code Quality Management**
- ✅ **Release Management**
- ✅ **Team Collaboration Standards**

Perfect for academic demonstration and real-world projects! 🎯