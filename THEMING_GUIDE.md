# React Native Theming System Guide

This guide explains how the dynamic theming system works in this React Native Expo starter, including how colors are dynamically updated using Redux, and how to implement theme toggling throughout your app.

## 🎨 Overview

The theming system provides:
- **Dynamic theme switching** between light and dark modes
- **Redux-powered state management** for consistent theme state across all components
- **Type-safe color definitions** with TypeScript support
- **Responsive design integration** with react-native-size-matters
- **Easy-to-use theme toggle components** with animation support

## 📁 Architecture

```
src/
├── redux/
│   ├── slices/
│   │   └── themeSlice.ts          # Redux theme state & actions
│   └── store.ts                   # Redux store configuration
├── constants/
│   └── colors.ts                  # Light/dark theme color definitions
├── types/
│   └── colors.ts                  # TypeScript color type definitions
├── components/
│   └── ThemeToggle/               # Reusable theme toggle component
│       ├── ThemeToggle.tsx
│       ├── styles.ts
│       └── index.ts
└── screens/                       # Screens using the theme system
    ├── Home/
    └── Onboarding/
```

## 🔧 How It Works

### 1. Redux Theme Slice

The theming system is powered by Redux Toolkit. The `themeSlice` manages:

```typescript
// src/redux/slices/themeSlice.ts
export type ThemeState = {
  isDarkMode: boolean;
  colors: AppColors;
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.colors = getThemeColors(state.isDarkMode);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      state.colors = getThemeColors(action.payload);
    },
  },
});
```

**Key Features:**
- **Automatic color calculation**: When theme changes, colors are automatically recalculated
- **Immutable updates**: Using Redux Toolkit's built-in Immer for safe state mutations
- **Type safety**: Full TypeScript support with proper typing

### 2. Color System

#### Color Definitions (`src/constants/colors.ts`)

```typescript
export const darkThemeColors = {
  backgroundPrimary: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundAccent: '#2A2A2A',
  surface: '#1E1E1E',
  primary: '#BB86FC',
  secondary: '#03DAC6',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#2C2C2C',
  error: '#CF6679',
  onPrimary: '#000000',
  outline: '#333333',
};

export const lightThemeColors = {
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundAccent: '#EEEEEE',
  surface: '#FFFFFF',
  primary: '#6200EE',
  secondary: '#03DAC6',
  textPrimary: '#000000',
  textSecondary: '#4F4F4F',
  border: '#E0E0E0',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  outline: '#CCCCCC',
};

export const commonColors = {
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};
```

#### Type Definitions (`src/types/colors.ts`)

```typescript
export type ThemeColors = {
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundAccent: string;
  surface: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  onPrimary: string;
  outline: string;
};

export type CommonColors = {
  success: string;
  warning: string;
  info: string;
  transparent: string;
  white: string;
  black: string;
};

export type AppColors = ThemeColors & CommonColors;
```

### 3. Dynamic Color Updates

#### How Colors Update Automatically

1. **Component subscribes to Redux state**:
```typescript
const { colors }: ThemeState = useSelector((state: any) => state.theme);
```

2. **Styles are memoized with colors dependency**:
```typescript
const styles = useMemo(() => {
  return getStyling(colors)
}, [colors]) // 🔑 Colors as dependency ensures re-render on theme change
```

3. **When theme toggles**:
   - Redux action `toggleTheme()` is dispatched
   - `themeSlice` updates `isDarkMode` and recalculates `colors`
   - All subscribed components automatically re-render with new colors

#### Component Implementation Pattern

```typescript
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../redux/slices/themeSlice';
import { getStyling } from './styles';

const MyComponent = () => {
  // Subscribe to theme state
  const { colors }: ThemeState = useSelector((state: any) => state.theme);
  
  // Memoize styles with colors dependency
  const styles = useMemo(() => getStyling(colors), [colors]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </View>
  );
};
```

#### Style Function Pattern

```typescript
// styles.ts
import { ScaledSheet } from 'react-native-size-matters';
import { AppColors } from '../types/colors';

export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimary, // 🎨 Dynamic color
      borderColor: colors.border,
    },
    text: {
      color: colors.textPrimary, // 🎨 Dynamic color
    },
  });
};
```

## 🔄 Theme Toggle Component

### Usage Examples

```typescript
// Basic toggle (top-right positioned)
<ThemeToggle />

// Custom positioned toggle
<ThemeToggle position="top-left" />

// Inline toggle with label
<ThemeToggle position="inline" showLabel={true} size="large" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'inline'` | `'top-right'` | Positioning of the toggle |
| `showLabel` | `boolean` | `false` | Whether to show "Light"/"Dark" text label |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the toggle switch |

### Animation Features

- **Smooth toggle animation**: 300ms duration with native driver when possible
- **Visual feedback**: Sun (☀️) and moon (🌙) icons
- **Accessibility support**: Proper ARIA labels and roles

## 🚀 Implementation Guide

### Step 1: Add Theme Toggle to Screen

```typescript
import ThemeToggle from '../../components/ThemeToggle';

const MyScreen = () => {
  return (
    <>
      <ThemeToggle position="top-right" />
      <ScrollView style={styles.container}>
        {/* Your screen content */}
      </ScrollView>
    </>
  );
};
```

### Step 2: Make Components Theme-Aware

```typescript
import { useSelector } from 'react-redux';
import { ThemeState } from '../../redux/slices/themeSlice';

const MyComponent = () => {
  const { colors } = useSelector((state: any) => state.theme);
  const styles = useMemo(() => getStyling(colors), [colors]);
  
  // Component implementation
};
```

### Step 3: Create Styled Components

```typescript
export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimary,
      borderColor: colors.border,
    },
    text: {
      color: colors.textPrimary,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: '8@s',
    },
    buttonText: {
      color: colors.onPrimary,
    },
  });
};
```

## 🎯 Best Practices

### 1. Always Use Memoized Styles
```typescript
// ✅ Good: Memoized with colors dependency
const styles = useMemo(() => getStyling(colors), [colors]);

// ❌ Bad: Will cause unnecessary re-renders
const styles = getStyling(colors);
```

### 2. Consistent Color Usage
```typescript
// ✅ Good: Use semantic color names
backgroundColor: colors.backgroundPrimary,
color: colors.textPrimary,

// ❌ Bad: Hardcoded colors break theming
backgroundColor: '#FFFFFF',
color: '#000000',
```

### 3. Responsive Design Integration
```typescript
// ✅ Good: Combine theming with responsive scaling
const styles = ScaledSheet.create({
  container: {
    padding: '16@s', // Responsive padding
    backgroundColor: colors.surface, // Themed color
  },
});
```

### 4. Theme Toggle Placement
```typescript
// ✅ Good: Positioned toggle for easy access
<ThemeToggle position="top-right" />

// ✅ Good: Inline toggle in settings
<ThemeToggle position="inline" showLabel={true} />
```

## 🔍 Advanced Usage

### Custom Theme Actions

You can dispatch theme actions programmatically:

```typescript
import { useDispatch } from 'react-redux';
import { toggleTheme, setDarkMode } from '../redux/slices/themeSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  
  const enableDarkMode = () => {
    dispatch(setDarkMode(true));
  };
};
```

### Theme Persistence

To persist theme selection, integrate with AsyncStorage:

```typescript
// In your app initialization
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadTheme = async () => {
  const savedTheme = await AsyncStorage.getItem('isDarkMode');
  if (savedTheme !== null) {
    dispatch(setDarkMode(JSON.parse(savedTheme)));
  }
};

// Save theme when it changes
useEffect(() => {
  AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
}, [isDarkMode]);
```

### Custom Colors

To add custom colors, extend the type definitions:

```typescript
// src/types/colors.ts
export type ThemeColors = {
  // ... existing colors
  customAccent: string;
  customHighlight: string;
};

// src/constants/colors.ts
export const darkThemeColors = {
  // ... existing colors
  customAccent: '#FF6B6B',
  customHighlight: '#4ECDC4',
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Colors not updating**: Ensure colors is in the useMemo dependency array
2. **TypeScript errors**: Check that all colors are defined in both light and dark themes
3. **Performance issues**: Use ScaledSheet.create() for optimized styles
4. **Toggle not working**: Verify Redux store is properly connected

### Debug Tips

```typescript
// Add logging to track theme changes
useEffect(() => {
  console.log('Theme changed:', { isDarkMode, colors: Object.keys(colors) });
}, [isDarkMode, colors]);
```

## 🚀 Next Steps

1. **Add more theme variants** (e.g., high contrast, custom brand themes)
2. **Implement system theme detection** using `react-native-appearance`
3. **Add theme preview** in settings screens
4. **Create theme-aware icon components**
5. **Implement gradient theming** for advanced visual effects

The theming system is designed to be flexible and extensible. You can easily add new colors, create custom themes, or integrate with design systems while maintaining the dynamic update capabilities powered by Redux.
