import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, CheckIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { supabase } from '../../../core/api/supabase';
import { getAttendencesForLesson, setAbsent, setPresent } from '../../../core/modules/attendance/api';
import { formatDateShort, formatTime } from '../../../core/utils/dateTime';

const ViewAttendances = ({ route }) => {
    const [borderColor, setBorderColor] = useState('#00000000');
    const { lesson } = route.params;
    const [ students, setStudents ] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        getAttendences()
        const attendanceListener = supabase
            .channel('public:presentstudent:lessonId=eq.' + lesson.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'presentstudent', filter: 'lessonId=eq.' + lesson.id },
                (payload) => {
                    getAttendences()
                }
            ).subscribe();
    }, [])

    const getAttendences = async () => {
        try {
            await getAttendencesForLesson(lesson.id, setStudents);
        } catch (error) {
            console.error(error);
            Alert.alert('Fout', 'Er is iets fout gegaan, probeer het later opnieuw.');
        }
    }

    const handleSetPresent = async (userId) => {
        try {
            
            await setPresent(userId, lesson.id);

        } catch (error) {
            console.error(error);
            Alert.alert('Fout', 'Er is iets fout gegaan, probeer het later opnieuw.');
        }
    }

    const handleSetAbsent = async (userId) => {
        try {
            
            await setAbsent(userId, lesson.id);

        } catch (error) {
            if (error) {
                Alert.alert('Fout', 'Er is iets fout gegaan, probeer het later opnieuw.');
            }
        }
    }

    const onFocus = () => {
        setBorderColor('#a78bfa');
    }

    const onBlur = () => {
        setBorderColor('#00000000');
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <View className="items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">{ lesson.course.name } - { formatDateShort(lesson.startTime) } </Text>
            </View>
            { students && ((!students.present && !students.absent) ? (
                <View className="flex-1 flex-row justify-center items-center">
                    <View className="mb-16 space-y-4">
                        <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen studenten gevonden</Text>
                    </View>
                </View>
            ) : (
                <>
                    <View className="h-[52px] mt-6">
                        <View className="flex-1 flex-row items-center bg-slate-100 px-4 rounded-[10px] space-x-4 border" style={{ borderColor: borderColor }}>
                            <MagnifyingGlassIcon size={22} color="#0F172A" />
                            <TextInput
                                placeholder='Zoek een student'
                                keyboardType='default'
                                placeholderTextColor="#6B7280"
                                style={{ fontFamily: 'Poppins_400Regular', paddingTop: 4, paddingBottom: 0 }}
                                textAlignVertical="center"
                                className="flex-1 text-sm text-slate-900 font-normal align-text-bottom focus:border-violet-500"
                                autoCapitalize='words'
                                onFocus={() => onFocus()}
                                onBlur={() => onBlur()}
                            />
                        </View>
                    </View>
                    <ScrollView className="mt-2 flex-1" vertical>
                        { students.present && (
                            <View className="mt-6">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-400">Aanwezig</Text>
                                <View className="mt-3 space-y-3">
                                    { students.present.map((student, index) => (
                                        <View key={index} className="flex-row justify-between items-center">
                                            <View className="flex-row items-center space-x-2">
                                                <CheckCircleIcon size={34} color="#10B981" />
                                                <View>
                                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{ student.profiles.first_name } { student.profiles.last_name }</Text>
                                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-300 -mt-1">{ formatTime(student.presentAt) }</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity className="flex-row items-center space-x-1" onPress={() => handleSetAbsent(student.userId)} >
                                                <XMarkIcon size={24} color="#C4C4C4" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        { students.absent && (
                            <View className="mt-6">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-400">Afwezig</Text>
                                <View className="mt-3 space-y-3">
                                    { students.absent.map((student, index) => (
                                        <View key={index} className="flex-row justify-between items-center">
                                            <View className="flex-row items-center space-x-2">
                                                <XCircleIcon size={34} color="#EF4444" />
                                                <View>
                                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{ student.profiles.first_name } { student.profiles.last_name }</Text>
                                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-300 -mt-1">{ formatTime(student.presentAt) }</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity className="flex-row items-center space-x-1" onPress={() => handleSetPresent(student.userId)}>
                                                <CheckIcon size={24} color="#C4C4C4" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        
                    </ScrollView>
                </>
            ))}
        </SafeAreaView>
    )
}

export default ViewAttendances