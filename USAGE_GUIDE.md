# How to Use Expo Starter with Shared Packages

## 🚀 Quick Start for Developers

### Step 1: Create a New App

```bash
# Install the CLI globally
npm install -g @kaushalstc/expo-starter

# Or use with npx (recommended)
npx @kaushalstc/expo-starter MyAwesomeApp
```

This generates a complete React Native app with:
- ✅ React Navigation setup
- ✅ Redux Toolkit configuration  
- ✅ TypeScript support
- ✅ Deep linking configured
- ✅ EAS Build ready

### Step 2: Add Shared Packages

```bash
cd MyAwesomeApp

# Add the shared UI and logic packages
npm install @kaushalstc/shared-ui @kaushalstc/shared-logic

# Or with yarn
yarn add @kaushalstc/shared-ui @kaushalstc/shared-logic
```

### Step 3: Integrate Shared Components

Replace your existing components with shared ones:

#### **Before (generated app):**
```tsx
// src/screens/Home/Home.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### **After (with shared packages):**
```tsx
// src/screens/Home/Home.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card } from '@kaushalstc/shared-ui';
import { useTheme } from '@kaushalstc/shared-ui';

export const Home = ({ navigation }) => {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Card>
        <Text variant="heading" align="center">
          Welcome to MyApp
        </Text>
        <Text variant="body" style={{ marginVertical: 16 }}>
          This app is built with shared UI components and theming!
        </Text>
        <Button 
          title="Go to Profile" 
          onPress={() => navigation.navigate('Profile')}
          variant="primary"
          size="large"
        />
      </Card>
    </ScrollView>
  );
};
```

### Step 4: Setup Theme Provider

Wrap your app with the theme provider:

```tsx
// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@kaushalstc/shared-ui';
import { createStore } from '@kaushalstc/shared-logic';
import { NavigationContainer } from './src/navigation/NavigationContainer';

const store = createStore();

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer />
      </ThemeProvider>
    </Provider>
  );
}
```

### Step 5: Use Shared Logic

Replace your Redux setup with shared logic:

```tsx
// src/screens/Profile/Profile.tsx
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card } from '@kaushalstc/shared-ui';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, 
  getCurrentUser, 
  formatDate 
} from '@kaushalstc/shared-logic';

export const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Card style={{ margin: 16 }}>
        <Text>Loading profile...</Text>
      </Card>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Card>
        <Text variant="heading">Profile</Text>
        {currentUser && (
          <>
            <Text variant="subheading">
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text variant="caption">
              Member since {formatDate(currentUser.createdAt)}
            </Text>
          </>
        )}
        <Button 
          title="Edit Profile" 
          onPress={() => navigation.navigate('EditProfile')}
          variant="outline"
        />
      </Card>
    </ScrollView>
  );
};
```

## 🎨 **Customization Options**

### Custom Theme
```tsx
// src/theme/customTheme.ts
import { createTheme } from '@kaushalstc/shared-ui';

export const myAppTheme = createTheme(false, {
  colors: {
    primary: '#FF6B35',
    secondary: '#004E89',
    success: '#32CD32',
  }
});

// In App.tsx
<ThemeProvider initialTheme={myAppTheme}>
  <NavigationContainer />
</ThemeProvider>
```

### Custom API Configuration
```tsx
// src/api/config.ts
import { createApiClient, UserService } from '@kaushalstc/shared-logic';

const apiClient = createApiClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.myapp.com',
  timeout: 15000,
  headers: {
    'X-App-Version': '1.0.0',
  }
});

export const userService = new UserService(apiClient);
```

## 🛠️ **Migration Guide**

### From Basic Expo Starter to Shared Packages

1. **Install packages**: `npm install @kaushalstc/shared-ui @kaushalstc/shared-logic`

2. **Replace components gradually**:
   - `<Text>` → `<Text variant="body">`
   - `<TouchableOpacity>` → `<Button variant="primary">`
   - Custom cards → `<Card>`

3. **Update Redux store**:
   ```tsx
   // Before
   import { store } from './src/redux/store';
   
   // After
   import { createStore } from '@kaushalstc/shared-logic';
   const store = createStore();
   ```

4. **Add theme provider**: Wrap your app root

5. **Update navigation styling**:
   ```tsx
   import { useTheme } from '@kaushalstc/shared-ui';
   
   const theme = useTheme();
   // Use theme.colors in navigation options
   ```

## 📦 **Package Versions & Compatibility**

| Package | Version | React Native | Expo SDK |
|---------|---------|-------------|----------|
| @kaushalstc/shared-ui | ^1.0.0 | >=0.70 | >=47 |
| @kaushalstc/shared-logic | ^1.0.0 | >=0.70 | >=47 |
| @kaushalstc/expo-starter | ^3.0.0 | Latest | Latest |

## 🔧 **Development Workflow**

### Testing Changes Locally

If you're developing or contributing to the packages:

```bash
# Clone the monorepo
git clone https://github.com/kaushalSTC/rnative-workspace.git
cd rnative-workspace

# Install dependencies
pnpm install

# Link packages globally for testing
cd packages/shared-ui && pnpm link --global
cd packages/shared-logic && pnpm link --global

# In your test app
pnpm link --global @kaushalstc/shared-ui
pnpm link --global @kaushalstc/shared-logic
```

### Building from Source

```bash
# Build all packages
pnpm build

# Test all packages  
pnpm test

# Run linting
pnpm lint
```

## 🆘 **Troubleshooting**

### Common Issues

**Metro bundler issues with symlinked packages:**
```bash
npx expo start --clear
# or
rm -rf node_modules && npm install
```

**TypeScript errors:**
```bash
# Ensure you have the right TypeScript version
npm install -D typescript@~4.9.0
```

**Theme not applying:**
```tsx
// Make sure ThemeProvider wraps your entire app
<ThemeProvider>
  <YourAppRoot />
</ThemeProvider>
```

**Redux store conflicts:**
```tsx
// Don't mix the generated store with shared-logic store
// Use only: createStore() from @kaushalstc/shared-logic
```

## 📚 **Examples**

### Complete Screen Example
```tsx
import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  useTheme 
} from '@kaushalstc/shared-ui';
import { 
  useSelector, 
  useDispatch 
} from 'react-redux';
import { 
  RootState, 
  logout, 
  validateEmail,
  formatDate 
} from '@kaushalstc/shared-logic';

export const Settings = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logout())
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16 }}>
        <Text variant="heading">Settings</Text>
        
        {currentUser && (
          <Card style={{ marginVertical: 16 }} padding="small">
            <Text variant="subheading">Account Info</Text>
            <Text>Email: {currentUser.email}</Text>
            <Text variant="caption">
              Joined: {formatDate(currentUser.createdAt)}
            </Text>
          </Card>
        )}

        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('Profile')}
          variant="outline"
          style={{ marginBottom: 12 }}
        />

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
        />
      </Card>
    </ScrollView>
  );
};
```

## 🎯 **Next Steps**

After setting up shared packages:

1. **Customize your theme** to match your brand
2. **Configure API endpoints** for your backend
3. **Add authentication flows** using shared-logic
4. **Build additional screens** with shared components
5. **Deploy with EAS Build** (already configured in expo-starter)

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/kaushalSTC/rnative-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kaushalSTC/rnative-workspace/discussions)
- **Documentation**: [Architecture Guide](./ARCHITECTURE.md)
