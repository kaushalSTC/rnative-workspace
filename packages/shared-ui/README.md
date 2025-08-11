# @kaushalrathour/shared-ui

Shared UI components and theming system for React Native apps.

## 🎨 Features

- **Component Library**: Button, Card, Text with consistent styling
- **Theming System**: Light/dark theme support with customizable colors
- **Responsive Design**: Size-aware components using react-native-size-matters
- **TypeScript Support**: Full type safety for all components
- **React Navigation Integration**: Theme-aware navigation styling

## 📦 Installation

```bash
npm install @kaushalrathour/shared-ui
# or
yarn add @kaushalrathour/shared-ui
```

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-native
```

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider } from '@kaushalrathour/shared-ui';
import { YourApp } from './YourApp';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use components in your screens

```tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card, useTheme } from '@kaushalrathour/shared-ui';

export const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16 }}>
        <Text variant="heading">Welcome!</Text>
        <Text variant="body" style={{ marginVertical: 16 }}>
          This is built with shared UI components.
        </Text>
        <Button
          title="Get Started"
          variant="primary"
          size="large"
          onPress={() => navigation.navigate('Profile')}
        />
      </Card>
    </ScrollView>
  );
};
```

## 📚 Components

### Button

```tsx
import { Button } from '@kaushalrathour/shared-ui';

<Button 
  title="Click me" 
  variant="primary"     // primary | secondary | outline
  size="medium"         // small | medium | large
  onPress={() => {}} 
  loading={false}
  disabled={false}
/>
```

### Card

```tsx
import { Card } from '@kaushalrathour/shared-ui';

<Card 
  padding="medium"      // none | small | medium | large
  elevation={2}         // Shadow depth
  style={{ margin: 16 }}
>
  {/* Your content */}
</Card>
```

### Text

```tsx
import { Text } from '@kaushalrathour/shared-ui';

<Text 
  variant="body"        // body | caption | heading | subheading | title
  color="primary"       // primary | secondary | error | success | warning
  weight="regular"      // light | regular | medium | semibold | bold
  align="left"          // left | center | right
>
  Your text content
</Text>
```

## 🎨 Theming

### Using the built-in themes

```tsx
import { ThemeProvider, defaultLightTheme, defaultDarkTheme } from '@kaushalrathour/shared-ui';

// Light theme (default)
<ThemeProvider initialTheme={defaultLightTheme}>
  <App />
</ThemeProvider>

// Dark theme
<ThemeProvider initialTheme={defaultDarkTheme}>
  <App />
</ThemeProvider>
```

### Creating custom themes

```tsx
import { createTheme, ThemeProvider } from '@kaushalrathour/shared-ui';

const customTheme = createTheme(false, {
  colors: {
    primary: '#FF6B35',
    secondary: '#004E89',
    background: '#F8F9FA',
  }
});

<ThemeProvider initialTheme={customTheme}>
  <App />
</ThemeProvider>
```

### Accessing theme in components

```tsx
import { useTheme } from '@kaushalrathour/shared-ui';

export const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>
        Themed content
      </Text>
    </View>
  );
};
```

## 🔄 React Navigation Integration

```tsx
import { useTheme } from '@kaushalrathour/shared-ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
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
      {/* Your screens */}
    </Stack.Navigator>
  );
};
```

## 📖 API Reference

### Theme Colors
- `primary`, `secondary` - Brand colors
- `background`, `surface`, `card` - Background colors
- `text`, `textSecondary` - Text colors
- `success`, `warning`, `error` - Status colors
- `border` - Border colors

### Typography
- Font sizes: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `title`, `header`
- Font weights: `light`, `regular`, `medium`, `semibold`, `bold`
- Line heights: `tight`, `normal`, `relaxed`

### Spacing
- Sizes: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `xxxxl`

## 🤝 Contributing

Issues and PRs welcome! See the [main repository](https://github.com/kaushalrathour/rnative-workspace).

## 📄 License

MIT © Kaushal Rathour
