import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'caption' | 'heading' | 'subheading' | 'title';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  weight = 'regular',
  align = 'left',
  style,
  ...props
}) => {
  const theme = useTheme();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: theme.colors.text,
      textAlign: align,
      fontWeight: theme.typography.fontWeights[weight],
    };

    // Variant styles
    switch (variant) {
      case 'caption':
        baseStyle.fontSize = theme.typography.fontSizes.sm;
        baseStyle.color = theme.colors.textSecondary;
        break;
      case 'heading':
        baseStyle.fontSize = theme.typography.fontSizes.xl;
        baseStyle.fontWeight = theme.typography.fontWeights.semibold;
        break;
      case 'subheading':
        baseStyle.fontSize = theme.typography.fontSizes.lg;
        baseStyle.fontWeight = theme.typography.fontWeights.medium;
        break;
      case 'title':
        baseStyle.fontSize = theme.typography.fontSizes.title;
        baseStyle.fontWeight = theme.typography.fontWeights.bold;
        break;
      default: // body
        baseStyle.fontSize = theme.typography.fontSizes.md;
    }

    // Color overrides
    if (color) {
      switch (color) {
        case 'primary':
          baseStyle.color = theme.colors.primary;
          break;
        case 'secondary':
          baseStyle.color = theme.colors.textSecondary;
          break;
        case 'error':
          baseStyle.color = theme.colors.error;
          break;
        case 'success':
          baseStyle.color = theme.colors.success;
          break;
        case 'warning':
          baseStyle.color = theme.colors.warning;
          break;
      }
    }

    return baseStyle;
  };

  return (
    <RNText style={[getTextStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};
