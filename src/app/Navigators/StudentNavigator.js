import React, { useEffect } from 'react'
import StudentDashboard from '../Screens/Student/StudentDashboard'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

const Stack = createNativeStackNavigator();

const StudentNavigator = () => {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#f8fafc');
    })

    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={StudentDashboard} />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar style='dark' animated backgroundColor='#f8fafc' />
        </>
    )
}

export default StudentNavigator