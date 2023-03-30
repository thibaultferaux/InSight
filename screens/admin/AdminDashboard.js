import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import MakeClassroom from './MakeClassroom';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('')
    const [borderColor, setBorderColor] = useState('#00000000');
    const [classrooms, setClassrooms] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        setLoading(true)
        if (session) {
            getProfile()
            getClassrooms()
        }
        const classroomListener = supabase
            .channel('public:classroomtag')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'classroomtag' },
                (payload) => {
                    getClassrooms()
                }
            ).subscribe();
        setLoading(false)
        // return classroomListener.unsubscribe()
    }, [])

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold
    });

    const getProfile = async () => {
        try {
            if (!session?.user) throw new Error('No user on the session')

            let { data, error, status } = await supabase
                .from('profiles')
                .select('first_name')
                .eq('id', session?.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFirstName(data.first_name)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    const getClassrooms = async () => {
        try {
            if (!session?.user) throw new Error('No user on the session')

            let { data, error, status } = await supabase
                .from('classroomtag')
                .select()
                .order('name', { ascending: true })

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setClassrooms(data)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    const onFocus = () => {
        setBorderColor('#a78bfa');
    }

    const onBlur = () => {
        setBorderColor('#00000000');
    }

    const logout = async () => {
        await AsyncStorage.removeItem('user')
        await supabase.auth.signOut()
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-14">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <Text>Loading...</Text>
                </View>
            ) : (
                <>
                    <View className="flex-row justify-between items-start">
                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {firstName},</Text>
                        <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => logout()}>
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
                </>
            )}
        </SafeAreaView>
    )
}

export default AdminDashboard