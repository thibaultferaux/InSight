import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LogoutAlert from '../../Components/Auth/LogoutAlert'
import { useAuthContext } from '../../Components/Auth/AuthProvider'
import { useForm } from 'react-hook-form'
import FormInput from '../../Components/Form/FormInput'
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { getStudentsForTeacher } from '../../../core/modules/users/api'

const StudentsOverview = () => {
    const { user } = useAuthContext();
    const [showLogout, setShowLogout] = useState(false)
    const [students, setStudents] = useState();
    const navigation = useNavigation();

    const { control, watch } = useForm({
        defaultValues: {
            search: '',
        }
    });

    useEffect(() => {
        getStudents()
    }, [])

    const getStudents = async () => {
        try {
            setStudents(null);

            const data = await getStudentsForTeacher(user.id);

            if (data) {
                setStudents(data)
            }

        } catch (error) {
            console.error(error)
            Alert.alert('Er is iets misgegaan met het ophalen van de studenten. Probeer het later opnieuw.')
        }
    }

        

    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 56 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row justify-between items-start mb-4">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Studenten</Text>
                    <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                        <ArrowRightOnRectangleIcon color="white" size={22} />
                    </TouchableOpacity>
                </View>

                <View className="mt-4">
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
                
                <View className="mt-4">
                    {students && (students.length > 0 ? 
                        students.filter((item) => {
                            return (item.first_name + ' ' + item.last_name).toLowerCase().includes(watch('search').toLowerCase())                     
                        }).map((student, index) => {
                            const name = student.first_name + ' ' + student.last_name;
                            const inputText = watch('search');
                            const indexMatch = name.toLowerCase().indexOf(inputText.toLowerCase());
                            const beforeMatch = name.slice(0, indexMatch);
                            const match = name.slice(indexMatch, indexMatch + inputText.length);
                            const afterMatch = name.slice(indexMatch + inputText.length);
                            
                            return (
                                <TouchableOpacity key={index} className="flex-row justify-between items-center py-4 border-b-[1px] border-gray-300" onPress={() => navigation.navigate('StudentDetails', { student })}>
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">
                                        {beforeMatch}
                                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-base text-neutral-900">{match}</Text>
                                        {afterMatch}
                                    </Text>
                                    <ArrowUpRightIcon size={24} color="#7C3AED" />
                                </TouchableOpacity>
                            )
                        }
                    ) : (
                        <View className="justify-center items-center mt-20 space-y-4">
                            <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen studenten gevonden</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </SafeAreaView>
    )
}

export default StudentsOverview