import { createStackNavigator } from "@react-navigation/stack"
import Home from "../screens/Home/Home";
import { ThemeState } from "../redux/slices/themeSlice";
import { useSelector } from "react-redux";
import { RootStackParamList } from "../types/navigation/RootStackParamList";
import Onboarding from "../screens/Onboarding/Onboarding";
const Stack = createStackNavigator<RootStackParamList>();
const { Navigator, Screen } = Stack;
const items: {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
}[] = [
  {
    name: "Home",
    component: Home,
  },
  {
    name: "Onboarding",
    component: Onboarding,
  },
];

const StackNavigator = ()=> {
    const { colors, isDarkMode }: ThemeState = useSelector((state: any) => state.theme);
    return(
        <Navigator initialRouteName="Home" screenOptions={{
            headerStyle: {
                backgroundColor: colors.backgroundPrimary,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                borderTopWidth: 1,
                borderTopColor: colors.border,
            },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            }}>
            {items.map((item, index)=>{
                return(
                    <Screen {...item} key={index}/>
                )
            })}
        </Navigator>
    )
}

export default StackNavigator;