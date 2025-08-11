# 🚀 Automated Package Publishing

This monorepo is configured with intelligent automated publishing that only publishes packages that have been updated, preventing version conflicts and unnecessary publishes.

## 🎯 How It Works

### Smart Detection
The GitHub Actions workflow automatically detects:
- ✅ **Changed packages** - Only packages with modifications since last commit
- ✅ **Version conflicts** - Skips packages where the version already exists on npm  
- ✅ **Dependency changes** - Triggers when package.json or source files change
- ✅ **Manual triggers** - Support for force publishing all packages

### Workflow Triggers

1. **Automatic** (Recommended)
   - Triggers on push to `main` branch
   - Only when files in `packages/` directory change
   - Publishes only updated packages with new versions

2. **Manual**
   - Go to GitHub Actions → "Publish Updated Packages"
   - Click "Run workflow"
   - Option to force publish all packages (ignores version checks)

## 📦 Version Management

### Using the Helper Script

```bash
# List all packages and their status
npm run version:list

# Show help and usage
npm run version:help

# Bump specific package version
node scripts/version-bump.js expo-starter patch
node scripts/version-bump.js shared-ui minor
node scripts/version-bump.js cli-starter major

# Bump all packages at once
node scripts/version-bump.js all patch
```

### Manual Version Updates

You can also manually update versions in `packages/*/package.json`:

```json
{
  "name": "@kaushalstc/expo-starter",
  "version": "3.0.2"  // ← Update this
}
```

## 🔄 Publishing Workflow

### Recommended Process

1. **Make your changes** to package files
2. **Bump version** using the helper script:
   ```bash
   node scripts/version-bump.js expo-starter patch
   ```
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: update expo-starter with new features"
   git push origin main
   ```
4. **Automatic publishing** - GitHub Actions will:
   - Detect the changed `expo-starter` package
   - Check if version `3.0.2` exists on npm
   - Publish if it's a new version
   - Skip if version already exists

### What Gets Published

| Scenario | Action | Reason |
|----------|--------|---------|
| 📦 New package version | ✅ **Publish** | Version doesn't exist on npm |
| 🔄 Existing version | ⏭️ **Skip** | Prevents duplicate publishing |
| 📝 Modified files, same version | ⏭️ **Skip** | Need version bump first |
| 🚫 No package changes | ⏭️ **Skip workflow** | Nothing to publish |

## 🛠️ Setup Requirements

### GitHub Secrets

You need to add this secret to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add `NPM_TOKEN`:
   ```bash
   # Generate token at https://www.npmjs.com/settings/tokens
   # Select "Automation" token type
   # Set scope to at least "Publish packages"
   ```

### NPM Authentication

All packages must have `publishConfig` in their `package.json`:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

## 📊 Workflow Features

### Intelligent Detection
```yaml
# Detects changes in packages directory
paths:
  - 'packages/*/package.json'  # Version changes
  - 'packages/**'              # Any package file changes
```

### Parallel Publishing
- Uses matrix strategy to publish multiple packages simultaneously
- Each package publishes independently (fail-safe)
- Won't stop other packages if one fails

### Detailed Logging
- ✅ Success messages with package names and versions
- ⏭️ Skip messages with reasons
- ❌ Error details for debugging
- 📋 Summary report at the end

### Safety Features
- **Version conflict prevention** - Checks npm before publishing
- **Git safety** - Uses `--no-git-checks` to handle CI environment
- **Dry run support** - Test without actually publishing
- **Manual override** - Force publish option for emergencies

## 🔍 Troubleshooting

### Common Issues

**Problem**: Workflow doesn't trigger
- ✅ Check if files in `packages/` directory were changed
- ✅ Ensure you're pushing to `main` branch
- ✅ Check `.github/workflows/publish-packages.yml` exists

**Problem**: Package not detected
- ✅ Verify package has `package.json`
- ✅ Check if package directory name matches expected pattern
- ✅ Look at workflow logs for detection details

**Problem**: Publishing fails with 403
- ✅ Check `NPM_TOKEN` secret is set correctly
- ✅ Verify token has "Publish packages" permission
- ✅ Ensure `publishConfig.access: "public"` is set

**Problem**: Version already exists
- ✅ This is expected behavior - bump version first
- ✅ Use `node scripts/version-bump.js package-name patch`
- ✅ Or manually update version in package.json

### Manual Publishing

If you need to publish manually:

```bash
# Check what would be published
npm run publish:check

# Publish locally (emergency only)
npm run publish:local

# Publish specific package
pnpm --filter @kaushalstc/expo-starter publish
```

## 📈 Benefits

### For Developers
- 🚀 **Zero setup** - Just push code and versions update automatically
- 🛡️ **Conflict prevention** - No more version collision errors
- ⚡ **Fast publishing** - Only updated packages are processed
- 📝 **Clear feedback** - Detailed logs show exactly what happened

### For CI/CD
- 🔄 **Reliable automation** - Handles edge cases gracefully
- 📊 **Detailed reporting** - Summary shows all actions taken
- 🛠️ **Easy maintenance** - Simple to debug and modify
- 🔒 **Secure** - Uses GitHub secrets for npm authentication

## 📚 Examples

### Single Package Update
```bash
# 1. Make changes to expo-starter
echo "console.log('new feature');" >> packages/expo-starter/bin/index.js

# 2. Bump version
node scripts/version-bump.js expo-starter patch

# 3. Commit and push
git add .
git commit -m "feat: add logging to expo-starter"
git push

# Result: Only expo-starter gets published
```

### Multiple Package Update
```bash
# 1. Update shared-ui and shared-logic
# ... make changes to both packages ...

# 2. Bump both versions
node scripts/version-bump.js shared-ui minor
node scripts/version-bump.js shared-logic patch

# 3. Commit and push
git add .
git commit -m "feat: update shared packages"
git push

# Result: Both shared-ui and shared-logic get published in parallel
```

### Force Publish All
```bash
# GitHub UI: Actions → "Publish Updated Packages" → Run workflow
# Set "force_publish" to true
# Result: All packages get published regardless of changes
```

This automated system ensures your packages are always up-to-date on npm while preventing common publishing issues!
