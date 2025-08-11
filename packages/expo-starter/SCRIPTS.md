# 📋 Complete NPM Scripts Guide

> **35+ carefully curated scripts for professional React Native development**

This document provides detailed explanations of all the npm scripts included in projects created with this template.

## 🚀 Quick Reference

```bash
# Most used commands
npm start              # Start Metro bundler
npm run android        # Run on Android  
npm run ios            # Run on iOS
npm run clean:all      # Fix most issues
npm run doctor         # Diagnose problems
```

---

## 📱 Development Scripts

### Basic Development
| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `react-native start` | Start Metro bundler |
| `start:reset` | `react-native start --reset-cache` | Start Metro with cache reset |
| `android` | `react-native run-android` | Run on Android emulator/device |
| `ios` | `react-native run-ios` | Run on iOS simulator |
| `test` | `jest` | Run Jest tests |

### Code Quality
| Script | Command | Purpose |
|--------|---------|---------|
| `lint` | `eslint .` | Check code with ESLint |
| `lint:fix` | `eslint . --fix` | Auto-fix ESLint issues |
| `format` | `prettier --write '**/*.{js,jsx,ts,tsx,json,md}'` | Format code with Prettier |
| `format:check` | `prettier --check '**/*.{js,jsx,ts,tsx,json,md}'` | Check code formatting |

---

## 🏗️ Build & Release Scripts

### Android Builds
| Script | Command | Purpose |
|--------|---------|---------|
| `android:debug` | `cd android && ./gradlew assembleDebug` | Build debug APK |
| `android:release` | `cd android && ./gradlew assembleRelease` | Build release APK |
| `android:bundle` | `cd android && ./gradlew bundleRelease` | Build release AAB |
| `android:clean` | `cd android && ./gradlew clean` | Clean Android build |
| `android:clean-release` | `cd android && ./gradlew clean && ./gradlew assembleRelease` | Clean + build release |

### iOS Builds
| Script | Command | Purpose |
|--------|---------|---------|
| `ios:debug` | `npx react-native build-ios --mode=Debug` | Build iOS debug |
| `ios:release` | `npx react-native build-ios --mode=Release` | Build iOS release |
| `ios:archive` | `cd ios && xcodebuild -workspace ... archive` | Archive for App Store |

### Quick Release Builds
| Script | Command | Purpose |
|--------|---------|---------|
| `release:android` | `npm run android:clean && npm run android:release` | Clean + release Android |
| `release:ios` | `npm run ios:clean && npm run ios:release` | Clean + release iOS |

---

## 📦 Package & Asset Management

### CocoaPods Management
| Script | Command | Purpose |
|--------|---------|---------|
| `pod` | `npx pod-install` | Install CocoaPods dependencies |
| `pod:clean` | `cd ios && rm -rf Pods && ... && npx pod-install` | Clean + reinstall pods |

### APK/AAB Management
| Script | Command | Purpose |
|--------|---------|---------|
| `apk:debug` | `cd android && ./gradlew assembleDebug && open ...` | Generate + open debug APK |
| `apk:release` | `cd android && ./gradlew assembleRelease && open ...` | Generate + open release APK |
| `aab:release` | `cd android && ./gradlew bundleRelease && open ...` | Generate + open release AAB |

---

## 🧹 Cleaning & Reset Scripts

### Comprehensive Cleaning
| Script | Command | Purpose |
|--------|---------|---------|
| `clean` | `npm run android:clean && npm run ios:clean && npm run metro:clean && npm run modules:clean` | Clean Android + iOS + Metro + modules |
| `clean:all` | `npm run clean && npm run pods:clean` | Nuclear clean option |

### Specific Cleaning
| Script | Command | Purpose |
|--------|---------|---------|
| `android:clean` | `cd android && ./gradlew clean` | Clean Android build files |
| `ios:clean` | `cd ios && xcodebuild clean && rm -rf build && rm -rf ~/Library/Developer/Xcode/DerivedData` | Clean iOS + Xcode cache |
| `metro:clean` | `npx react-native start --reset-cache` | Clear Metro cache |
| `modules:clean` | `rm -rf node_modules && npm install` | Reinstall dependencies |
| `pods:clean` | `cd ios && rm -rf Pods && rm -rf ~/Library/Developer/Xcode/DerivedData && cd .. && npx pod-install` | Clean + reinstall pods |

---

## 🔧 Developer Tools & Utilities

### Code Quality
| Script | Command | Purpose |
|--------|---------|---------|
| `lint` | `eslint .` | Check code with ESLint |
| `lint:fix` | `eslint . --fix` | Auto-fix ESLint issues |
| `format` | `prettier --write '**/*.{js,jsx,ts,tsx,json,md}'` | Format code |
| `format:check` | `prettier --check '**/*.{js,jsx,ts,tsx,json,md}'` | Check formatting |

### System Diagnostics
| Script | Command | Purpose |
|--------|---------|---------|
| `info` | `npx react-native info` | Environment information |
| `doctor` | `npx react-native doctor` | Diagnose setup issues |
| `flipper` | `npx react-native flipper` | Open Flipper debugger |

### Advanced Tools
| Script | Command | Purpose |
|--------|---------|---------|
| `gradle:wrapper` | `cd android && ./gradlew wrapper --gradle-version=8.0.2` | Update Gradle wrapper |
| `gradle:refresh` | `cd android && ./gradlew --refresh-dependencies` | Refresh Gradle deps |
| `metro:clear` | `npx react-native start --reset-cache` | Clear Metro cache |
| `watchman:clear` | `watchman watch-del-all` | Clear Watchman cache |

### Hooks
| Script | Command | Purpose |
|--------|---------|---------|
| `postinstall` | `npx patch-package && npx pod-install` | Auto-run after npm install |

---

## 🎯 Workflow Examples

### Daily Development Workflow
```bash
# Start your development session
npm start                # Start Metro bundler
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator

# When you encounter issues
npm run doctor         # Check environment
npm run metro:clean    # Clear Metro cache
npm run clean:all      # Nuclear option
```

### Code Quality Workflow
```bash
# Before committing
npm run lint:fix       # Fix code issues
npm run format         # Format code
npm test              # Run tests
```

### Release Preparation Workflow
```bash
# Prepare for release
npm run lint:fix       # Clean up code
npm run format         # Format everything
npm run clean:all      # Start fresh
npm run test          # Ensure tests pass

# Build releases
npm run release:android # Android release
npm run release:ios     # iOS release
```

### Debugging Workflow
```bash
# When things break
npm run info          # Check environment
npm run doctor        # Diagnose issues
npm run metro:clean   # Clear Metro cache
npm run modules:clean # Fresh dependencies
npm run pod:clean     # Clean iOS pods
```

---

## 🚨 Troubleshooting with Scripts

### Common Issues & Solutions

**Metro bundler issues:**
```bash
npm run metro:clean
npm run watchman:clear
```

**Android build failures:**
```bash
npm run android:clean
npm run gradle:refresh
```

**iOS build failures:**
```bash
npm run ios:clean
npm run pod:clean
```

**Dependency conflicts:**
```bash
npm run modules:clean
npm run pod:clean
```

**General issues (nuclear option):**
```bash
npm run clean:all
```

---

## 💡 Pro Tips

1. **Use `android` and `ios` scripts for basic development**
2. **Keep `npm run clean:all` handy for major issues**
3. **Run `npm run doctor` when environment seems broken**
4. **Use specific clean scripts instead of full clean when possible**
5. **The `postinstall` script runs automatically after `npm install`**
6. **Use `start:reset` instead of `start` when cache issues occur**
7. **APK/AAB scripts automatically open output folders for convenience**

---

## 🔄 Script Dependencies

Some scripts depend on others. Here's the dependency chain:

```
clean:all → clean + pods:clean
clean → android:clean + ios:clean + metro:clean + modules:clean
release:android → android:clean + android:release
release:ios → ios:clean + ios:release
android:clean-release → android:clean + android:release
postinstall → patch-package
```

---

## 📚 Additional Resources

- [React Native CLI Documentation](https://reactnative.dev/docs/cli)
- [Gradle Documentation](https://gradle.org/docs/)
- [Xcode Build Settings](https://developer.apple.com/documentation/xcode)
- [Metro Bundler](https://facebook.github.io/metro/)
- [CocoaPods Documentation](https://cocoapods.org/)
