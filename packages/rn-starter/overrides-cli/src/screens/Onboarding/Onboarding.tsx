import { Text, TouchableOpacity, View } from "react-native"
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
        <View>
            <TouchableOpacity onPress={()=>{
                navigation.navigate("Home");
            }}>
                <Text style={styles.subHeading}>Go Home</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Onboarding;