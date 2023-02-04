import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'
import { EnvelopeIcon, LockClosedIcon } from "react-native-heroicons/outline";
import LoginInput from '../components/LoginInput'
import { supabase } from '../lib/supabase'

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold
    });

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    const login = () => {
        setLoading(true);
        console.log(email);
        console.log(password);
    }

    return (
        <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            className="flex-1 "
        >
            <SafeAreaView className="flex-1 items-center justify-center">
                <View className="h-1/6 items-center justify-center">
                    <Image
                        source={require('../assets/logo/Logo-Purple.png')}
                        style={{ width: 130, resizeMode: 'contain' }}
                    />
                </View>
                <View className="flex-1 w-full bg-white rounded-t-[50px] items-center px-10 pt-10">
                    <Text
                        style={{ fontFamily: 'Poppins_600SemiBold' }}
                        className="text-3xl font-semibold"
                    >Log in</Text>
                    <View className="flex-1 w-full mt-12 space-y-7">
                        <View>
                            <LoginInput placeholder="Email" keyboardType="email-address" secureTextEntry={false} onChangeText={(text) => setEmail(text)} value={email}>
                                <EnvelopeIcon color="#0F172A" size={22} />
                            </LoginInput>
                        </View>
                        <View>
                            <LoginInput placeholder="Wachtwoord" keyboardType="default" secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password}>
                                <LockClosedIcon color="#0F172A" size={22} />
                            </LoginInput>
                        </View>
                    </View>
                    <View className="mb-8 w-full items-center">
                        <TouchableOpacity className="bg-neutral-900 w-full p-4 rounded-[10px] justify-center items-center" onPress={() => login()} disabled={loading}>
                            <Text
                                className="text-white text-base"
                                style={{ fontFamily: 'Poppins_400Regular' }}
                            >Login</Text>
                        </TouchableOpacity>
                        <Text className="mt-2 text-sm text-gray-400">
                            Nog geen account? <Text className="text-violet-600">Registreer</Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView >
        </LinearGradient>
    )
}