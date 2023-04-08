import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import MakeClassroom from './MakeClassroom';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../core/api/supabase';
import LogoutAlert from '../../Components/Auth/LogoutAlert';
import { getAllClassrooms } from '../../../core/modules/classroom/api';
import { useAuthContext } from '../../Components/Auth/AuthProvider';

const AdminDashboard = () => {
    const { user } = useAuthContext();
    const [borderColor, setBorderColor] = useState('#00000000');
    const [classrooms, setClassrooms] = useState([]);
    const [showLogout, setShowLogout] = useState(false);
    const navigation = useNavigation();

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
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
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
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 56 }}>
                <View className="flex-row justify-between items-start">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {user.first_name},</Text>
                    <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                        <ArrowRightOnRectangleIcon color="white" size={22} />
                    </TouchableOpacity>
                </View>
                <View className="mt-4 flex-row space-x-4 h-[52px]">
                    <View className="flex-1 flex-row items-center bg-slate-100 px-4 rounded-[10px] space-x-4 border" style={{ borderColor: borderColor }}>
                        <MagnifyingGlassIcon size={22} color="#0F172A" />
                        <TextInput
                            placeholder='Zoek je lokaal'
                            keyboardType='default'
                            placeholderTextColor="#6B7280"
                            style={{ fontFamily: 'Poppins_400Regular', paddingTop: 4, paddingBottom: 0 }}
                            textAlignVertical="center"
                            className="flex-1 text-sm text-slate-900 font-normal align-text-bottom"
                            autoCapitalize='none'
                            onFocus={() => onFocus()}
                            onBlur={() => onBlur()}
                        />
                    </View>
                    <TouchableOpacity className="bg-violet-500 justify-center w-[52px] items-center rounded-2xl" onPress={() => navigation.navigate(MakeClassroom)}>
                        <PlusIcon size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="mt-4">
                    {classrooms.map((classroom, index) => (
                        <TouchableOpacity key={index} className="flex-row justify-between items-center py-4 border-b-[1px] border-gray-300">
                            <View className="space-y-2">
                                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xl text-neutral-900">{classroom.name}</Text>
                                <View className="flex-col">
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xs text-gray-400">#{classroom.id}</Text>
                                </View>
                            </View>
                            <View className="">
                                <ArrowUpRightIcon size={24} color="#7C3AED" />
                            </View>
                        </TouchableOpacity>
                    ))}

                </View>
            </ScrollView>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </SafeAreaView>
    )
}

export default AdminDashboard