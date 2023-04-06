import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { supabase } from '../core/api/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AdminDashboard from '../screens/admin/AdminDashboard'
import MakeClassroom from '../screens/admin/MakeClassroom'
import ScanClassroom from '../screens/admin/ScanClassroom'
import ScanSuccess from '../screens/admin/ScanSuccess'
import TeacherDashboard from '../screens/teacher/TeacherDashboard'
import MakeLesson from '../screens/teacher/MakeLesson'
import ScanActive from '../screens/teacher/ScanActive'
import ViewAttendances from '../screens/teacher/ViewAttendances'
import StudentDashboard from '../screens/student/StudentDashboard'
import ScanAttendance from '../screens/student/ScanAttendance'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import { getCurrentSession } from '../core/modules/auth/api'

const AppNavigator = () => {
    const [session, setSession] = useState(null)
    const [role, setRole] = useState(0)

    const Stack = createNativeStackNavigator();

    useEffect(() => {
        getUser();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    useEffect(() => {
        if (session && session.user) {
            const getRole = async () => {
                try {
                    let { data, error, status } = await supabase
                        .from('profiles')
                        .select('role_id')
                        .eq('id', session.user.id)
                        .single()

                    if (error && status !== 406) {
                        throw error
                    }

                    if (data) {
                        setRole(data.role_id)
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        Alert.alert(error)
                    }
                }
            }

            getRole();
        }
    }, [session])

    const getUser = async () => {
        let result = await AsyncStorage.getItem('user');
        if (result) {
            let { email, password } = JSON.parse(result);
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            if (error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ headerShown: false }}>
                {session && session.user ? (role === 3 ? (
                    <>
                        <Stack.Screen name="Dashboard" component={AdminDashboard} initialParams={{ session: session }} />
                        <Stack.Screen name="MakeClassroom" component={MakeClassroom} />
                        <Stack.Screen name="ScanClassroom" component={ScanClassroom} />
                        <Stack.Screen name="ScanSuccess" component={ScanSuccess} />
                    </>
                ) : (role === 2 ? (
                    <>
                        <Stack.Screen name="Dashboard" component={TeacherDashboard} initialParams={{ session: session }} />
                        <Stack.Screen name="MakeLesson" component={MakeLesson} />
                        <Stack.Screen name="ScanActive" component={ScanActive} />
                        <Stack.Screen name="ViewAttendances" component={ViewAttendances} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Dashboard" component={StudentDashboard} initialParams={{ session: session }} />
                        <Stack.Screen name="ScanAttendance" component={ScanAttendance} />
                    </>
                ))) : (
                    <>
                        <Stack.Screen name="Login" component={ LoginScreen } />
                        <Stack.Screen name="Register" component={ RegisterScreen } />
                    </>
                )}
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AppNavigator