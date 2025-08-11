# 🚀 STC Expo Starter Template

**Internal React Native Expo template for Seventh Triangle Company projects**

*Enterprise-ready • TypeScript • Redux Toolkit • ScaledSheet Styling • Navigation • Best Practices*

---

## 🌟 What This Template Provides

> **Everything STC developers need for rapid Expo app development**

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

## 📐 ScaledSheet - Responsive UI Made Simple

**Why ScaledSheet?** Every STC app needs to work perfectly on all device sizes. ScaledSheet automatically converts numerical values to strings with device-appropriate scaling.

### Basic Usage

```javascript
import { ScaledSheet } from 'react-native-size-matters';

// ✅ Good - ScaledSheet handles conversion automatically
const styles = ScaledSheet.create({
  container: {
    padding: 20,           // → "20@s" → scales horizontally
    marginTop: 10,         // → "10@vs" → scales vertically  
    fontSize: 16,          // → "16@ms" → scales with font size
    borderRadius: 8,       // → "8@s" → scales horizontally
  },
  title: {
    fontSize: 24,          // Automatically becomes "24@ms"
    marginBottom: 15,      // Automatically becomes "15@vs"
  }
});
```

### Advanced Scaling Options

```javascript
// Manual scaling control (when you need it)
const styles = ScaledSheet.create({
  // Horizontal scaling for width, padding, margin
  container: {
    width: '300@s',        // Scale horizontally
    paddingHorizontal: '20@s',
  },
  
  // Vertical scaling for height, line height  
  text: {
    lineHeight: '24@vs',   // Scale vertically
    marginVertical: '10@vs',
  },
  
  // Font scaling (recommended for text)
  title: {
    fontSize: '18@ms',     // Moderate scale (font-friendly)
  },
  
  // Mixed scaling
  button: {
    width: '200@s',        // Horizontal scale
    height: '44@vs',       // Vertical scale
    fontSize: '16@ms',     // Font scale
  }
});
```

### ScaledSheet vs Regular StyleSheet

```javascript
// ❌ Regular StyleSheet - Fixed sizes, poor responsiveness
const regularStyles = StyleSheet.create({
  container: {
    padding: 20,           // Always 20dp, too small on tablets
    fontSize: 16,          // Always 16sp, hard to read on small phones
  }
});

// ✅ ScaledSheet - Responsive across all devices
const responsiveStyles = ScaledSheet.create({
  container: {
    padding: 20,           // Scales to device size automatically
    fontSize: 16,          // Scales for readability
  }
});
```

### Key Benefits for STC Projects

| Traditional StyleSheet | ScaledSheet | Benefit |
|----------------------|-------------|----------|
| `fontSize: 16` | `fontSize: 16` → `"16@ms"` | Text readable on all devices |
| `padding: 20` | `padding: 20` → `"20@s"` | Touch targets properly sized |
| `marginTop: 10` | `marginTop: 10` → `"10@vs"` | Consistent spacing |
| Manual device checks | Automatic scaling | No device-specific code needed |

### Real-World Example

```javascript
// src/components/ProductCard.js
import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  card: {
    padding: 16,           // Perfect padding on all devices
    marginBottom: 12,      // Consistent spacing
    borderRadius: 8,       // Proper corner radius
    minHeight: 120,        // Adequate touch area
  },
  title: {
    fontSize: 18,          // Readable title text
    marginBottom: 8,       // Good text separation
    lineHeight: 24,        // Proper line spacing
  },
  price: {
    fontSize: 16,          // Clear price display
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,          // Readable body text
    lineHeight: 20,        // Comfortable reading
    marginTop: 8,
  }
});
```

**The Result**: Your UI looks perfect on iPhone SE, iPhone 15 Pro Max, iPad, and Android tablets - without writing device-specific code.

## 🎯 STC Development Standards

**This template follows STC's proven patterns:**  
✅ **Tested** with React Native 0.72+  
✅ **Production-ready** for client projects  
✅ **Scalable architecture** for team development

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
| **STC Projects Using Template** | Growing | Faster delivery to clients |

## 🛠️ For STC Developers

**Getting Help:**
- Contact the development team for template issues
- Check internal documentation for project standards
- Follow STC coding guidelines when extending the template

**Template Maintenance:**
- Template is maintained by the STC development team
- Regular updates include latest React Native and Expo versions
- New features added based on project requirements

## 📄 License

**MIT License** - Free for personal and commercial use.

---

<div align="center">

**🏢 Seventh Triangle Company - Internal Development Template**

*Streamlining mobile development for STC projects*

</div>
