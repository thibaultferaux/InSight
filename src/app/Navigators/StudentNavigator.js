import React from 'react'
import StudentDashboard from '../Screens/Student/StudentDashboard'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const StudentNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={StudentDashboard} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default StudentNavigator