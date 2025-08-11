# 📦 Publishing Guide

Complete step-by-step guide to publish your monorepo packages to npm.

## 🚀 **Quick Publishing (If you're ready)**

```bash
# 1. Login to npm (one time setup)
npm login

# 2. Publish shared-ui
cd packages/shared-ui
npm publish

# 3. Publish shared-logic
cd ../shared-logic  
npm publish

# 4. Done! ✅
```

---

## 📋 **Complete Step-by-Step Guide**

### **Step 1: Prerequisites**

#### **A. npm Account**
```bash
# Check if you're logged in
npm whoami

# If not logged in, create account at https://npmjs.com
# Then login:
npm login
```

#### **B. Verify Package Names**
Your packages use scoped names: `@kaushalrathour/shared-ui`
- ✅ This requires your npm account to have access to the `@kaushalrathour` scope
- ✅ Or the packages need `"publishConfig": { "access": "public" }` (already added)

#### **C. Check Git Status**
```bash
# Make sure everything is committed
git status
git add .
git commit -m "Prepare packages for publishing"
```

---

### **Step 2: Pre-Publication Checks**

#### **A. Verify Package Contents**
```bash
# Check what will be published in shared-ui
cd packages/shared-ui
npm pack --dry-run

# Check what will be published in shared-logic
cd ../shared-logic
npm pack --dry-run
```

#### **B. Test Package Installation Locally**
```bash
# Create test packages
cd packages/shared-ui
npm pack  # Creates @kaushalrathour-shared-ui-1.0.0.tgz

cd ../shared-logic
npm pack  # Creates @kaushalrathour-shared-logic-1.0.0.tgz

# Test install in a sample project
mkdir /tmp/test-install
cd /tmp/test-install
npm init -y
npm install /path/to/rnative-workspace/packages/shared-ui/@kaushalrathour-shared-ui-1.0.0.tgz
npm install /path/to/rnative-workspace/packages/shared-logic/@kaushalrathour-shared-logic-1.0.0.tgz

# Test imports
node -e "console.log(require('@kaushalrathour/shared-ui'))"
node -e "console.log(require('@kaushalrathour/shared-logic'))"
```

---

### **Step 3: Publish Packages**

#### **Method A: Manual Publishing (Recommended for first time)**

```bash
# 1. Publish shared-ui
cd /Users/kaushal/Desktop/rnative-workspace/packages/shared-ui
npm publish

# 2. Publish shared-logic  
cd ../shared-logic
npm publish

# You should see output like:
# npm notice 📦  @kaushalrathour/shared-ui@1.0.0
# npm notice === Tarball Contents ===
# npm notice 1.2kB index.js
# npm notice 15.4kB src/
# + @kaushalrathour/shared-ui@1.0.0
```

#### **Method B: Batch Publishing (After first time)**

```bash
# From monorepo root
cd /Users/kaushal/Desktop/rnative-workspace

# Publish all packages at once
pnpm -r publish

# Or with npm (if you prefer)
# Note: This requires npm 7+ for workspaces
npm publish --workspaces
```

---

### **Step 4: Verify Publication**

#### **A. Check npm Registry**
```bash
# Check if packages are published
npm view @kaushalrathour/shared-ui
npm view @kaushalrathour/shared-logic

# Check latest version
npm view @kaushalrathour/shared-ui version
npm view @kaushalrathour/shared-logic version
```

#### **B. Test Installation from Registry**
```bash
# Create fresh test directory
mkdir /tmp/test-npm-install
cd /tmp/test-npm-install
npm init -y

# Install from npm registry
npm install @kaushalrathour/shared-ui @kaushalrathour/shared-logic

# Test imports
node -e "
const ui = require('@kaushalrathour/shared-ui');
const logic = require('@kaushalrathour/shared-logic');
console.log('UI exports:', Object.keys(ui));
console.log('Logic exports:', Object.keys(logic));
"
```

---

### **Step 5: Update Documentation**

After successful publishing, update your documentation:

#### **A. Update Main README**
```bash
# Update the main README with installation instructions
cd /Users/kaushal/Desktop/rnative-workspace

# Add installation section:
echo "
## Installation

\`\`\`bash
npm install @kaushalrathour/shared-ui @kaushalrathour/shared-logic
\`\`\`
" >> README.md
```

#### **B. Create Release**
```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0

# Or create GitHub release with notes
```

---

## 🔄 **Future Updates & Versioning**

### **Semantic Versioning Strategy**

```bash
# Bug fixes (1.0.0 → 1.0.1)
pnpm -r version patch
pnpm -r publish

# New features (1.0.1 → 1.1.0)  
pnpm -r version minor
pnpm -r publish

# Breaking changes (1.1.0 → 2.0.0)
pnpm -r version major
pnpm -r publish
```

### **Updating Individual Packages**

```bash
# Update only shared-ui
cd packages/shared-ui
npm version patch  # 1.0.0 → 1.0.1
npm publish

# Update only shared-logic
cd packages/shared-logic
npm version minor  # 1.0.0 → 1.1.0
npm publish
```

---

## 🎯 **Publishing Checklist**

### **Before Publishing:**
- [ ] All code committed to git
- [ ] README files created for each package
- [ ] Package.json files have correct metadata
- [ ] `"files"` field includes all necessary files
- [ ] `"publishConfig": { "access": "public" }` set
- [ ] Version numbers are appropriate
- [ ] npm login completed

### **After Publishing:**
- [ ] Verify packages on npmjs.com
- [ ] Test installation from registry
- [ ] Update main repository documentation
- [ ] Create git tag for release
- [ ] Announce to users/community

---

## 📊 **Package Statistics**

After publishing, you can track your packages:

```bash
# Download stats
npm view @kaushalrathour/shared-ui --json | grep downloads

# Package info
npm info @kaushalrathour/shared-ui

# List all versions
npm view @kaushalrathour/shared-ui versions --json
```

---

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **"You do not have permission to publish"**
```bash
# Make sure you're logged in to the correct account
npm whoami

# And have access to the @kaushalrathour scope
# Or use public access (already configured)
```

#### **"Package already exists"**
```bash
# Increment version
npm version patch
npm publish
```

#### **"files not found"**
```bash
# Check the "files" field in package.json
# Make sure all referenced files exist
ls -la src/  # Verify src directory exists
```

#### **Import errors after publishing**
```bash
# Check main field points to correct file
# Verify index.js exports everything correctly
```

---

## 🎉 **Success!**

Once published, developers can use your packages:

```bash
# They can generate apps
npx @kaushalrathour/expo-starter MyApp

# And add your shared packages
cd MyApp
npm install @kaushalrathour/shared-ui @kaushalrathour/shared-logic

# Transform basic apps into professional ones! 🚀
```

Your packages are now part of the npm ecosystem and available to the React Native community!
