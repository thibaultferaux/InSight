import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MakeClassroom from '../Screens/Admin/MakeClassroom';
import AdminDashboard from '../Screens/Admin/AdminDashboard';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#f8fafc');
    })

    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={AdminDashboard} />
                    <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar style='dark' animated backgroundColor='#f8fafc' />
        </>
    )
}

export default AdminNavigator