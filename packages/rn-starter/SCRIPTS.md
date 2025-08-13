# Available Scripts

This document outlines all the npm scripts available in projects created with `@kaushalstc/rn-starter`. Scripts vary based on the platform chosen (React Native CLI or Expo).

## Platform Selection

When you run `npx @kaushalstc/rn-starter`, you'll choose between:
- **React Native CLI**: Full native access, manual native configuration
- **Expo**: Managed workflow, simplified development and deployment

## Common Scripts (Both Platforms)

### Development
```bash
npm start                 # Start the development server
npm run reset            # Reset Metro cache and start fresh
```

### Cleaning
```bash
npm run clean            # Clean all caches and temporary files
```

## React Native CLI Scripts

### Development & Running
```bash
npm run android          # Run on Android device/emulator
npm run ios              # Run on iOS device/simulator (macOS only)
npm start                # Start Metro bundler
npm run start:reset      # Start Metro with cache reset
```

### Building
```bash
npm run build:android    # Build Android APK for testing
npm run build:android:release    # Build Android release APK
npm run build:android:bundle     # Build Android App Bundle (AAB)
npm run build:ios        # Build iOS archive (requires Xcode)
```

### Platform-Specific Cleaning
```bash
npm run clean:android    # Clean Android build artifacts
npm run clean:ios        # Clean iOS build artifacts and reset CocoaPods
npm run clean:metro      # Clean Metro bundler cache
npm run clean:npm        # Clean npm cache
npm run clean:all        # Clean everything (Android, iOS, Metro, npm)
```

### iOS-Specific (macOS only)
```bash
npm run pod:install      # Install CocoaPods dependencies
npm run pod:update       # Update CocoaPods dependencies
npm run ios:clean        # Clean iOS build and reinstall pods
```

### Android-Specific
```bash
npm run android:clean    # Clean Android Gradle cache
npm run android:assemble # Assemble debug APK
npm run android:install  # Install APK on connected device
```

### Development Tools
```bash
npm run flipper          # Start Flipper debugger (if installed)
npm run log:android      # View Android device logs
npm run log:ios          # View iOS device logs
npm run devices          # List connected devices
```

## Expo Scripts

### Development & Running
```bash
npm start                # Start Expo development server
npm run android          # Run on Android with Expo
npm run ios              # Run on iOS with Expo
npm run web              # Run on web browser
```

### Development Server Options
```bash
npm run start:clear      # Start with cleared cache
npm run start:tunnel     # Start with tunnel connection
npm run start:lan        # Start with LAN connection
npm run start:localhost  # Start with localhost connection
```

### EAS Build (Production)
```bash
npm run build:development    # Build development client
npm run build:preview        # Build preview version
npm run build:production     # Build production version
npm run build:all           # Build for all platforms (iOS + Android)
```

### Platform-Specific Builds
```bash
npm run build:android:dev    # Build Android development client
npm run build:android:preview # Build Android preview
npm run build:android:prod   # Build Android production
npm run build:ios:dev        # Build iOS development client  
npm run build:ios:preview    # Build iOS preview
npm run build:ios:prod       # Build iOS production
```

### App Store Submission
```bash
npm run submit:production    # Submit to both app stores
npm run submit:android       # Submit to Google Play Store
npm run submit:ios           # Submit to Apple App Store
```

### Expo-Specific Tools
```bash
npm run expo:install         # Install Expo-compatible packages
npm run expo:doctor          # Check project health
npm run expo:whoami          # Show current Expo user
npm run expo:login           # Login to Expo account
npm run expo:logout          # Logout from Expo account
```

### Updates & Publishing (Expo)
```bash
npm run publish              # Publish update (classic updates)
npm run update:preview       # Create preview update
npm run update:production    # Create production update
```

### Prebuild (Generate Native Code)
```bash
npm run prebuild             # Generate native Android/iOS directories
npm run prebuild:clean       # Clean and regenerate native code
npm run prebuild:android     # Generate Android native code only
npm run prebuild:ios         # Generate iOS native code only
```

## Testing Scripts (Both Platforms)

```bash
npm test                     # Run tests
npm run test:watch           # Run tests in watch mode  
npm run test:coverage        # Run tests with coverage report
npm run test:ci             # Run tests for CI/CD
```

## Linting & Formatting (Both Platforms)

```bash
npm run lint                 # Run ESLint
npm run lint:fix             # Fix ESLint errors automatically
npm run format               # Format code with Prettier
npm run type-check           # Run TypeScript type checking
```

## Debugging Scripts

### React Native CLI
```bash
npm run debug:android        # Debug Android app
npm run debug:ios            # Debug iOS app
npm run flipper:android      # Start Flipper for Android debugging
npm run flipper:ios          # Start Flipper for iOS debugging
```

### Expo
```bash
npm run debug                # Start with debugging enabled
npm run debug:web            # Debug web version
```

## Performance Scripts

### React Native CLI
```bash
npm run bundle:android       # Generate Android bundle for analysis
npm run bundle:ios           # Generate iOS bundle for analysis
npm run analyze:android      # Analyze Android APK size
npm run analyze:ios          # Analyze iOS bundle size
```

### Expo
```bash
npm run analyze              # Analyze bundle size
npm run bundle:web           # Generate web bundle for analysis
```

## Environment Management

```bash
npm run env:development      # Switch to development environment
npm run env:staging          # Switch to staging environment  
npm run env:production       # Switch to production environment
```

## Git Hooks & Quality

```bash
npm run prepare              # Setup git hooks (Husky)
npm run precommit           # Pre-commit checks (lint + test)
npm run prepush             # Pre-push checks (type-check + test)
```

## Platform-Specific Considerations

### React Native CLI
- iOS scripts only work on macOS
- Android scripts require Android SDK
- Some scripts need Xcode command line tools
- CocoaPods required for iOS development

### Expo
- Web scripts work on all platforms
- EAS Build requires Expo account
- Some features need Expo development build
- Universal platform support

## Script Customization

All scripts can be customized in your project's `package.json`. The starter provides comprehensive scripts, but you can:

1. **Add custom scripts** for your specific workflow
2. **Modify existing scripts** to match your preferences  
3. **Remove unused scripts** to keep package.json clean
4. **Combine scripts** using npm-run-all or similar tools

## Environment Variables

Many scripts respect environment variables:

```bash
NODE_ENV=development npm start    # Development mode
NODE_ENV=production npm run build  # Production build
FLIPPER_DISABLE=1 npm run ios     # Disable Flipper
```

## CI/CD Scripts

For continuous integration:

```bash
npm run ci                       # Run full CI pipeline
npm run ci:test                  # CI test suite
npm run ci:build                 # CI build process
npm run ci:deploy                # CI deployment
```

## Troubleshooting Scripts

```bash
npm run doctor                   # Diagnose common issues
npm run reset:all               # Nuclear reset (clean everything)
npm run install:clean           # Clean install dependencies
```

---

**Note**: Some scripts may not be available depending on your project configuration and installed dependencies. Always check your `package.json` for the exact scripts available in your project.
