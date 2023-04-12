import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, CheckIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { supabase } from '../../../core/api/supabase';
import { getAttendencesForLesson, setAbsent, setPresent } from '../../../core/modules/attendance/api';
import { formatDateShort, formatTime } from '../../../core/utils/dateTime';
import { useForm } from 'react-hook-form';
import FormInput from '../../Components/Form/FormInput';
import { filterStudents } from '../../../core/utils/students';

const ViewAttendances = ({ route }) => {
    const [borderColor, setBorderColor] = useState('#00000000');
    const { lesson } = route.params;
    const [ students, setStudents ] = useState();
    const [filteredStudents, setFilteredStudents] = useState();

    const { control, watch } = useForm({
        defaultValues: {
            search: '',
        }
    });

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

    useEffect(() => {
        if (students) {
            setFilteredStudents(filterStudents(students, watch('search')));
        }
    }, [watch('search')])

    const getAttendences = async () => {
        try {
            const data = await getAttendencesForLesson(lesson.id);

            if (data) {
                setStudents(data);
                setFilteredStudents(data);
            }
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

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-10">
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
                    <View className="mt-6">
                        <FormInput
                            name="search"
                            placeholder="Zoek een student"
                            control={control}
                            autoCapitalize="words"
                            returnKeyType="search"
                            onSubmitEditing={Keyboard.dismiss}
                        >
                            <MagnifyingGlassIcon size={22} color="#0F172A" />
                        </FormInput>
                    </View>
                    <ScrollView
                        className="mt-2 flex-1"
                        vertical
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 48 }}
                    >
                        
                        { filteredStudents && ((filteredStudents.present || filteredStudents.absent) ? (
                            <>
                                {filteredStudents.present && (
                                    <View className="mt-6">
                                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-400">Aanwezig</Text>
                                        <View className="mt-3 space-y-3">
                                            { filteredStudents.present.map((student, index) => (
                                                <View key={index} className="flex-row justify-between items-center">
                                                    <View className="flex-row items-center space-x-2">
                                                        <CheckCircleIcon size={34} color="#10B981" />
                                                        <View>
                                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{ student.profiles.first_name } { student.profiles.last_name }</Text>
                                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-300 -mt-1">{ formatTime(student.presentAt) }</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity className="flex-row items-center p-2 space-x-1" onPress={() => handleSetAbsent(student.userId)} >
                                                        <XMarkIcon size={24} color="#C4C4C4" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                                {filteredStudents.absent && (
                                    <View className="mt-6">
                                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-400">Afwezig</Text>
                                        <View className="mt-3 space-y-3">
                                            { filteredStudents.absent.map((student, index) => (
                                                <View key={index} className="flex-row justify-between items-center">
                                                    <View className="flex-row items-center space-x-2">
                                                        <XCircleIcon size={34} color="#EF4444" />
                                                        <View>
                                                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{ student.profiles.first_name } { student.profiles.last_name }</Text>
                                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-300 -mt-1">{ formatTime(student.presentAt) }</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity className="flex-row items-center p-2 space-x-1" onPress={() => handleSetPresent(student.userId)}>
                                                        <CheckIcon size={24} color="#C4C4C4" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </>
                            ) : (
                                <View className="justify-center items-center mt-20 space-y-4">
                                    <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen studenten gevonden</Text>
                                </View>
                            )
                        )}
                    </ScrollView>
                </>
            ))}
        </SafeAreaView>
    )
}

export default ViewAttendances