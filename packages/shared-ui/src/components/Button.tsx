import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingVertical = theme.spacing.lg;
        baseStyle.paddingHorizontal = theme.spacing.xxl;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.minHeight = 44;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.surface;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.primary;
        break;
      default: // primary
        baseStyle.backgroundColor = theme.colors.primary;
    }

    // Disabled styles
    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: theme.typography.fontWeights.medium,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = theme.typography.fontSizes.sm;
        break;
      case 'large':
        baseStyle.fontSize = theme.typography.fontSizes.lg;
        break;
      default: // medium
        baseStyle.fontSize = theme.typography.fontSizes.md;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.color = theme.colors.text;
        break;
      case 'outline':
        baseStyle.color = theme.colors.primary;
        break;
      default: // primary
        baseStyle.color = theme.colors.background;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.background : theme.colors.primary}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
