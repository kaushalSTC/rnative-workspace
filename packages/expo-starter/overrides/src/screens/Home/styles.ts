import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';
import { AppColors } from '../../types/colors';

export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundPrimary,
    },
    scrollContent: {
      paddingHorizontal: `${Spacing.md}@s`,
      paddingVertical: `${Spacing.lg}@vs`,
      paddingBottom: `${Spacing.xl}@vs`,
    },
    heading: {
      fontSize: `${FontSize.xl}@s`,
      color: colors.textPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: `${Spacing.sm}@vs`,
    },
    welcome: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: `${Spacing.lg}@vs`,
      lineHeight: `24@vs`,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: `12@s`,
      padding: `${Spacing.md}@s`,
      marginBottom: `${Spacing.md}@vs`,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: `2@vs`,
      },
      shadowOpacity: 0.1,
      shadowRadius: `4@s`,
      elevation: 3,
    },
    cardTitle: {
      fontSize: `${FontSize.large}@s`,
      color: colors.textPrimary,
      fontWeight: '600',
      marginBottom: `${Spacing.sm}@vs`,
    },
    cardText: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textSecondary,
      lineHeight: `20@vs`,
      marginBottom: `${Spacing.sm}@vs`,
    },
    codeText: {
      fontSize: `${FontSize.small}@s`,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      backgroundColor: colors.backgroundSecondary,
      padding: `${Spacing.sm}@s`,
      borderRadius: `6@s`,
      lineHeight: `18@vs`,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: `12@s`,
      paddingVertical: `${Spacing.md}@vs`,
      paddingHorizontal: `${Spacing.lg}@s`,
      marginVertical: `${Spacing.lg}@vs`,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: `4@vs`,
      },
      shadowOpacity: 0.3,
      shadowRadius: `8@s`,
      elevation: 6,
    },
    buttonText: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.onPrimary,
      fontWeight: '600',
      textAlign: 'center',
    },
    footer: {
      alignItems: 'center',
      marginTop: `${Spacing.lg}@vs`,
      paddingTop: `${Spacing.lg}@vs`,
      borderTopWidth: 1,
      borderTopColor: colors.outline,
    },
    footerText: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textSecondary,
      fontWeight: '500',
      marginBottom: `${Spacing.xs}@vs`,
    },
    footerSubText: {
      fontSize: `${FontSize.small}@s`,
      color: colors.textSecondary,
    },
  });
};

