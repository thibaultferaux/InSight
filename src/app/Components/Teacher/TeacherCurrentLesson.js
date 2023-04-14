import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { formatTime } from '../../../core/utils/dateTime';
import { useNavigation } from '@react-navigation/native';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { addStudentsToAttendance } from '../../../core/modules/attendance/api';
import { NfcNotEnabledAlert } from '../../../core/utils/nfc';
import { LinearGradient } from 'expo-linear-gradient';

const TeacherCurrentLesson = ({ currentLesson }) => {
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
        <TouchableOpacity className="bg-white rounded-3xl px-4 pt-4 pb-2 mb-4 overflow-hidden" onPress={ () => navigation.navigate('ViewAttendances', { lesson: currentLesson }) }>
            <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                className="absolute inset-0"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View className="flex-row justify-between">
                <Text className="text-base text-violet-300" style={{ fontFamily: 'Poppins_500Medium' }}>{ formatTime(currentLesson.startTime)} - { formatTime(currentLesson.endTime) }</Text>
                <Text className="text-base bg-white px-3 py-1 pt-[5px] rounded-full text-neutral-900" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.classroomtag.name }</Text>
            </View>
            <Text className="text-2xl mt-1 text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>{ currentLesson.course.name }</Text>
            <View className="items-center mt-3">
                <Text className="text-violet-400" style={{ fontFamily: 'Poppins_500Medium' }}>klik om te bekijken</Text>
            </View>
        </TouchableOpacity>
    )
}

export default TeacherCurrentLesson