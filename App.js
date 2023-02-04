import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';

export default function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <SafeAreaProvider>
                <Stack.Navigator>
                    <Stack.Group screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </Stack.Group>
                </Stack.Navigator>
            </SafeAreaProvider>
        </NavigationContainer>
    );
}