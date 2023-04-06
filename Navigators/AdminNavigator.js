import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import MakeClassroom from '../screens/admin/MakeClassroom';
import ScanClassroom from '../screens/admin/ScanClassroom';
import ScanSuccess from '../screens/admin/ScanSuccess';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {

    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={AdminDashboard} initialParams={{ session: session }} />
                <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
                <Stack.Screen name="ScanClassroom" component={ScanClassroom} />
                <Stack.Screen name="ScanSuccess" component={ScanSuccess} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AdminNavigator