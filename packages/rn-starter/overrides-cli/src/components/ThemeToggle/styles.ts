import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';
import { AppColors } from '../../types/colors';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
type Size = 'small' | 'medium' | 'large';

const getSizeConfig = (size: Size) => {
  switch (size) {
    case 'small':
      return {
        trackWidth: 40,
        trackHeight: 22,
        thumbSize: 18,
        iconSize: 10,
        fontSize: FontSize.small,
        spacing: Spacing.xs,
      };
    case 'large':
      return {
        trackWidth: 60,
        trackHeight: 32,
        thumbSize: 28,
        iconSize: 16,
        fontSize: FontSize.large,
        spacing: Spacing.md,
      };
    default: // medium
      return {
        trackWidth: 50,
        trackHeight: 26,
        thumbSize: 22,
        iconSize: 12,
        fontSize: FontSize.medium,
        spacing: Spacing.sm,
      };
  }
};

const getPositionStyles = (position: Position) => {
  const basePositionStyle = {
    position: 'absolute' as const,
    zIndex: 1000,
  };

  switch (position) {
    case 'top-left':
      return {
        ...basePositionStyle,
        top: `${Spacing.lg}@vs`,
        left: `${Spacing.md}@s`,
      };
    case 'top-right':
      return {
        ...basePositionStyle,
        top: `${Spacing.lg}@vs`,
        right: `${Spacing.md}@s`,
      };
    case 'bottom-left':
      return {
        ...basePositionStyle,
        bottom: `${Spacing.lg}@vs`,
        left: `${Spacing.md}@s`,
      };
    case 'bottom-right':
      return {
        ...basePositionStyle,
        bottom: `${Spacing.lg}@vs`,
        right: `${Spacing.md}@s`,
      };
    case 'inline':
    default:
      return {};
  }
};

export const getStyling = (colors: AppColors, position: Position = 'top-right', size: Size = 'medium') => {
  const sizeConfig = getSizeConfig(size);
  const positionStyle = getPositionStyles(position);

  return ScaledSheet.create({
    positionedContainer: {
      ...positionStyle,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: `${sizeConfig.spacing}@s`,
    },
    toggleTrack: {
      width: `${sizeConfig.trackWidth}@s`,
      height: `${sizeConfig.trackHeight}@vs`,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: `${sizeConfig.trackHeight / 2}@s`,
      borderWidth: 2,
      borderColor: colors.border,
      padding: `2@s`,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: `2@vs`,
      },
      shadowOpacity: 0.1,
      shadowRadius: `3@s`,
      elevation: 2,
    },
    toggleThumb: {
      width: `${sizeConfig.thumbSize}@s`,
      height: `${sizeConfig.thumbSize}@vs`,
      backgroundColor: colors.primary,
      borderRadius: `${sizeConfig.thumbSize / 2}@s`,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: `2@vs`,
      },
      shadowOpacity: 0.2,
      shadowRadius: `4@s`,
      elevation: 3,
    },
    toggleIcon: {
      fontSize: `${sizeConfig.iconSize}@s`,
      textAlign: 'center',
    },
    toggleLabel: {
      fontSize: `${sizeConfig.fontSize}@s`,
      color: colors.textPrimary,
      fontWeight: '600',
      marginLeft: `${sizeConfig.spacing}@s`,
    },
  });
};
