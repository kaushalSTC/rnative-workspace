# 📦 Publishing Guide - React Native Starters

## 🚀 Quick Release (Automated)

Run the automated release script:

```bash
./release.sh
```

## 🛠️ Manual Release Process

### Step 1: Authenticate with GitHub

If you're having authentication issues with GitHub, try one of these:

**Option A: Using GitHub CLI (Recommended)**
```bash
gh auth login
git push origin main
```

**Option B: Using Personal Access Token**
```bash
# Use your GitHub username and personal access token
git push https://kaushalstc:YOUR_PERSONAL_ACCESS_TOKEN@github.com/kaushalSTC/rnative-workspace.git main
```

**Option C: SSH (if configured)**
```bash
git remote set-url origin git@github.com:kaushalSTC/rnative-workspace.git
git push origin main
```

### Step 2: Publish to npm

**Check npm authentication:**
```bash
npm whoami
# Should return: kaushalstc
```

**If not authenticated:**
```bash
npm login
# Login as: kaushalstc
```

**Publish expo-starter:**
```bash
cd packages/expo-starter
npm publish
cd ../..
```

**Publish cli-starter:**
```bash
cd packages/cli-starter  
npm publish
cd ../..
```

## 📊 Current Versions

- **@kaushalstc/expo-starter**: v4.0.1
- **@kaushalstc/cli-starter**: v3.0.1

## 🎯 Usage After Publishing

**Expo Starter:**
```bash
npx @kaushalstc/expo-starter MyApp com.company.myapp
```

**CLI Starter:**
```bash
npx @kaushalstc/cli-starter MyApp com.company.myapp
```

## 🔍 Verify Publication

Check if packages are live on npm:

```bash
npm view @kaushalstc/expo-starter version
npm view @kaushalstc/cli-starter version
```

## ⚠️ Troubleshooting

### GitHub Authentication Issues

1. **403 Permission Denied**: You need to authenticate properly
2. **Wrong User**: Make sure you're authenticated as `kaushalstc`
3. **Repository Access**: Ensure you have push access to the repo

### npm Publishing Issues

1. **Not Authenticated**: Run `npm login` and login as `kaushalstc`
2. **Package Exists**: Increment version in package.json first
3. **Scope Issues**: Make sure `publishConfig.access` is set to `public`

## 🔄 Version Bumping

To bump versions before publishing:

```bash
# Expo starter
cd packages/expo-starter
npm version patch  # or minor/major
cd ../..

# CLI starter  
cd packages/cli-starter
npm version patch  # or minor/major
cd ../..
```

## 📋 Release Checklist

- [ ] All changes committed and pushed to GitHub
- [ ] Version numbers bumped appropriately
- [ ] Authenticated with npm as `kaushalstc`
- [ ] Both packages published successfully
- [ ] Verified packages are available on npm registry
- [ ] Updated documentation if needed

## 🌐 Package Links

- **Expo Starter**: https://www.npmjs.com/package/@kaushalstc/expo-starter
- **CLI Starter**: https://www.npmjs.com/package/@kaushalstc/cli-starter
- **GitHub Repository**: https://github.com/kaushalSTC/rnative-workspace
