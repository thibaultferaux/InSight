import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { ArrowRightIcon, BookOpenIcon } from 'react-native-heroicons/outline'
import FormInput from '../../Components/Form/FormInput'
import { makeCourseWithTeacher } from '../../../core/modules/course/api'

const MakeCourse = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { user } = route.params;
    const { control, handleSubmit } = useForm({
        defaultValues: {
            course: ''
        }
    });

    const handleMakeCourse = async ({ course }) => {
        try {
            setLoading(true);
            
            await makeCourseWithTeacher(course, user.id);

            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Er is iets mis gegaan bij het aanmaken van het vak. Probeer het later opnieuw.')
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 40 }}
            >
                <View className="justify-between items-start space-y-2">
                    <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon size={16} color="#9ca3af" />
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Maak vak aan</Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Geef een naam in en het vak wordt aangemaakt voor de leerkracht. </Text>
                </View>
                <View className="mt-12">
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-neutral-900 mb-1">Naam van het vak</Text>
                    <FormInput
                        name="course"
                        control={control}
                        rules={{ required: "Naam is verplicht" }}
                        autoCapitalize="words"
                        keyboardType="default"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(handleMakeCourse)}
                    >
                        <BookOpenIcon color="#0F172A" size={22} />
                    </FormInput>
                </View>
                <View className="mt-12 items-end">
                    <TouchableOpacity className={`${loading ? 'bg-violet-300': 'bg-violet-500'} py-[10px] px-[15px] flex-row space-x-2 rounded-lg`} onPress={handleSubmit(handleMakeCourse)} disabled={loading}>
                        <Text className="text-white">Maak</Text>
                        <ArrowRightIcon size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MakeCourse