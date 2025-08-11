import { ScaledSheet } from 'react-native-size-matters';
import { FontSize, Spacing } from '../../constants/sizing';
import { AppColors } from '../../types/colors';

export const getStyling = (colors: AppColors) => {
  return ScaledSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: colors.backgroundPrimary
    },
    container: {
      flex: 1,
    },
    heading: {
      fontSize: `${FontSize.large}@s`,
      color: colors.textPrimary,
    },
  });
};

