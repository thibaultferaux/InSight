import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/app/Screens/Auth/LoginScreen';
import RegisterScreen from '../src/app/Screens/Auth/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={ LoginScreen } />
                <Stack.Screen name="Register" component={ RegisterScreen } />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AuthNavigator