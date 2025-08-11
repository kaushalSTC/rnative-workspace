# Scalable App Architecture Guide

## Overview

This monorepo demonstrates a scalable React Native architecture using **React Navigation** and **shared packages**. The architecture is designed to support multiple apps (customer app, admin app, etc.) that share common UI components, business logic, and API integrations.

## Monorepo Structure

```
rnative-workspace/
├── packages/
│   ├── expo-starter/          # CLI tool for bootstrapping apps
│   ├── shared-ui/             # Shared UI components & theming
│   ├── shared-logic/          # API calls, Redux slices, utilities
│   └── cli-starter/           # Additional CLI utilities
├── apps/                      # Individual applications (create as needed)
│   ├── customer-app/          # Customer-facing app
│   └── admin-app/             # Admin/management app
└── docs/                      # Documentation
```

## Package Architecture

### 1. @kaushalrathour/shared-ui

**Purpose**: Provides reusable UI components, theming, and design system.

**Key Features**:
- 🎨 **Theming System**: Light/dark theme support with customizable colors
- 📱 **Responsive Design**: Size-aware components using react-native-size-matters
- 🧩 **Component Library**: Button, Card, Text, and more
- 🎯 **TypeScript Support**: Full type safety for all components

**Usage Example**:
```tsx
import { Button, Card, Text, ThemeProvider } from '@kaushalrathour/shared-ui';

export default function App() {
  return (
    <ThemeProvider>
      <Card>
        <Text variant="heading">Welcome</Text>
        <Button 
          title="Get Started" 
          onPress={() => {}} 
          variant="primary" 
          size="large" 
        />
      </Card>
    </ThemeProvider>
  );
}
```

**Directory Structure**:
```
shared-ui/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Text.tsx
│   ├── theme/               # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── hooks/               # Custom hooks
│   │   └── useTheme.ts
│   └── context/             # React contexts
│       └── ThemeContext.tsx
└── index.js                 # Main export
```

### 2. @kaushalrathour/shared-logic

**Purpose**: Provides business logic, API integrations, Redux state management, and utility functions.

**Key Features**:
- 🔄 **Redux Toolkit**: Modern Redux with slices and async thunks
- 🌐 **API Client**: Axios-based client with interceptors
- 🔒 **Authentication**: User management and auth flows
- 🛠️ **Utilities**: Formatting, validation, and helper functions
- 📊 **State Management**: Centralized app and user state

**Usage Example**:
```tsx
import { 
  createStore, 
  createApiClient, 
  UserService, 
  formatDate, 
  validateEmail 
} from '@kaushalrathour/shared-logic';

// Setup store
const store = createStore();

// Setup API client
const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
});

const userService = new UserService(apiClient);

// Use utilities
const isValidEmail = validateEmail('user@example.com');
const formattedDate = formatDate(new Date());
```

**Directory Structure**:
```
shared-logic/
├── src/
│   ├── api/                 # API clients and services
│   │   ├── client.ts
│   │   └── userService.ts
│   ├── redux/               # Redux configuration
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── userSlice.ts
│   │       └── appSlice.ts
│   ├── types/               # TypeScript definitions
│   │   └── user.ts
│   └── utils/               # Utility functions
│       ├── formatting.ts
│       └── validation.ts
└── index.js                 # Main export
```

## How to Scale This Architecture

### 1. Creating Multiple Apps

Each app in your monorepo can consume the shared packages:

```bash
# Create a new app
mkdir apps/customer-app
cd apps/customer-app

# Generate using expo-starter CLI
npx @kaushalrathour/expo-starter CustomerApp

# Add shared packages as dependencies
npm install @kaushalrathour/shared-ui @kaushalrathour/shared-logic
```

### 2. App-Specific Customization

**Theme Customization**:
```tsx
// apps/customer-app/src/theme.ts
import { createTheme } from '@kaushalrathour/shared-ui';

export const customerTheme = createTheme(false, {
  colors: {
    primary: '#FF6B35',    // Custom brand color
    secondary: '#004E89',
  }
});

// In your app root
<ThemeProvider initialTheme={customerTheme}>
  <App />
</ThemeProvider>
```

**Custom API Configuration**:
```tsx
// apps/customer-app/src/api.ts
import { createApiClient, UserService } from '@kaushalrathour/shared-logic';

const apiClient = createApiClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'X-App-Type': 'customer',
  }
});

export const userService = new UserService(apiClient);
```

### 3. Adding New Shared Components

When you need a new component that multiple apps will use:

```bash
# Add to shared-ui
cd packages/shared-ui/src/components
```

Create the component:
```tsx
// packages/shared-ui/src/components/Avatar.tsx
import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getInitials } from '@kaushalrathour/shared-logic';

export const Avatar = ({ user, size = 40 }) => {
  const theme = useTheme();
  // Component implementation
};
```

Export it:
```tsx
// packages/shared-ui/src/components/index.ts
export * from './Avatar';
```

### 4. React Navigation Integration

The shared packages work seamlessly with React Navigation (as used in expo-starter):

```tsx
// apps/customer-app/src/screens/Profile/Profile.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Card } from '@kaushalrathour/shared-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@kaushalrathour/shared-logic';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const Profile: React.FC<Props> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  return (
    <ScrollView style={{ flex: 1 }}>
      <Card style={{ margin: 16 }}>
        <Text variant="heading">Profile</Text>
        <Text>{user?.firstName} {user?.lastName}</Text>
        <Button 
          title="Edit Profile" 
          onPress={() => navigation.navigate('EditProfile')} 
        />
      </Card>
    </ScrollView>
  );
};
```

**Navigation Setup with Shared Components:**
```tsx
// apps/customer-app/src/navigation/StackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@kaushalrathour/shared-ui';
import { Home } from '../screens/Home/Home';
import { Profile } from '../screens/Profile/Profile';
import { Settings } from '../screens/Settings/Settings';

const Stack = createNativeStackNavigator();

export const StackNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeights.semibold,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};
```

### 5. Deep Linking Strategy

Configure deep links that work across all apps:

```json
// apps/customer-app/app.json
{
  "expo": {
    "scheme": "customerapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

```json
// apps/admin-app/app.json
{
  "expo": {
    "scheme": "adminapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## Benefits of This Architecture

### 🔄 **Code Reusability**
- Share 70-80% of code between apps
- Consistent UI/UX across applications
- Single source of truth for business logic

### 🚀 **Development Speed**
- Faster feature development
- Consistent patterns and APIs
- Shared debugging and testing

### 🔧 **Maintainability**
- Centralized updates affect all apps
- Type safety across packages
- Clear separation of concerns

### 📱 **Multi-Platform**
- Works with React Navigation
- Native iOS/Android support
- Web compatibility

### 🏗️ **Scalability**
- Easy to add new apps
- Team can work independently on packages
- Gradual migration of legacy code

## Best Practices

### 1. Package Versioning
```bash
# Update shared packages together
pnpm -r version patch
pnpm -r publish
```

### 2. Development Workflow
```bash
# Test changes across all packages
pnpm test
pnpm build

# Link local packages for development
pnpm link --global
```

### 3. Type Safety
Always export types from shared packages:
```tsx
// shared-ui/index.js
export type { ButtonProps, ThemeColors } from './src/components/Button';
```

### 4. Documentation
Keep package READMEs updated with:
- Installation instructions
- Usage examples
- API documentation
- Breaking changes

## Getting Started

1. **Clone this monorepo**
2. **Install dependencies**: `pnpm install`
3. **Create your first app**: `node packages/expo-starter/bin/index.js MyApp`
4. **Add shared packages**: `npm install @kaushalrathour/shared-ui @kaushalrathour/shared-logic`
5. **Start building**: Follow the examples above

This architecture provides a solid foundation for scaling React Native applications while maintaining consistency and developer productivity.
