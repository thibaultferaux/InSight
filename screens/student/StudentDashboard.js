import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const StudentDashboard = ({ route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('')


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

    return (
        <View className="flex-1 justify-center items-center">
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <View className="space-y-4">
                    <Text style={{ fontFamily: 'Poppins_400Regular' }}>Hoi {firstName}</Text>
                    <TouchableOpacity className="bg-neutral-900 px-4 py-2 rounded-md" onPress={() => supabase.auth.signOut()}>
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-white">Uitloggen</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default StudentDashboard