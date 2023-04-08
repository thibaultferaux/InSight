import { View, Text } from 'react-native'
import React from 'react'
import ScanAttendance from '../src/app/Screens/Student/ScanAttendance'
import StudentDashboard from '../src/app/Screens/Student/StudentDashboard'
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