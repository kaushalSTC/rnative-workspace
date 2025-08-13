import { Text, TouchableOpacity, View, ScrollView } from "react-native"
import { getStyling} from "./styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeState } from "../../redux/slices/themeSlice";
import { HomeScreenProps } from "../../types/navigation/RootStackParamList";
import ThemeToggle from "../../components/ThemeToggle";
import ThemeDemo from "../../components/ThemeDemo";

const Home = ({navigation}: HomeScreenProps)=> {
    const {colors}: ThemeState = useSelector((state: any)=> state.theme);
    const styles = useMemo(()=>{
        return getStyling(colors)
    },[colors])
    return(
        <>
            <ThemeToggle position="top-right" />
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.heading}>🚀 STC Expo Starter</Text>
            <Text style={styles.welcome}>Welcome to your new React Native Expo app!</Text>
            
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📂 Project Structure</Text>
                <Text style={styles.cardText}>This app uses a scalable architecture:</Text>
                <Text style={styles.codeText}>src/
├── components/     {"<-- Reusable UI components"}
├── navigation/     {"<-- App routing system"}
├── screens/        {"<-- Screen components (you're here!)"}
├── redux/          {"<-- State management"}
├── services/       {"<-- API calls & external services"}
├── theme/          {"<-- Colors, fonts, spacing"}
└── utils/          {"<-- Helper functions & hooks"}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎨 ScaledSheet Styling</Text>
                <Text style={styles.cardText}>This template uses ScaledSheet for responsive design:</Text>
                <Text style={styles.codeText}>// Numbers automatically become responsive:
padding: 20        → "20@s" (horizontal scale)
marginTop: 10      → "10@vs" (vertical scale)
fontSize: 16       → "16@ms" (font scale)</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>⚛️ Redux Toolkit Setup</Text>
                <Text style={styles.cardText}>State management is already configured:</Text>
                <Text style={styles.codeText}>• Theme state (colors, dark/light mode)
• Ready for your app-specific state
• TypeScript support included</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🧭 Navigation</Text>
                <Text style={styles.cardText}>React Navigation v6 is set up with:</Text>
                <Text style={styles.codeText}>• Type-safe navigation
• Screen transitions
• Tab and stack navigators ready</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎨 Dynamic Theming System</Text>
                <Text style={styles.cardText}>Toggle the theme using the button in the top-right corner! Features:</Text>
                <Text style={styles.codeText}>• Redux-powered theme state management
• Automatic color updates across all components
• Smooth animations with accessibility support
• TypeScript support with type-safe colors
• Light/Dark mode with responsive design</Text>
                <Text style={styles.cardText}>Check THEMING_GUIDE.md for implementation details!</Text>
            </View>

            <ThemeDemo />

            <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={()=> navigation.navigate("Onboarding")}
            >
                <Text style={styles.buttonText}>👋 Check Onboarding Screen</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>🏢 Built with STC Expo Starter Template</Text>
                <Text style={styles.footerSubText}>Start building your amazing app!</Text>
            </View>
        </ScrollView>
        </>
    )
}

export default Home;