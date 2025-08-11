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
  
  // Additional colors for better theming support
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