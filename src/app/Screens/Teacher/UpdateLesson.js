import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import LessonForm from '../../Components/Form/LessonForm';
import { updateLesson } from '../../../core/modules/lesson/api';
import { Alert } from 'react-native';
import { combineDateAndTime } from '../../../core/utils/dateTime';
import { showMessage } from 'react-native-flash-message';

const UpdateLesson = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const { lesson } = route.params;
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const onSubmit = async ({ subject, classroom, date, startTime, endTime}) => {
        setLoading(true);
        try {
            await updateLesson(lesson.id, subject.id, classroom.id, combineDateAndTime(date, startTime), combineDateAndTime(date, endTime));

            showMessage({
                message: "De les is succesvol aangepast",
                type: "success",
                style: { paddingTop: insets.top + 15 },
                duration: 3000,
                icon: 'success',
                position: 'left'
            })
            navigation.goBack();
        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het wijzigen van de les. Probeer het later opnieuw.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-10">
            <View className="justify-between items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl text-neutral-900">Les bewerken</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Verander gewenste velden over de les.</Text>
            </View>
            <LessonForm lesson={lesson} onSubmit={onSubmit} submitLabel="Update" loading={loading}  />
        </SafeAreaView>
    )
}

export default UpdateLesson