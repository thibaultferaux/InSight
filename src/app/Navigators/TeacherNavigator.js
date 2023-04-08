import { View, Text } from 'react-native'
import React from 'react'
import TeacherDashboard from '../Screens/Teacher/TeacherDashboard'
import MakeLesson from '../Screens/Teacher/MakeLesson'
import ScanActive from '../Screens/Teacher/ScanActive'
import ViewAttendances from '../Screens/Teacher/ViewAttendances'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

const TeacherNavigator = () => {

    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={TeacherDashboard} />
                <Stack.Screen name="MakeLesson" component={MakeLesson} />
                <Stack.Screen name="ScanActive" component={ScanActive} />
                <Stack.Screen name="ViewAttendances" component={ViewAttendances} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default TeacherNavigator