import React from 'react'
import ScanAttendance from '../Screens/Student/ScanAttendance'
import StudentDashboard from '../Screens/Student/StudentDashboard'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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