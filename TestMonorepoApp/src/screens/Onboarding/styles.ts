import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';
import { AppColors } from '../../types/colors';

export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundPrimary,
      paddingHorizontal: `${Spacing.sm}@s`,
      paddingVertical: `${Spacing.sm}@vs`,
    },
    heading: {
      fontSize: `${FontSize.large}@s`,
      color: colors.textPrimary,
    },
    subHeading: {
      fontSize: `${FontSize.medium}@s`,
      color: colors.secondary
    }
  });
};

