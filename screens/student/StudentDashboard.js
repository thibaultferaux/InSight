import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import DateSlider from './components/DateSlider';

const StudentDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        if (session) {
            getProfile()
            getLessons()
        }
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

            // get all lessons from the user
            let { data, error, status } = await supabase.rpc('getLessons', { profileId: session?.user.id });
                
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                const filteredLessons = data.filter(lesson => {
                    const now = new Date()
                    const startTime = new Date(lesson.startTime)
                    const endTime = new Date(lesson.endTime)
                    if (startTime < now && endTime > now) {
                        setCurrentLesson(lesson);
                        return false
                    } else {
                        return true
                    }
                });

                // group by day
                const groupedLessons = filteredLessons.reduce((r, a) => {
                    r[a.startTime.split('T')[0]] = [...r[a.startTime.split('T')[0]] || [], a];
                    return r;
                }, {});

                // convert object to array
                const groupedLessonsArray = Object.entries(groupedLessons).map(([date, items]) => ({ date, items }));

                setLessons(groupedLessonsArray)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDaySelected = (day) => {
        setSelectedDay(day)
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

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={getLessons} />
                    }
                >
                    <View className="px-7 pt-14">
                        <View className="flex-row justify-between items-start mb-4">
                            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {firstName},</Text>
                            <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => logout()}>
                                <ArrowRightOnRectangleIcon color="white" size={22} />
                            </TouchableOpacity>
                        </View>


                        {/* if there is a lesson at current time */}
                        {currentLesson && (
                            <TouchableOpacity className="bg-white rounded-3xl px-4 pt-4 pb-2 mb-4 overflow-hidden">
                                <LinearGradient
                                    colors={currentLesson.active ? ['#7C3AED', '#A855F7'] : ['#E7EBF0', '#D1D5DB']}
                                    className="absolute inset-0"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <View className="flex-row justify-between">
                                    <Text className={`text-base ${currentLesson.active ? 'text-violet-300' : 'text-gray-500'}`} style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                                    <Text className="text-base bg-white px-3 py-1 pt-[5px] rounded-full" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.classroomtagName }</Text>
                                </View>
                                <Text className={`text-2xl mt-1 ${currentLesson.active && 'text-white'}`} style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.courseName }</Text>
                                <View className="items-center mt-3">
                                    { currentLesson.active ? (
                                        <Text className="text-violet-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om te bekijken</Text>
                                    ) : (
                                        <Text className="text-slate-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om actief te zetten</Text>
                                    ) }
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* make a horizontal slider with days after today to select */}
                        <DateSlider lessons={lessons} onDaySelected={handleDaySelected} />
                        

                        <View className="mt-4 space-y-4">
                            { selectedDay && selectedDay.items.length > 0 ? (
                                <View>
                                    {
                                        selectedDay.items.map((item, index) => (
                                            <View key={index} className={`border-b-gray-300 pb-3 ${index === selectedDay.items.length - 1 ? 'border-none' : 'border-b-[1px]'}`}>
                                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400">{ isToday(item.startTime) ? 'Vandaag' : formatDate(item.startTime)}</Text>
                                                <View className="flex-row justify-between bg-white shadow-lg shadow-black/40 mb-2 p-3 rounded-2xl">
                                                    <View className="justify-between">
                                                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{item.courseName}</Text>
                                                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-400">{item.classroomtagName}</Text>
                                                    </View>
                                                    <View className="flex-row items-center">
                                                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-400">{ formatTime(item.startTime)} - { formatTime(item.endTime) }</Text>
                                                        <View className="bg-neutral-900 p-2 rounded-md ml-3">
                                                            <ArrowRightOnRectangleIcon color="white" size={22} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                            ) : isToday(selectedDay.date) ? (
                                // TODO: add illustration
                                <View className="flex-row justify-center items-center">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-slate-400">Geen verdere lessen vandaag</Text>
                                </View>
                            ) : (
                                <View className="flex-row justify-center items-center">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-slate-400">Geen lessen deze dag</Text>
                                </View>
                            )}
                            
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default StudentDashboard