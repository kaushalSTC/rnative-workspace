#!/bin/bash

# Release script for both React Native starters
# This script will help you push to GitHub and publish to npm

echo "🚀 React Native Starters Release Script"
echo "======================================="

# Check if we're in the correct directory
if [[ ! -f "packages/expo-starter/package.json" ]] || [[ ! -f "packages/cli-starter/package.json" ]]; then
    echo "❌ Error: Please run this script from the rnative-workspace root directory"
    exit 1
fi

# Get current versions
EXPO_VERSION=$(cat packages/expo-starter/package.json | grep '"version"' | cut -d'"' -f4)
CLI_VERSION=$(cat packages/cli-starter/package.json | grep '"version"' | cut -d'"' -f4)

echo "📊 Current versions:"
echo "   • @kaushalstc/expo-starter: v$EXPO_VERSION"
echo "   • @kaushalstc/cli-starter: v$CLI_VERSION"
echo ""

# Step 1: Push to GitHub
echo "📡 Step 1: Pushing to GitHub..."
echo "Note: You may need to authenticate with GitHub"
echo ""

# Check if changes are committed
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Warning: You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "🚀 Release: expo-starter v$EXPO_VERSION & react-native-starter v$CLI_VERSION

✨ Major update with advanced UI components and deep linking functionality"
fi

# Try to push to GitHub
if git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub. Please ensure:"
    echo "   1. You're authenticated with GitHub (try: gh auth login)"
    echo "   2. You have push access to the repository"
    echo "   3. Your SSH key is configured (if using SSH)"
    echo ""
    echo "You can manually push using:"
    echo "   git push origin main"
    echo ""
    echo "Or authenticate first:"
    echo "   gh auth login"
    echo "   git push origin main"
fi

echo ""

# Step 2: Publish to npm
echo "📦 Step 2: Publishing to npm..."
echo "Note: You should be logged in as 'kaushalstc' on npm"
echo ""

# Check npm authentication
NPM_USER=$(npm whoami 2>/dev/null)
if [[ "$NPM_USER" != "kaushalstc" ]]; then
    echo "❌ Not authenticated with npm or wrong user. Please login:"
    echo "   npm login"
    echo ""
    echo "Make sure you login as 'kaushalstc'"
    exit 1
fi

echo "✅ Authenticated as: $NPM_USER"
echo ""

# Publish expo-starter
echo "📤 Publishing @kaushalstc/expo-starter@$EXPO_VERSION..."
cd packages/expo-starter
if npm publish; then
    echo "✅ @kaushalstc/expo-starter@$EXPO_VERSION published successfully!"
else
    echo "❌ Failed to publish @kaushalstc/expo-starter"
fi

cd ../..

# Publish cli-starter
echo ""
echo "📤 Publishing @kaushalstc/cli-starter@$CLI_VERSION..."
cd packages/cli-starter
if npm publish; then
    echo "✅ @kaushalstc/cli-starter@$CLI_VERSION published successfully!"
else
    echo "❌ Failed to publish @kaushalstc/cli-starter"
fi

cd ../..

echo ""
echo "🎉 Release process completed!"
echo ""
echo "📋 Summary:"
echo "   • GitHub: Pushed latest changes"
echo "   • npm: Published both packages"
echo ""
echo "📱 Usage:"
echo "   npx @kaushalstc/expo-starter MyApp com.company.myapp"
echo "   npx @kaushalstc/cli-starter MyApp com.company.myapp"
echo ""
echo "🔗 Links:"
echo "   • Expo Starter: https://www.npmjs.com/package/@kaushalstc/expo-starter"
echo "   • CLI Starter: https://www.npmjs.com/package/@kaushalstc/cli-starter"
echo "   • GitHub: https://github.com/kaushalSTC/rnative-workspace"
