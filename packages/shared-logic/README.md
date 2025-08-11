# @kaushalstc/shared-logic

Shared business logic, API clients, Redux slices, and utilities for React Native apps.

## 🧠 Features

- **Redux Toolkit**: Pre-configured store with user and app state management
- **API Client**: Axios-based client with interceptors and error handling
- **Authentication**: Complete user management and auth flows
- **Utilities**: Formatting, validation, and helper functions
- **TypeScript**: Full type safety throughout

## 📦 Installation

```bash
npm install @kaushalstc/shared-logic
# or
yarn add @kaushalstc/shared-logic
```

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-native
```

## 🚀 Quick Start

### 1. Setup Redux Store

```tsx
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@kaushalstc/shared-logic';
import { YourApp } from './YourApp';

const store = createStore();

export default function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### 2. Use in your components

```tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, 
  getCurrentUser, 
  formatDate,
  validateEmail 
} from '@kaushalstc/shared-logic';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const emailValid = validateEmail('user@example.com');
  const formattedDate = formatDate(new Date());

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        currentUser && (
          <>
            <Text>{currentUser.firstName} {currentUser.lastName}</Text>
            <Text>Joined: {formatDate(currentUser.createdAt)}</Text>
          </>
        )
      )}
    </View>
  );
};
```

### 3. Setup API Client

```tsx
import { createApiClient, UserService } from '@kaushalstc/shared-logic';

// Configure API client
const apiClient = createApiClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.myapp.com',
  timeout: 10000,
  headers: {
    'X-App-Version': '1.0.0',
  }
});

// Create service instances
export const userService = new UserService(apiClient);

// Use in your app
const user = await userService.getCurrentUser();
```

## 🏪 Redux Store

### Pre-configured Slices

#### User Slice
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState, loginUser, logout, setUser } from '@kaushalstc/shared-logic';

const { currentUser, isAuthenticated, isLoading, error } = useSelector(
  (state: RootState) => state.user
);

// Actions
dispatch(loginUser({ email: 'user@example.com', password: 'password' }));
dispatch(logout());
dispatch(setUser(userData));
```

#### App Slice
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setTheme, setLoading } from '@kaushalstc/shared-logic';

const { theme, isLoading, language } = useSelector(
  (state: RootState) => state.app
);

// Actions
dispatch(setTheme('dark'));
dispatch(setLoading(true));
```

## 🌐 API Client

### Basic Usage

```tsx
import { createApiClient } from '@kaushalstc/shared-logic';

const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 15000
});

// GET request
const data = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John' });

// PUT request
const updatedUser = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE request
await apiClient.delete('/users/1');
```

### With Services

```tsx
import { UserService, createApiClient } from '@kaushalstc/shared-logic';

const apiClient = createApiClient({ baseURL: 'https://api.example.com' });
const userService = new UserService(apiClient);

// User operations
const currentUser = await userService.getCurrentUser();
const user = await userService.getUserById('123');
const authResponse = await userService.login({ email, password });
await userService.logout();
```

## 🛠️ Utility Functions

### Formatting

```tsx
import { 
  formatDate, 
  formatRelativeTime, 
  formatCurrency,
  formatNumber,
  capitalize,
  getInitials
} from '@kaushalstc/shared-logic';

// Date formatting
formatDate(new Date()); // "January 15, 2024"
formatRelativeTime(new Date()); // "2 hours ago"

// Number formatting
formatCurrency(1234.56); // "$1,234.56"
formatNumber(1234567); // "1.2M"

// String formatting
capitalize("hello world"); // "Hello world"
getInitials("John Doe"); // "JD"
```

### Validation

```tsx
import { 
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
  validateUrl
} from '@kaushalstc/shared-logic';

// Email validation
const isValidEmail = validateEmail('user@example.com'); // true

// Password validation
const passwordValidation = validatePassword('MyPass123!');
// { isValid: true, errors: [] }

// Other validations
const isValidPhone = validatePhoneNumber('+1234567890');
const isRequired = validateRequired('some value');
const isValidUrl = validateUrl('https://example.com');
```

## 📊 TypeScript Support

### Types Available

```tsx
import type { 
  User,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  AuthResponse,
  RootState,
  AppDispatch
} from '@kaushalstc/shared-logic';

// Use in your components
interface Props {
  user: User;
  onUpdate: (data: UpdateUserRequest) => void;
}

// Typed selectors
const user = useSelector((state: RootState) => state.user.currentUser);

// Typed dispatch
const dispatch: AppDispatch = useDispatch();
```

## ⚙️ Configuration

### Custom Store Configuration

```tsx
import { createStore, RootState } from '@kaushalstc/shared-logic';

// With preloaded state
const preloadedState: Partial<RootState> = {
  user: {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    accessToken: null,
  }
};

const store = createStore(preloadedState);
```

### API Client Interceptors

The API client comes with built-in interceptors:

- **Request Interceptor**: Automatically adds auth tokens
- **Response Interceptor**: Handles 401 errors and token refresh
- **Error Handling**: Consistent error responses

To customize authentication token handling, extend the `ApiClient` class or modify the interceptors.

## 🔄 Integration with Shared UI

Perfect companion to `@kaushalstc/shared-ui`:

```tsx
import { Provider } from 'react-redux';
import { ThemeProvider } from '@kaushalstc/shared-ui';
import { createStore } from '@kaushalstc/shared-logic';

const store = createStore();

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <YourApp />
      </ThemeProvider>
    </Provider>
  );
}
```

## 🤝 Contributing

Issues and PRs welcome! See the [main repository](https://github.com/kaushalSTC/rnative-workspace).

## 📄 License

MIT © Kaushal Rathour
