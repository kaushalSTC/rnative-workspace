import { Text, TouchableOpacity, View, ScrollView } from "react-native"
import { OnboardingScreenProps } from "../../types/navigation/RootStackParamList";
import { ThemeState } from "../../redux/slices/themeSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { getStyling } from "./styles";

const Onboarding = ({ navigation }: OnboardingScreenProps) => {
    const {colors}: ThemeState = useSelector((state: any)=> state.theme);
    const styles = useMemo(()=>{
        return getStyling(colors)
    },[])
    return(
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.heading}>👋 Onboarding Screen</Text>
            <Text style={styles.subtitle}>Here's how to get started with development</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🚀 Quick Development Commands</Text>
                <Text style={styles.commandText}>npm start</Text>
                <Text style={styles.commandDesc}>Start Expo development server</Text>
                
                <Text style={styles.commandText}>npm run ios</Text>
                <Text style={styles.commandDesc}>Run on iOS Simulator</Text>
                
                <Text style={styles.commandText}>npm run android</Text>
                <Text style={styles.commandDesc}>Run on Android Emulator</Text>

                <Text style={styles.commandText}>npm run lint:fix</Text>
                <Text style={styles.commandDesc}>Auto-fix code formatting</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>📝 Next Steps</Text>
                <Text style={styles.stepText}>1. Add your app screens in src/screens/</Text>
                <Text style={styles.stepText}>2. Create reusable components in src/components/</Text>
                <Text style={styles.stepText}>3. Set up API services in src/services/</Text>
                <Text style={styles.stepText}>4. Configure app state in src/redux/</Text>
                <Text style={styles.stepText}>5. Customize theme colors in src/theme/</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎨 Using ScaledSheet</Text>
                <Text style={styles.codeExample}>import {'{'}ScaledSheet{'}'} from 'react-native-size-matters';</Text>
                <Text style={styles.codeExample}></Text>
                <Text style={styles.codeExample}>const styles = ScaledSheet.create({'{'}{
}  container: {'{'}
    padding: 20,      // Auto-scales to device
    fontSize: 16,     // Perfect on all screens
  {'}'}
{'}'});</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🔧 Available NPM Scripts</Text>
                <Text style={styles.cardText}>This template includes 60+ scripts for:</Text>
                <Text style={styles.bulletText}>• Building and releasing apps</Text>
                <Text style={styles.bulletText}>• Code linting and formatting</Text>
                <Text style={styles.bulletText}>• Cleaning build caches</Text>
                <Text style={styles.bulletText}>• iOS and Android development</Text>
                <Text style={styles.bulletText}>• EAS Build integration</Text>
            </View>

            <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={()=> navigation.navigate("Home")}
            >
                <Text style={styles.buttonText}>🏠 Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Ready to build something amazing? 🚀</Text>
                <Text style={styles.footerSubText}>Replace these screens with your app content</Text>
            </View>
        </ScrollView>
    )
}

export default Onboarding;