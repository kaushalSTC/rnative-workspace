import { SafeAreaView, StatusBar, View, Platform } from "react-native";
import NavigationContainer from "../../navigation/NavigationContainer";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { ThemeState } from "../../redux/slices/themeSlice";
import { getStyling } from "./styles";

const RootContainer = () => {
  const { colors, isDarkMode }: ThemeState = useSelector((state: any) => state.theme);

  const styles = useMemo(() => getStyling(colors), [colors]);

  return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
        <NavigationContainer />
      </SafeAreaView>
  );
};

export default RootContainer;
