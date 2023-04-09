import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import LogoutAlert from '../../Components/Auth/LogoutAlert';
import { supabase } from '../../../core/api/supabase';
import DateSlider from '../../Components/Data/DateSlider';
import BlinkingDot from '../../Components/Animations/BlinkingDot';
import { getLessonsForStudent } from '../../../core/modules/lesson/api';
import { formatTime, isToday } from '../../../core/utils/dateTime';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { makeStudentPresent } from '../../../core/modules/attendance/api';
import { NfcNotEnabledAlert } from '../../../core/utils/nfc';

const StudentDashboard = () => {
    const { user } = useAuthContext();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        getLessons()
        const attendanceListener = supabase
            .channel('public:presentstudent:userId=eq.' + user.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'presentstudent', filter: 'userId=eq.' + user.id },
                (payload) => {
                    getLessons()
                }
            ).subscribe();
        const lessonListender = supabase
            .channel('public:lesson')
            .on('postgres_changes', { event: 'update', schema: 'public', table: 'lesson' },
                (payload) => {
                    getLessons()
                }
            ).subscribe();
    }, [])

    const getLessons = async () => {
        try {
            setRefreshing(true);
            setCurrentLesson(null);
            
            await getLessonsForStudent(user.id, setLessons, setCurrentLesson)

        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het ophalen van de lessen. Probeer het later opnieuw.")
        } finally {
            setRefreshing(false);
        }
    }

    const handleDaySelected = (day) => {
        setSelectedDay(day)
    }

    const handleSetPresent = async (lesson) => {
        setLoading(true);

        if (await NfcProxy.isEnabled()) {
            const { result, tag } = await NfcProxy.checkTag(lesson.classroomtagId);
    
            if (result) {
                try {
                    await makeStudentPresent(lesson.id, user.id);
                } catch (error) {
                    Alert.alert("Er is iets misgegaan met het aanwezig zetten. Probeer het later opnieuw.")
                }
            } else {
                if (tag) {
                    Alert.alert("Deze les is niet in deze klas.")
                }
            }
        } else {
            NfcNotEnabledAlert(() => handleSetPresent(lesson))
        }
        setLoading(false)
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getLessons} />
                    }
                >
                    <View className="px-7 pt-14">
                        <View className="flex-row justify-between items-start mb-4">
                            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {user.first_name},</Text>
                            <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                                <ArrowRightOnRectangleIcon color="white" size={22} />
                            </TouchableOpacity>
                        </View>


                        {/* if there is a lesson at current time */}
                        {currentLesson && (currentLesson.present ? (
                            <TouchableOpacity className="bg-white rounded-full px-4 mb-4 overflow-hidden" disabled={loading}>
                                <LinearGradient
                                    colors={['#7C3AED', '#A855F7']}
                                    className="absolute inset-0"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <View className="flex-row justify-between items-center py-2">
                                    <View className="flex-row items-center">
                                        <Text className="text-base text-violet-300 mr-1 pt-[1px]" style={{ fontFamily: 'Poppins_500Medium' }}>{ currentLesson.courseName } - Aanwezig</Text>
                                        <BlinkingDot />
                                    </View>
                                    <Text className="text-sm text-violet-300 pt-[1px]" style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className="bg-white rounded-3xl px-4 pt-4 pb-2 mb-4 overflow-hidden" onPress={() => handleSetPresent(currentLesson)}>
                                <LinearGradient
                                    colors={['#7C3AED', '#A855F7']}
                                    className="absolute inset-0"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <View className="flex-row justify-between">
                                    <Text className="text-base text-violet-300" style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                                    <Text className="text-base bg-white px-3 py-1 pt-[5px] rounded-full" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.classroomtagName }</Text>
                                </View>
                                <Text className="text-2xl mt-1 text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.courseName }</Text>
                                <View className="items-center mt-3">
                                    <Text className="text-violet-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om aanwezig te zetten</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* make a horizontal slider with days after today to select */}
                        <DateSlider lessons={lessons} onDaySelected={handleDaySelected} />
                        

                        <View className="space-y-4">
                            { selectedDay && (selectedDay.items.length > 0 ? (
                                <View>
                                    {
                                        selectedDay.items.map((item, index) => (
                                            <View key={index} className={`border-b-gray-300 pb-3 flex-row space-x-4 ${index === selectedDay.items.length - 1 ? 'border-none mt-4' : index == 0 ? 'border-b-[1px]' : 'border-b-[1px] mt-4'}`}>
                                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400 pt-4">{ formatTime(item.startTime) }</Text>
                                                <View className="flex-1 flex-row justify-between bg-white shadow-lg shadow-black/40 mb-2 p-3 rounded-2xl">
                                                    <View className="justify-between space-y-2">
                                                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{item.courseName}</Text>
                                                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{ formatTime(item.startTime) } - { formatTime(item.endTime) }</Text>
                                                    </View>
                                                    <View className="justify-end">
                                                        <LinearGradient
                                                            colors={['#E5E6EA', '#F8FAFC', '#F8FAFC']}
                                                            start={{ x: 1, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            className="px-2 py-[1px] rounded-full shadow-inner shadow-black/40 bg-slate-50"
                                                        >
                                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm uppercase">{item.classroomtagName}</Text>
                                                        </LinearGradient>
                                                    </View>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                            ) : isToday(selectedDay.date) ? (
                                // TODO: add illustration
                                <View className="flex-row justify-center items-center">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen verdere lessen vandaag</Text>
                                </View>
                            ) : (
                                <View className="flex-row justify-center items-center">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen lessen deze dag</Text>
                                </View>
                            ))}
                            
                        </View>
                    </View>
                </ScrollView>
                { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </SafeAreaView>
    )
}

export default StudentDashboard