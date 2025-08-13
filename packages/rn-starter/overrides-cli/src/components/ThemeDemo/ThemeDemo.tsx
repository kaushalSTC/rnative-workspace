import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeState } from '../../redux/slices/themeSlice';
import { getStyling } from './styles';
import ThemeToggle from '../ThemeToggle';

const ThemeDemo: React.FC = () => {
  const { colors, isDarkMode }: ThemeState = useSelector((state: any) => state.theme);
  const styles = useMemo(() => getStyling(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Demo Component</Text>
      <Text style={styles.description}>
        This component demonstrates how theme changes affect all UI elements automatically.
        Current mode: <Text style={styles.highlight}>{isDarkMode ? 'Dark' : 'Light'}</Text>
      </Text>
      
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Toggle theme:</Text>
        <ThemeToggle position="inline" showLabel={true} size="large" />
      </View>
      
      <View style={styles.colorDemo}>
        <Text style={styles.colorLabel}>Color showcase:</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.secondary }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.surface }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.backgroundAccent }]} />
        </View>
      </View>
    </View>
  );
};

export default ThemeDemo;
