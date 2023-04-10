import { View, Text } from 'react-native'
import React from 'react'
import TeacherDashboard from '../Screens/Teacher/TeacherDashboard'
import MakeLesson from '../Screens/Teacher/MakeLesson'
import ViewAttendances from '../Screens/Teacher/ViewAttendances'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TestTab from '../Screens/Teacher/TestTab'
import { StatusBar } from 'expo-status-bar'

const Stack = createNativeStackNavigator();

const TeacherNavigator = () => {

    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={TeacherDashboard} />
                    <Stack.Screen name="Test" component={TestTab} />
                    <Stack.Screen name="MakeLesson" component={MakeLesson} />
                    <Stack.Screen name="ViewAttendances" component={ViewAttendances} />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar style='dark' animated backgroundColor='#f8fafc' />
        </>
    )
}

export default TeacherNavigator