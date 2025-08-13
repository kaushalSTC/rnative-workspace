import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';
import { AppColors } from '../../types/colors';

export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: `12@s`,
      padding: `${Spacing.md}@s`,
      marginVertical: `${Spacing.sm}@vs`,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: `2@vs`,
      },
      shadowOpacity: 0.1,
      shadowRadius: `4@s`,
      elevation: 3,
    },
    title: {
      fontSize: `${FontSize.large}@s`,
      color: colors.textPrimary,
      fontWeight: '600',
      marginBottom: `${Spacing.sm}@vs`,
    },
    description: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textSecondary,
      lineHeight: `20@vs`,
      marginBottom: `${Spacing.md}@vs`,
    },
    highlight: {
      color: colors.primary,
      fontWeight: '600',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: `${Spacing.md}@vs`,
      paddingVertical: `${Spacing.sm}@vs`,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    toggleLabel: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    colorDemo: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: `${Spacing.md}@vs`,
    },
    colorLabel: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.textPrimary,
      fontWeight: '500',
      marginBottom: `${Spacing.sm}@vs`,
    },
    colorRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    colorBox: {
      width: `40@s`,
      height: `40@vs`,
      borderRadius: `8@s`,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: `1@vs`,
      },
      shadowOpacity: 0.2,
      shadowRadius: `2@s`,
      elevation: 2,
    },
  });
};
