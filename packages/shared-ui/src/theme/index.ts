export * from './colors';
export * from './typography';
export * from './spacing';

import { lightTheme, darkTheme, type ThemeColors } from './colors';
import { typography, type Typography } from './typography';
import { spacing, type Spacing } from './spacing';

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  isDark: boolean;
}

export const createTheme = (isDark: boolean = false): Theme => ({
  colors: isDark ? darkTheme : lightTheme,
  typography,
  spacing,
  isDark,
});

export const defaultLightTheme = createTheme(false);
export const defaultDarkTheme = createTheme(true);
