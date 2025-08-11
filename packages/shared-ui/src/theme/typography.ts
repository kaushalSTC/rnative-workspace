import { scale, moderateScale } from 'react-native-size-matters';

export const typography = {
  fontSizes: {
    xs: moderateScale(10),
    sm: moderateScale(12),
    md: moderateScale(14),
    lg: moderateScale(16),
    xl: moderateScale(18),
    xxl: moderateScale(20),
    xxxl: moderateScale(24),
    title: moderateScale(28),
    header: moderateScale(32),
  },
  fontWeights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export type Typography = typeof typography;
