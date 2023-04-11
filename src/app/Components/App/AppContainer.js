import * as SplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

const AppContainer = ({ children }) => {
    // load fonts
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold
    });

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
        NavigationBar.setButtonStyleAsync('dark');

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