import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import MakeClassroom from './MakeClassroom';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../core/api/supabase';
import LogoutAlert from '../../Components/Auth/LogoutAlert';
import { getAllClassrooms } from '../../../core/modules/classroom/api';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import { useForm } from 'react-hook-form';
import FormInput from '../../Components/Form/FormInput';

const AdminDashboard = () => {
    const [classrooms, setClassrooms] = useState();
    const [showLogout, setShowLogout] = useState(false);
    const navigation = useNavigation();

    const { control, watch } = useForm({
        defaultValues: {
            search: '',
        }
    })

    useEffect(() => {
        getClassrooms()
        const classroomListener = supabase
            .channel('public:classroomtag')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'classroomtag' },
                (payload) => {
                    getClassrooms()
                }
            ).subscribe();
        // return classroomListener.unsubscribe()
    }, [])

    const getClassrooms = async () => {
        try {
            const data = await getAllClassrooms();

            if (data) {
                setClassrooms(data)
            } else {
                setClassrooms(null)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 56 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row justify-between items-start">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Tags</Text>
                    <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                        <ArrowRightOnRectangleIcon color="white" size={22} />
                    </TouchableOpacity>
                </View>
                <View className="mt-4 flex-row">
                    <View className="flex-1 mr-4">
                        <FormInput
                            name="search"
                            placeholder="Zoek je lokaal"
                            control={control}
                            autoCapitalize='none'
                            returnKeyType='search'
                            onSubmitEditing={Keyboard.dismiss}
                        >
                            <MagnifyingGlassIcon size={22} color="#0F172A" />
                        </FormInput>
                    </View>
                    <TouchableOpacity className="bg-violet-500 justify-center h-fit aspect-square items-center rounded-2xl" onPress={() => navigation.navigate(MakeClassroom)}>
                        <PlusIcon size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="mt-4">
                    {classrooms && (classrooms.length > 0 ?
                        classrooms.filter((item) => {
                            return (item.name.toLowerCase().includes(watch('search').toLowerCase()))
                        }).map((classroom, index) => {
                            const indexMatch = classroom.name.toLowerCase().indexOf(watch('search').toLowerCase());
                            const beforeMatch = classroom.name.substring(0, indexMatch);
                            const match = classroom.name.slice(indexMatch, indexMatch + watch('search').length);
                            const afterMatch = classroom.name.slice(indexMatch + watch('search').length);

                            return (
                                <TouchableOpacity key={index} className="flex-row justify-between items-center py-4 border-b-[1px] border-gray-300" onPress={() => navigation.navigate('EditClassroom', {classroom: classroom})}>
                                    <View className="space-y-2">
                                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xl text-neutral-900">
                                            {beforeMatch}
                                            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xl text-neutral-900">{match}</Text>
                                            {afterMatch}
                                        </Text>
                                        <View className="flex-col">
                                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xs text-gray-400">#{classroom.id}</Text>
                                        </View>
                                    </View>
                                    <View className="">
                                        <ArrowUpRightIcon size={24} color="#7C3AED" />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    ) : (
                            <View className="justify-center items-center mt-20 space-y-4">
                                <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen lokalen gevonden</Text>
                            </View>
                    ))}

                </View>
            </ScrollView>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </SafeAreaView>
    )
}

export default AdminDashboard