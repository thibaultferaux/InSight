import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MakeClassroom from '../Screens/Admin/MakeClassroom';
import AdminDashboard from '../Screens/Admin/AdminDashboard';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import EditClassroom from '../Screens/Admin/EditClassroom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TagIcon, UserGroupIcon } from 'react-native-heroicons/outline';
import UsersOverview from '../Screens/Admin/UsersOverview';

const getTabBarIcon = (name, color) => {
    switch (name) {
        case 'Tags':
            return <TagIcon size={30} color={color}  />;
        case 'Gebruikers':
            return <UserGroupIcon size={30} color={color}  />;
    }
}

const AdminTabs = () => {
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
                <Tab.Screen name="Tags" component={AdminDashboard} />
                <Tab.Screen name="Gebruikers" component={UsersOverview} />
            </Tab.Group>
        </Tab.Navigator>
    )

}

const AdminNavigator = () => {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
    })

    const Stack = createNativeStackNavigator();
    
    return (
        <>
            <Stack.Navigator>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={AdminTabs} />
                    <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
                    <Stack.Screen name="EditClassroom" component={EditClassroom} />
                </Stack.Group>
            </Stack.Navigator>
            <StatusBar style='dark' animated backgroundColor='#f8fafc' />
        </>
    )
}

export default AdminNavigator