# @kaushalstc/rn-starter

🚀 **Unified React Native Starter** - Bootstrap a custom React Native app with your choice of CLI or Expo, complete with advanced UI, deep linking, and comprehensive project setup.

## Features

✨ **Unified Workflow**: Choose between React Native CLI or Expo based on your needs  
📱 **Platform Choice**: Interactive selection between bare React Native and managed Expo  
🎨 **Advanced UI Components**: Pre-configured with React Native Paper and custom theming  
🧭 **Navigation Ready**: React Navigation setup with stack navigation  
📦 **State Management**: Redux Toolkit integration  
🔗 **Deep Linking Support**: Configurable app schemes and universal links  
🎯 **TypeScript Support**: Full TypeScript configuration  
🚀 **Development Scripts**: Comprehensive npm scripts for building, testing, and deployment  
📋 **Environment Configuration**: .env file setup with examples  
🎆 **Git Integration**: Custom initial commit with project configuration details  

## Quick Start

```bash
npx @kaushalstc/rn-starter MyAwesomeApp [com.organization.myawesomeapp]
```

### Interactive Platform Selection

When you run the command, you'll be prompted to choose:

1. **React Native CLI** - Bare React Native with full native access
   - Best for apps requiring custom native modules
   - Full control over native code
   - Direct access to platform APIs

2. **Expo** - Managed workflow with simplified development
   - Great for rapid prototyping
   - Simplified build process
   - Rich ecosystem of pre-built modules

## Usage

### Basic Usage

```bash
npx @kaushalstc/rn-starter MyApp
```

### With Custom Package Name

```bash
npx @kaushalstc/rn-starter MyApp com.mycompany.myapp
```

## What's Included

### Common Features (Both CLI & Expo)
- 🎨 **React Native Paper** for Material Design components
- 🧭 **React Navigation** with stack navigation setup
- 📦 **Redux Toolkit** for state management  
- 🎯 **TypeScript** configuration
- 🔗 **Deep Linking** configuration (optional)
- 📋 **Environment Variables** setup
- 🚀 **Build Scripts** for development and production

### CLI-Specific Features
- 🔧 **Vector Icons** setup with react-native-vector-icons
- 📱 **Native Dependencies** with manual linking support
- 🍎 **CocoaPods** integration for iOS
- ⚡ **Worklets** support for advanced animations

### Expo-Specific Features  
- 🎨 **Expo Vector Icons** integration
- 🚀 **EAS Build** configuration
- 📱 **Expo Development Build** support
- 🌐 **Web Support** out of the box
- 📦 **Over-the-Air Updates** ready

## Project Structure

```
MyApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── store/          # Redux store setup
│   ├── services/       # API and external services
│   ├── utils/          # Helper utilities
│   └── types/          # TypeScript type definitions
├── assets/             # Images, fonts, and other assets
├── .env                # Environment variables
├── App.tsx             # Root component
└── package.json        # Dependencies and scripts
```

## Development Workflow

### React Native CLI Projects

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios
# or
npx react-native run-ios

# Run on Android  
npm run android
# or
npx react-native run-android

# Install iOS dependencies (macOS only)
npx pod-install
```

### Expo Projects

```bash
# Start development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web

# Build for production
npm run build:production

# Submit to app stores
npm run submit:production
```

## Deep Linking Configuration

The starter provides interactive deep linking setup for both platforms:

### Custom App Schemes
- Configure custom URL schemes (e.g., `myapp://`)
- Automatic native configuration for both platforms

### Universal Links
- iOS Associated Domains setup
- Android App Link configuration
- Automatic intent filters generation

### Platform-Specific Implementation

**React Native CLI**: 
- Direct native file modification (AndroidManifest.xml, Info.plist)
- Manual entitlements file creation for iOS

**Expo**:
- Automatic configuration in app.json
- EAS Build integration for production apps

## Package Name Guidelines

⚠️ **Important**: The starter validates package names and warns about iOS compatibility:

- ✅ **Recommended**: `com.company.appname` (3+ segments)
- ⚠️ **Discouraged**: `com.appname` (2 segments - may cause iOS issues)

### iOS Considerations
Two-segment package names can cause:
- App Store submission rejections
- TestFlight distribution issues  
- Xcode signing complications
- Deep linking problems

The starter will prompt you to update problematic package names before proceeding.

## Available Scripts

### Common Scripts (Both Platforms)
- `npm start` - Start development server
- `npm run clean` - Clean project cache
- `npm run reset` - Reset Metro bundler cache

### CLI-Specific Scripts
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run build:android` - Build Android APK/AAB
- `npm run build:ios` - Build iOS archive
- `npm run clean:android` - Clean Android build
- `npm run clean:ios` - Clean iOS build

### Expo-Specific Scripts
- `npm run android` - Run on Android with Expo
- `npm run ios` - Run on iOS with Expo  
- `npm run web` - Run on web browser
- `npm run build:development` - Build development client
- `npm run build:preview` - Build preview version
- `npm run build:production` - Build production version
- `npm run submit:production` - Submit to app stores

## Troubleshooting

### Common Issues

**Dependencies Installation**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Metro Bundler Issues**
```bash
# Reset Metro cache
npm start --reset-cache
# or for Expo
npx expo start --clear
```

**iOS CocoaPods Issues (CLI only)**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

**Android Build Issues**
```bash
cd android
./gradlew clean
```

## Platform Comparison

| Feature | React Native CLI | Expo |
|---------|------------------|------|
| **Setup Time** | Longer | Faster |
| **Native Modules** | Full access | Limited to Expo modules |
| **Custom Native Code** | ✅ | ⚠️ (Requires ejecting) |
| **Build Process** | Manual setup | EAS Build service |
| **OTA Updates** | Manual setup | Built-in |
| **Web Support** | Manual setup | Built-in |
| **File Size** | Smaller | Larger |
| **Learning Curve** | Steeper | Gentler |

## Requirements

- Node.js >= 16.0.0
- npm >= 7.0.0
- React Native development environment (for CLI projects)
- Expo CLI (automatically handled for Expo projects)

### Platform-Specific Requirements

**iOS Development (macOS only)**:
- Xcode 12+
- CocoaPods
- iOS 11+ target

**Android Development**:
- Android Studio
- Android SDK
- Java 11+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Kaushal Rathour](https://github.com/kaushalSTC)

## Support

- 🐛 [Report Issues](https://github.com/kaushalSTC/rn-starter/issues)
- 💬 [Discussions](https://github.com/kaushalSTC/rn-starter/discussions)
- 📧 Contact: [GitHub Profile](https://github.com/kaushalSTC)

---

**Made with ❤️ by Kaushal Rathour**

> 💡 **Tip**: Use `npx @kaushalstc/rn-starter` to always get the latest version!
