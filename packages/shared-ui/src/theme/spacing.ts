import { scale } from 'react-native-size-matters';

export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  xxxxl: scale(40),
};

export type Spacing = typeof spacing;
