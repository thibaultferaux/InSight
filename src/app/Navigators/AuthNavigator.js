import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {

    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={ LoginScreen } />
                    <Stack.Screen name="Register" component={ RegisterScreen } />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar translucent style='light' animated />
        </>
    )
}

export default AuthNavigator