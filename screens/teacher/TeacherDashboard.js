import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ArrowRightOnRectangleIcon, PlusIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeacherDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lessons, setLessons] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        setLoading(true)
        if (session) {
            getProfile()
            getLessons()
        }
        const lessonListener = supabase
            .channel('public:lesson')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lesson' },
                (payload) => {
                    getLessons()
                }
            ).subscribe();
        setLoading(false)
    }, [])

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    const getProfile = async () => {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session')

            let { data, error, status } = await supabase
                .from('profiles')
                .select('first_name')
                .eq('id', session?.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFirstName(data.first_name)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const getLessons = async () => {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session')

            let { data, error, status } = await supabase
                .from('lesson')
                .select('id, date, startTime, endTime, course(name), classroomtag(name)')
                .eq('course.teacherId', session?.user.id)

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                // group by day in an array
                const groupedLessons = data.reduce((r, a) => {
                    r[a.date] = [...r[a.date] || [], a];
                    return r;
                }, {});
                const groupedLessonsArray = Object.entries(groupedLessons).map(([date, items]) => ({ date, items }));
                setLessons(groupedLessonsArray);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    const logout = async () => {
        await AsyncStorage.removeItem('user')
        supabase.auth.signOut()
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-14">
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <View className="flex-row justify-between items-start mb-4">
                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {firstName},</Text>
                        <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => logout()}>
                            <ArrowRightOnRectangleIcon color="white" size={22} />
                        </TouchableOpacity>
                    </View>
                    <View className="mt-2">
                        <TouchableOpacity className="w-full rounded-full flex-row bg-violet-500 p-4 justify-center align-middle space-x-2" onPress={() => navigation.navigate("MakeLesson", { session })}>
                            <PlusIcon color="white" size={24} />
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-white mt-[2px]">Nieuwe les</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default TeacherDashboard