import { View, Text, Modal, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { formatTime } from '../../../core/utils/dateTime';
import { useNavigation } from '@react-navigation/native';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { addStudentsToAttendance } from '../../../core/modules/attendance/api';
import { NfcNotEnabledAlert } from '../../../core/utils/nfc';
import { PencilIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';

const TeacherCurrentLesson = ({ currentLesson }) => {
    // const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleSetActive = async (lesson) => {
        
        if (await NfcProxy.isEnabled()) {
            setModalVisible(false);
            const { result, tag } = await NfcProxy.checkTag(lesson.classroomtag.id)
            if (result) {
                try {
                    await addStudentsToAttendance(lesson.course.id, lesson.id)
                } catch (error) {
                    console.error(error)
                    Alert.alert("Er is iets misgegaan met het activeren van de les. Probeer het later opnieuw.")
                }
            } else {
                if (tag) {
                    Alert.alert('Fout', 'Dit is niet het juiste lokaal');
                }
            }
        } else {
            NfcNotEnabledAlert(() => handleSetActive(lesson))
        }
    }

    return (
        <>
            {/* <Modal
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
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{new Date(currentLesson.startTime).toLocaleDateString()}</Text>
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
            </Modal> */}
            <TouchableOpacity className="bg-white rounded-3xl px-4 pt-4 pb-2 mb-4 overflow-hidden" onPress={ () => navigation.navigate('ViewAttendances', { lesson: currentLesson }) }>
                <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    className="absolute inset-0"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <View className="flex-row justify-between">
                    <Text className="text-base text-violet-300" style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                    <Text className="text-base bg-white px-3 py-1 pt-[5px] rounded-full" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.classroomtag.name }</Text>
                </View>
                <Text className="text-2xl mt-1 text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.course.name }</Text>
                <View className="items-center mt-3">
                    <Text className="text-violet-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om te bekijken</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default TeacherCurrentLesson