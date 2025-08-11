import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

export type OnboardingScreenProps = StackScreenProps<RootStackParamList, 'Onboarding'>;
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
