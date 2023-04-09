import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MakeClassroom from '../Screens/Admin/MakeClassroom';
import AdminDashboard from '../Screens/Admin/AdminDashboard';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={AdminDashboard} />
                <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AdminNavigator