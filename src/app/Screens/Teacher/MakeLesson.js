import { View, Text, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { combineDateAndTime } from '../../../core/utils/dateTime';
import { makeLesson } from '../../../core/modules/lesson/api';
import { showMessage } from 'react-native-flash-message';
import LessonForm from '../../Components/Form/LessonForm';

const MakeLesson = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const onSubmit = async ({ subject, classroom, date, startTime, endTime}) => {
        setLoading(true);
        try {
            await makeLesson(subject.id, classroom.id, combineDateAndTime(date, startTime), combineDateAndTime(date, endTime));

            showMessage({
                message: "De les is succesvol aangemaakt",
                type: "success",
                style: { paddingTop: insets.top + 15 },
                duration: 3000,
                icon: 'success',
                position: 'left'
            })
            navigation.goBack()
        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het aanmaken van de les. Probeer het later opnieuw.")
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
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Maak les aan</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Selecteer het vak en vul bijhorende info in over de les.</Text>
            </View>
            <LessonForm onSubmit={onSubmit} submitLabel="Maak" loading={loading} />
        </SafeAreaView>
    )
}

export default MakeLesson