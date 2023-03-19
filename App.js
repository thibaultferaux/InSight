import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';
import AdminDashboard from './screens/admin/AdminDashboard';
import MakeClassroom from './screens/admin/MakeClassroom';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import StudentDashboard from './screens/student/StudentDashboard';
import TeacherDashboard from './screens/teacher/TeacherDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScanClassroom from './screens/admin/ScanClassroom';
import ScanSuccess from './screens/admin/ScanSuccess';
import MakeLesson from './screens/teacher/MakeLesson';


export default function App() {
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
        <NavigationContainer>
            <SafeAreaProvider>

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
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Dashboard" component={StudentDashboard} initialParams={{ session: session }} />
                            </>
                        ))) : (
                            <>
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="Register" component={RegisterScreen} />
                            </>
                        )}
                    </Stack.Group>
                </Stack.Navigator>
                <FlashMessage position="top" />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}