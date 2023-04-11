import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import TeacherDashboard from '../Screens/Teacher/TeacherDashboard'
import MakeLesson from '../Screens/Teacher/MakeLesson'
import ViewAttendances from '../Screens/Teacher/ViewAttendances'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StudentsOverview from '../Screens/Teacher/StudentsOverview'
import { CalendarIcon, UserGroupIcon } from 'react-native-heroicons/outline'
import * as NavigationBar from 'expo-navigation-bar'
import StudentDetails from '../Screens/Teacher/StudentDetails'

const getTabBarIcon = (name, color) => {
    switch (name) {
        case 'Lessen':
            return <CalendarIcon size={30} color={color}  />;
        case 'Studenten':
            return <UserGroupIcon size={30} color={color}  />;
    }
}

const TeacherTabs = () => {

    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => getTabBarIcon(route.name, color),
                tabBarActiveTintColor: '#030712',
                tabBarInactiveTintColor: '#030712',
                tabBarActiveBackgroundColor: '#E5E7EB',
                tabBarStyle: {
                    paddingTop: 5,
                    paddingBottom: 10,
                    height: 70,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: "15%"
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    marginBottom: 2,
                    fontFamily: 'Poppins_400Regular',
                },
                tabBarItemStyle: {
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '30%',
                    borderRadius: 15,
                    paddingTop: 2,
                    flex: 0,
                    marginTop: 2,
                    marginHorizontal: "10%",
                },
            })}
        >
            <Tab.Group screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Lessen" component={TeacherDashboard} />
                <Tab.Screen name="Studenten" component={StudentsOverview} />
            </Tab.Group>
        </Tab.Navigator>
    )
}

const TeacherNavigator = () => {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
    })

    const Stack = createNativeStackNavigator();
    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={TeacherTabs} />
                    <Stack.Screen name="MakeLesson" component={MakeLesson} />
                    <Stack.Screen name="ViewAttendances" component={ViewAttendances} />
                    <Stack.Screen name="StudentDetails" component={StudentDetails} />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar style='dark' animated backgroundColor='#f8fafc' />
        </>
    )
}

export default TeacherNavigator