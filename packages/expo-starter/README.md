# 🚀 Expo Starter Template

**Professional React Native Expo template for rapid development**

*Enterprise-ready • TypeScript • Redux Toolkit • ScaledSheet Styling • Navigation • Best Practices*

---

## 🌟 What This Template Provides

> **Everything you need for rapid Expo app development**

✨ **35+ Carefully Curated NPM Scripts** for professional development workflow  
🏢 **Enterprise-grade Architecture** with TypeScript & Redux Toolkit  
🎨 **Beautiful UI Components** with React Native Paper  
📱 **Cross-platform Development** - iOS, Android & Web  
🚀 **EAS Build Ready** with pre-configured build profiles  
🔧 **Developer Tools** pre-configured (ESLint, Prettier, more)  
⚡ **Zero Config** - works immediately after installation

## 🚀 Quick Start - Two Installation Methods

### Method 1: Basic App Creation
```bash
# Create app with default package name
npx @kaushalstc/expo-starter MyAwesomeApp
```

### Method 2: Custom Package Name (Recommended)
```bash
# Create app with custom package identifier
npx @kaushalstc/expo-starter MyAwesomeApp com.company.myawesomeapp
```

**Then run your app:**
```bash
cd MyAwesomeApp

# Launch on your preferred platform
npm start        # Start Expo development server
npm run ios      # iOS Simulator
npm run android  # Android Emulator  
npm run web      # Web browser
```

## 📋 What You Get Instantly

### 🎯 Complete Development Workflow
| Category | What's Included | Time Saved |
|----------|----------------|------------|
| **🏗️ Architecture** | TypeScript, Redux Toolkit, Navigation | 3-4 hours |
| **🎨 UI Framework** | React Native Paper, Expo Vector Icons, Toast | 2-3 hours |
| **⚙️ Developer Tools** | ESLint, Prettier, 60+ NPM scripts | 2-3 hours |
| **📱 Platform Setup** | iOS/Android configs, responsive scaling | 1-2 hours |
| **🔧 Build Tools** | Gradle scripts, Xcode configs, cleaning tools | 1-2 hours |

**Total time saved: 8-14 hours per project!**

### 🎯 Everything You Need. Nothing You Don't.

| Feature | Benefit | Ready-to-Use |
|---------|---------||--------------|
| **🚀 Production-Ready Architecture** | Scalable folder structure | ✅ |
| **🧭 React Navigation v6** | Type-safe routing | ✅ |
| **📦 Redux Toolkit** | Modern state management | ✅ |
| **🎨 React Native Paper** | Beautiful Material Design | ✅ |
| **📱 Responsive Scaling** | Perfect UI on all devices | ✅ |
| **🔔 Toast Notifications** | User feedback system | ✅ |

## 🏃‍♂️ Get Started in 60 Seconds

1. **Create your app**:
```bash
npx @kaushalstc/expo-starter MyApp
```

2. **Navigate and launch**:
```bash
cd MyApp
npm start        # Start Expo development server
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```



### 📂 Intelligent Project Structure
```
src/
├── components/      # Reusable UI
├── navigation/      # Routing system
├── redux/           # State management
├── screens/         # App views
├── services/        # API layer
├── theme/           # Design system
└── utils/           # Helpers & hooks
```

## 📐 ScaledSheet + Theme System - Perfect UI on Every Device

**Why ScaledSheet?** This template ensures your app works perfectly on all device sizes using predefined constants and automatic scaling.

### 🎨 Theme System with Dark/Light Mode

The template includes a complete theme system with automatic dark/light mode support:

```javascript
// Colors are automatically managed by Redux theme state
const {colors} = useSelector((state) => state.theme);

// All colors adapt to theme changes:
colors.textPrimary     // White in dark mode, black in light mode
colors.surface         // Dark surface in dark mode, light in light mode
colors.primary         // Consistent across themes
```

### 📏 Using FontSize & Spacing Constants

**✅ Recommended**: Use predefined constants for consistent scaling:

```javascript
import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';

const styles = ScaledSheet.create({
  container: {
    padding: `${Spacing.md}@s`,           // Uses predefined medium spacing
    marginTop: `${Spacing.sm}@vs`,        // Uses small vertical spacing
  },
  title: {
    fontSize: `${FontSize.large}@ms`,     // Uses large font size with scaling
    marginBottom: `${Spacing.xs}@vs`,     // Uses extra small spacing
  }
});
```

### 🔧 Available Constants

**FontSize Constants:**
```javascript
FontSize.xs     // 12  → "12@ms"
FontSize.small  // 14  → "14@ms" 
FontSize.medium // 16  → "16@ms"
FontSize.large  // 20  → "20@ms"
FontSize.xl     // 24  → "24@ms"
```

**Spacing Constants:**
```javascript
Spacing.xs   // 4   → "4@s" or "4@vs"
Spacing.sm   // 8   → "8@s" or "8@vs"
Spacing.md   // 16  → "16@s" or "16@vs"
Spacing.lg   // 24  → "24@s" or "24@vs"
Spacing.xl   // 32  → "32@s" or "32@vs"
```

### 🎯 Best Practices

```javascript
// ✅ GOOD: Use constants for consistency
const styles = ScaledSheet.create({
  container: {
    padding: `${Spacing.md}@s`,
    fontSize: `${FontSize.medium}@ms`,
  }
});

// ❌ AVOID: Direct numbers (but still works)
const styles = ScaledSheet.create({
  container: {
    padding: 16,  // Works, but use Spacing.md instead
    fontSize: 16, // Works, but use FontSize.medium instead
  }
});
```

### 🌙 Theme Toggle Integration

Every screen includes a theme toggle button demonstrating the theming system:

```javascript
// Theme colors automatically update across the entire app
const {colors} = useSelector((state) => state.theme);
const dispatch = useDispatch();

const toggleTheme = () => {
  dispatch(toggleThemeMode()); // Switches between light/dark
};
```

**The Result**: Consistent spacing, perfect typography, and beautiful themes that work flawlessly across iPhone SE, iPhone 15 Pro Max, iPad, and Android tablets.

## 🎯 Production Standards

**This template follows industry best practices:**  
✅ **Tested** with React Native 0.72+  
✅ **Production-ready** architecture  
✅ **Scalable** for team development  
✅ **Theme system** with dark/light mode

## ⚡ 50+ NPM Scripts - Your Complete Toolkit

> **Carefully curated scripts for professional Expo development**

### 🚀 Development Commands
```bash
# Basic development
npm start              # Start Expo development server
npm run start:clear    # Start Expo with cleared cache
npm run android        # Run on Android emulator/device
npm run ios            # Run on iOS simulator
npm run web            # Run on web browser
npm test               # Run Jest tests

# Code quality
npm run lint           # Check code with ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

### 🏢 Build & Release Commands
```bash
# Android builds
npm run android:debug          # Build debug APK
npm run android:release         # Build release APK
npm run android:bundle          # Build release AAB (Google Play)
npm run android:clean           # Clean Android build
npm run android:clean-release   # Clean + build release

# iOS builds  
npm run ios:debug      # Build iOS debug
npm run ios:release    # Build iOS release
npm run ios:archive    # Archive for App Store

# Quick release builds
npm run release:android    # Clean + release Android
npm run release:ios        # Clean + release iOS
```

### 🚀 EAS Build Commands (Cloud Builds)
```bash
# EAS Build profiles - Production ready!
npm run build:development      # Build development client
npm run build:preview          # Build preview for internal testing
npm run build:production       # Build production release
npm run submit:production      # Submit to app stores
```

### 📦 Package Management & Dependencies
```bash
# CocoaPods (iOS)
npm run pod              # Install pods
npm run pod:clean        # Clean + reinstall pods

# APK/AAB management (auto-opens folders)
npm run apk:debug        # Generate debug APK + open folder
npm run apk:release      # Generate release APK + open folder  
npm run aab:release      # Generate release AAB + open folder
```

### 🧹 Cleaning & Reset Commands
```bash
# Comprehensive cleaning
npm run clean            # Clean everything
npm run clean:all        # Clean everything + pods

# Specific cleaning
npm run android:clean    # Clean Android build files
npm run ios:clean        # Clean iOS build files + Xcode cache
npm run metro:clean      # Clear Metro bundler cache
npm run modules:clean    # Reinstall node_modules
npm run pods:clean       # Clean + reinstall CocoaPods
```

### 🔧 Development Tools & Utilities
```bash
# System diagnostics
npm run info             # React Native environment info
npm run doctor           # Diagnose React Native setup
npm run flipper          # Open Flipper debugger

# Advanced tools
npm run gradle:wrapper     # Update Gradle wrapper
npm run gradle:refresh     # Refresh Gradle dependencies
npm run metro:clear        # Clear Metro cache
npm run watchman:clear     # Clear Watchman cache
```

### 🎯 Pro Tips for Maximum Productivity

**Daily Development:**
```bash
# Start your day
npm run dev:ios          # Fastest way to start development

# When things go wrong
npm run clean:all        # Nuclear option - fixes 90% of issues
npm run doctor           # Diagnose environment problems
```

**Release Preparation:**
```bash
# Perfect release workflow
npm run lint:fix         # Fix code issues
npm run format           # Format code
npm run clean:all        # Clean everything
npm run release:android  # Build release Android
npm run release:ios      # Build release iOS
```

**Performance Issues:**
```bash
# Clear everything and start fresh
npm run watchman:clear   # Clear file watcher
npm run metro:clear      # Clear bundler cache
npm run clean:modules    # Fresh node_modules
```

## 🔧 Troubleshooting

### Pod Install Issues (iOS)

**Problem**: `Unable to find a specification for RNWorklets depended upon by RNReanimated`

**Solution**: This template uses `react-native-reanimated@3.19.0` to prevent this issue. If you still encounter problems:

```bash
# Method 1: Update pod repos
cd ios && pod install --repo-update

# Method 2: Clean and reinstall
cd ios && rm -rf Pods Podfile.lock && pod install

# Method 3: Reset pod cache
pod cache clean --all && pod install
```

**Why this happens**: Newer versions of `react-native-reanimated` depend on `RNWorklets`, but dependency resolution can fail. Our template pins to a stable version.

### Common npm Install Errors

```bash
# ❌ Wrong syntax
npm install "react-native-reanimated": "^3.19.0"

# ✅ Correct syntax  
npm install react-native-reanimated@3.19.0
```

### Metro Bundle Issues

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Clean build folders
cd android && ./gradlew clean && cd ..
cd ios && xcodebuild clean && cd ..
```


## 📈 Template Benefits

| Metric | Value | Impact |
|--------|-------|--------|
| **Average Setup Time** | 30 seconds | vs 8+ hours manual setup |
| **Scripts Included** | 60+ | vs 5-10 in typical projects |
| **Dependencies Pre-configured** | 15+ | Production-ready out of box |
| **Development Speed** | 3x faster | Skip boilerplate setup |

## 📄 License

**MIT License** - Free for personal and commercial use.
