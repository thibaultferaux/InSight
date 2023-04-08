import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, PencilIcon, PlusIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDate, formatTime, isToday } from '../../../core/utils/dateTime';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { addStudentsToAttendance } from '../../../core/modules/attendance/api';
import { supabase } from '../../../core/api/supabase';
import { useAuthContext } from '../../../../Components/Auth/AuthProvider';
import LogoutAlert from '../../../../Components/Auth/LogoutAlert';
import { getLessonsForTeacher } from '../../../core/modules/lesson/api';

const TeacherDashboard = () => {
    const { user } = useAuthContext();
    const [refreshing, setRefreshing] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        getLessons()
        const lessonListener = supabase
            .channel('public:lesson')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lesson' },
                (payload) => {
                    getLessons()
                }
            ).subscribe();
    }, [])

    const getLessons = async () => {
        try {
            setRefreshing(true);
            setCurrentLesson(null);

            await getLessonsForTeacher(user.id, setLessons, setCurrentLesson);

        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het ophalen van de lessen. Probeer het later opnieuw.")
        } finally {
            setRefreshing(false)
        }
    }

    const handleSetActive = async (lesson) => {
        setModalVisible(false);
        const resp = await NfcProxy.checkTag(lesson.classroomtag.id)
        if (resp) {
            try {
                await addStudentsToAttendance(lesson.course.id, lesson.id)
            } catch (error) {
                console.error(error)
                Alert.alert("Er is iets misgegaan met het activeren van de les. Probeer het later opnieuw.")
            }
        } else {
            Alert.alert('Fout', 'Dit is niet het juiste lokaal');
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
            <ScrollView
                refreshControl={
                    <RefreshControl onRefresh={getLessons} refreshing={refreshing} />
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
                    {currentLesson && (
                        <>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <View className="flex-1 justify-center items-center w-full px-12">
                                    <View className="bg-white rounded-3xl w-full mb-16 shadow-2xl shadow-black px-6 py-4">
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xl">Lesinfo</Text>
                                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                                <XMarkIcon color="#d4d4d4" size={32} />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex-row space-x-1">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Klas:</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{ currentLesson.classroomtag.name }</Text>
                                        </View>
                                        <View className="flex-row space-x-1">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Les:</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{currentLesson.course.name}</Text>
                                        </View>
                                        <View className="flex-row space-x-1">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Datum:</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{new Date(currentLesson.startTime).toLocaleDateString('nl_BE')}</Text>
                                        </View>
                                        <View className="flex-row space-x-1">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Tijd:</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{formatTime(currentLesson.startTime)} - {formatTime(currentLesson.endTime)}</Text>
                                        </View>
                                        <View className="mt-4 flex-row gap">
                                            <TouchableOpacity className="bg-violet-500 items-center py-3 rounded-xl flex-1 mr-1" onPress={() => handleSetActive(currentLesson)}>
                                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-white mt-[2px]">Zet actief</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="bg-neutral-400 items-center rounded-xl aspect-square justify-center">
                                                <PencilIcon color="white" size={22} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <TouchableOpacity className="bg-white rounded-3xl px-4 pt-4 pb-2 mb-4 overflow-hidden" onPress={ () => !currentLesson.active ? setModalVisible(true) : navigation.navigate('ViewAttendances', { lesson: currentLesson }) }>
                                <LinearGradient
                                    colors={currentLesson.active ? ['#7C3AED', '#A855F7'] : ['#E7EBF0', '#D1D5DB']}
                                    className="absolute inset-0"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <View className="flex-row justify-between">
                                    <Text className={`text-base ${currentLesson.active ? 'text-violet-300' : 'text-gray-500'}`} style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                                    <Text className="text-base bg-white px-3 py-1 pt-[5px] rounded-full" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.classroomtag.name }</Text>
                                </View>
                                <Text className={`text-2xl mt-1 ${currentLesson.active && 'text-white'}`} style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.course.name }</Text>
                                <View className="items-center mt-3">
                                    { currentLesson.active ? (
                                        <Text className="text-violet-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om te bekijken</Text>
                                    ) : (
                                        <Text className="text-slate-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om actief te zetten</Text>
                                    ) }
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                    <View className="mt-2">
                        <TouchableOpacity className="w-full rounded-full flex-row bg-violet-500 p-4 justify-center align-middle space-x-2" onPress={() => navigation.navigate("MakeLesson", { userId: user.id })}>
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
                                        <View className="justify-between space-y-3">
                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{item.course.name}</Text>
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
                                        </View>
                                        <View className="justify-between items-end">
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
                </View>
            </ScrollView>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </SafeAreaView>
    )
}

export default TeacherDashboard