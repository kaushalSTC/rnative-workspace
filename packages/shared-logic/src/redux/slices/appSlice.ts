import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  onboardingCompleted: boolean;
  notifications: {
    enabled: boolean;
    pushEnabled: boolean;
  };
}

const initialState: AppState = {
  isLoading: false,
  theme: 'system',
  language: 'en',
  onboardingCompleted: false,
  notifications: {
    enabled: true,
    pushEnabled: true,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<AppState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setTheme,
  setLanguage,
  setOnboardingCompleted,
  updateNotificationSettings,
} = appSlice.actions;
