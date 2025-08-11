# RNative Workspace

A monorepo workspace containing React Native CLI tools and utilities.

## Packages

- **[@kaushalstc/expo-starter](./packages/expo-starter)** - Bootstrap a custom React Native Expo app with predefined template and dependencies
- **[@kaushalstc/shared-ui](./packages/shared-ui)** - Shared UI components, theming, and design system
- **[@kaushalstc/shared-logic](./packages/shared-logic)** - API clients, Redux slices, utilities, and business logic
- **[@kaushalstc/cli-starter](./packages/cli-starter)** - CLI starter utilities

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

```bash
# Run tests for all packages
pnpm test

# Run linting for all packages
pnpm lint

# Build all packages
pnpm build

# Clean all packages
pnpm clean
```

### Using expo-starter CLI

You can test the expo-starter CLI locally in several ways:

1. **Using pnpm from workspace root:**
   ```bash
   pnpm --filter @kaushalstc/expo-starter exec expo-starter MyAppName
   ```

2. **Direct execution:**
   ```bash
   node packages/expo-starter/bin/index.js MyAppName
   ```

3. **Using pnpm link:**
   ```bash
   cd packages/expo-starter
   pnpm link --global
   # Then use from anywhere
   expo-starter MyAppName
   ```

## Package Management

This workspace uses pnpm with workspaces. Key commands:

- `pnpm install` - Install all dependencies
- `pnpm -r run <script>` - Run script in all packages
- `pnpm --filter <package> <command>` - Run command in specific package
- `pnpm -w add <dep>` - Add dependency to workspace root

## 🚀 Automated Publishing

Packages are automatically published to npm when pushed to the main branch:

- 📦 **Smart Detection** - Only publishes packages that have been updated
- 🛡️ **Version Conflict Prevention** - Skips packages with existing versions
- ⚡ **Parallel Publishing** - Multiple packages publish simultaneously
- 📋 **Detailed Reporting** - Clear logs show exactly what happened

### Quick Commands
```bash
# List all packages and versions
npm run version:list

# Bump a package version
node scripts/version-bump.js expo-starter patch
node scripts/version-bump.js shared-ui minor

# Commit and push (triggers auto-publish)
git add . && git commit -m "feat: updates" && git push
```

📚 **[Full Documentation →](./AUTOMATED_PUBLISHING.md)**

## License

MIT
