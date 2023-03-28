import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, ClockIcon, MapPinIcon, PlusIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const TeacherDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState({});
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
                .select('id, startTime, endTime, course(name), classroomtag(name)')
                .eq('course.teacherId', session?.user.id)
                .order('startTime', { ascending: true })
                .gte('endTime', new Date().toISOString())

                
                if (error && status !== 406) {
                    throw error
                }
                
            if (data) {
                // check if date and startTime is before now and else if date is today and now is between startTime and endTime else add to array
                const filteredLessons = data.filter(lesson => {
                    const now = new Date()
                    const startTime = new Date(lesson.startTime)
                    const endTime = new Date(lesson.endTime)
                    // if day of date is before today, return false
                    if (startTime < now && endTime > now) {
                        setCurrentLesson(lesson);
                        return false
                    } else {
                        return true
                    }
                });

                // group by day in an array
                const groupedLessons = filteredLessons.reduce((r, a) => {
                    r[a.startTime] = [...r[a.startTime] || [], a];
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

    const formatTime = (time) => {
        const someTime = new Date(time)
        // hours with leading zero
        const hours = String(someTime.getHours()).padStart(2, '0');
        // minutes with leading zero
        const minutes = String(someTime.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`
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
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={getLessons} />
                    }
                >
                    <View className="flex-row justify-between items-start mb-4">
                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {firstName},</Text>
                        <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => logout()}>
                            <ArrowRightOnRectangleIcon color="white" size={22} />
                        </TouchableOpacity>
                    </View>
                    {/* if currentlesson */}
                    {currentLesson.id && (
                        <View className="bg-white rounded-md p-4 mb-4">
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400">Huidige les</Text>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <View className="bg-neutral-900 rounded-full w-8 h-8 flex-row justify-center items-center">
                                        <ClockIcon color="white" size={16} />
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base ml-2">{formatDate(currentLesson.startTime)} {formatTime(currentLesson.startTime)} - {formatTime(currentLesson.endTime)}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="bg-neutral-900 rounded-full w-8 h-8 flex-row justify-center items-center">
                                        <MapPinIcon color="white" size={16} />
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base ml-2">{currentLesson.classroomtag.name}</Text>
                                </View>
                            </View>
                        </View>
                    )}
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
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
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
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default TeacherDashboard