import { View, Text } from 'react-native'
import React from 'react'
import ScanAttendance from '../screens/student/ScanAttendance'
import StudentDashboard from '../screens/student/StudentDashboard'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '../Components/Auth/AuthProvider';

const Stack = createNativeStackNavigator();

const StudentNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={StudentDashboard} />
                <Stack.Screen name="ScanAttendance" component={ScanAttendance} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default StudentNavigator