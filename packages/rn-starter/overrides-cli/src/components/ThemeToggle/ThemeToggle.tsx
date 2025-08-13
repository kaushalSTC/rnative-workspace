import React from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeState, toggleTheme } from '../../redux/slices/themeSlice';
import { getStyling } from './styles';
import { useMemo, useRef, useEffect } from 'react';

interface ThemeToggleProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  position = 'top-right',
  showLabel = false,
  size = 'medium' 
}) => {
  const dispatch = useDispatch();
  const { isDarkMode, colors }: ThemeState = useSelector((state: any) => state.theme);
  const styles = useMemo(() => getStyling(colors, position, size), [colors, position, size]);
  
  // Animation for the toggle switch
  const animatedValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, animatedValue]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const toggleTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjust based on your toggle size
  });

  const renderToggleButton = () => (
    <TouchableOpacity
      style={styles.toggleContainer}
      onPress={handleToggleTheme}
      activeOpacity={0.7}
      accessibilityLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
    >
      <View style={styles.toggleTrack}>
        <Animated.View 
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX: toggleTranslateX }]
            }
          ]}
        >
          <Text style={styles.toggleIcon}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </Animated.View>
      </View>
      {showLabel && (
        <Text style={styles.toggleLabel}>
          {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (position === 'inline') {
    return renderToggleButton();
  }

  return (
    <View style={styles.positionedContainer}>
      {renderToggleButton()}
    </View>
  );
};

export default ThemeToggle;
