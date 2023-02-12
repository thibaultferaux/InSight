import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightOnRectangleIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';

const AdminDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('')
    const [borderColor, setBorderColor] = useState('#00000000');


    useEffect(() => {
        if (session) getProfile()
        if (session) console.log(session.user)
    }, [])

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold
    });

    const getProfile = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false)
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
                        <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => supabase.auth.signOut()}>
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
                        <TouchableOpacity className="bg-violet-500 justify-center w-[52px] items-center rounded-2xl">
                            <PlusIcon size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default AdminDashboard