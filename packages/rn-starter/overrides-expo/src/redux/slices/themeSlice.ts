import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { darkThemeColors, lightThemeColors, commonColors } from '../../constants/colors';
import { AppColors } from '../../types/colors';

export type ThemeState = {
  isDarkMode: boolean;
  colors: AppColors;
};

const getThemeColors = (isDarkMode: boolean) => ({
  ...commonColors,
  ...(isDarkMode ? darkThemeColors : lightThemeColors),
});

const initialState: ThemeState = {
  isDarkMode: false,
  colors: getThemeColors(false),
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

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;

// Selector
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectColors = (state: { theme: ThemeState }) => state.theme.colors;
