import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, CheckIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { RefreshControl } from 'react-native';

const ViewAttendances = ({ route }) => {
    const [borderColor, setBorderColor] = useState('#00000000');
    const { lesson } = route.params;
    const [ students, setStudents ] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        getAttendences()
        const attendanceListener = supabase
            .channel('public:presentstudent:lessonId=eq.' + lesson.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'presentstudent' },
                (payload) => {
                    getAttendences()
                }
            ).subscribe();
    }, [])

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    const getAttendences = async () => {
        try {
            const { data, error, status } = await supabase
                .from('presentstudent')
                .select('userId, present, presentAt, profiles(first_name, last_name)')
                .eq('lessonId', lesson.id)
                .order('presentAt', { ascending: true })

            if (error && status !== 406) {
                console.error(error);
                throw error
            }

            if (data) {
                // group by present true or false
                const grouped = data.reduce((acc, obj) => {
                    const key = obj.present ? 'present' : 'absent';
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});

                setStudents(grouped);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    }

    const setPresent = async (userId) => {
        try {
            const { error, status } = await supabase
                .from('presentstudent')
                .update({ present: true, presentAt: new Date() })
                .eq('userId', userId)
                .eq('lessonId', lesson.id)

            if (error && status !== 406) {
                console.error(error);
                throw error
            }

        } catch (error) {
            if (error) {
                Alert.alert('Fout', 'Er is iets fout gegaan, probeer het later opnieuw.');
            }
        }
    }

    const setAbsent = async (userId) => {
        try {
            const { error, status } = await supabase
                .from('presentstudent')
                .update({ present: false, presentAt: new Date() })
                .eq('userId', userId)
                .eq('lessonId', lesson.id)

            if (error && status !== 406) {
                console.error(error);
                throw error
            }

        } catch (error) {
            if (error) {
                Alert.alert('Fout', 'Er is iets fout gegaan, probeer het later opnieuw.');
            }
        }
    }


    const formatDate = (date) => {
        const someDate = new Date(date)
        // weekday as short form in dutch
        // day with leading zero
        const day = String(someDate.getDate()).padStart(2, '0');
        // month with leading zero
        const month = String(someDate.getMonth() + 1).padStart(2, '0');

        return `${day}/${month}`
    }

    const formatTime = (time) => {
        const someTime = new Date(time)
        // hours with leading zero
        const hours = String(someTime.getHours()).padStart(2, '0');
        // minutes with leading zero
        const minutes = String(someTime.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`
    }

    const onFocus = () => {
        setBorderColor('#a78bfa');
    }

    const onBlur = () => {
        setBorderColor('#00000000');
    }

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <View className="items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">{ lesson.course.name } - { formatDate(lesson.startTime) } </Text>
            </View>
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
                                    <TouchableOpacity className="flex-row items-center space-x-1" onPress={() => setAbsent(student.userId)} >
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
                                    <TouchableOpacity className="flex-row items-center space-x-1" onPress={() => setPresent(student.userId)}>
                                        <CheckIcon size={24} color="#C4C4C4" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewAttendances