import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

export default function App() {
    const [session, setSession] = useState(null)

    const Stack = createNativeStackNavigator();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        console.log(session)
    }, [])

    return (
        <NavigationContainer>
            <SafeAreaProvider>

                <Stack.Navigator>
                    <Stack.Group screenOptions={{ headerShown: false }}>
                        {session && session.user ? (
                            <>
                                <Stack.Screen name="Dashboard" component={DashboardScreen} initialParams={{ session: session }} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="Register" component={RegisterScreen} />
                            </>
                        )}
                    </Stack.Group>
                </Stack.Navigator>
                <FlashMessage position="top" />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}