import {NavigationContainer as Navigation} from "@react-navigation/native"
import StackNavigator from "./StackNavigator"

const NavigationContainer = ()=> {
    return(
        <Navigation>
            <StackNavigator/>
        </Navigation>
    )
}

export default NavigationContainer;