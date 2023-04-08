import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../src/app/Screens/Admin/AdminDashboard';
import MakeClassroom from '../src/app/Screens/Admin/MakeClassroom';
import ScanClassroom from '../src/app/Screens/Admin/ScanClassroom';
import ScanSuccess from '../src/app/Screens/Admin/ScanSuccess';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={AdminDashboard} />
                <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
                <Stack.Screen name="ScanClassroom" component={ScanClassroom} />
                <Stack.Screen name="ScanSuccess" component={ScanSuccess} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AdminNavigator