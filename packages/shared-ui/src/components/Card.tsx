import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
  elevation = 2,
}) => {
  const theme = useTheme();

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: theme.spacing.sm };
      case 'large':
        return { padding: theme.spacing.xl };
      default: // medium
        return { padding: theme.spacing.lg };
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: elevation * 2,
    elevation: elevation,
    ...getPaddingStyle(),
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};
