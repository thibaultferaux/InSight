import * as SplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync();

const AppContainer = ({ children }) => {
    // load fonts
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    useEffect(() => {
        if (fontsLoaded) {
            const hide = async () => {
                await SplashScreen.hideAsync();
            }
            hide();
        }
    }, [fontsLoaded]);

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    return children;
}

export default AppContainer