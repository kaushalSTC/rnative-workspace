import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, defaultLightTheme, defaultDarkTheme } from '../theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = defaultLightTheme,
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    setTheme(current => current.isDark ? defaultLightTheme : defaultDarkTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark: theme.isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
