import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, PlusIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
                .order('date', { ascending: true })
                .order('startTime', { ascending: true })

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

    // check if date is equal to today
    const isToday = (date) => {
        const today = new Date()
        const someDate = new Date(date)
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }

    const formatDate = (date) => {
        const someDate = new Date(date)
        // weekday as short form in dutch
        const weekday = someDate.getDay();
        const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
        const weekdayName = weekdays[weekday];
        // day with leading zero
        const day = String(someDate.getDate()).padStart(2, '0');
        // month with leading zero
        const month = String(someDate.getMonth() + 1).padStart(2, '0');

        return `${weekdayName} ${day}/${month}`
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
        <SafeAreaView className="flex-1 justify-start bg-slate-50 px-7 pt-14">
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
                    <View className="mt-4 space-y-4">
                        {lessons.map((lesson, index) => (
                            <View key={index} className={`border-b-gray-300 pb-3 ${index === lessons.length - 1 ? 'border-none' : 'border-b-[1px]'}`}>
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400">{ isToday(lesson.date) ? 'Vandaag' : formatDate(lesson.date)}</Text>
                                {lesson.items.map((item, index) => (
                                    <View key={index} className="flex-row justify-between bg-white shadow-lg shadow-black/40 mb-2 p-3 rounded-2xl">
                                        <View className="justify-between">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{item.course.name}</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{item.startTime} - {item.endTime}</Text>
                                        </View>
                                        <View className="justify-between items-end space-y-2">
                                            <ArrowUpRightIcon color="#c4b5fd" size={24} />
                                            <LinearGradient
                                                colors={['#E5E6EA', '#F8FAFC', '#F8FAFC']}
                                                start={{ x: 1, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                className="px-2 py-[1px] rounded-full shadow-inner shadow-black/40 bg-slate-50"
                                            >
                                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm uppercase">{item.classroomtag.name}</Text>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default TeacherDashboard