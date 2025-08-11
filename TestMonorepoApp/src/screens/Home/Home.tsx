import { Text, TouchableOpacity, View } from "react-native"
import { getStyling} from "./styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeState } from "../../redux/slices/themeSlice";
import { HomeScreenProps } from "../../types/navigation/RootStackParamList";

const Home = ({navigation}: HomeScreenProps)=> {
    const {colors}: ThemeState = useSelector((state: any)=> state.theme);
    const styles = useMemo(()=>{
        return getStyling(colors)
    },[])
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Home Screen...</Text>
            <TouchableOpacity onPress={()=>{
                navigation.navigate("Onboarding")
            }}>
                <Text style={styles.subHeading}>Go to Onboarding</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home;