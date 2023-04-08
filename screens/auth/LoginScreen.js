import { Alert, FlatList, Image, ScrollView, ScrollViewComponent, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { EnvelopeIcon, LockClosedIcon } from "react-native-heroicons/outline";
import { supabase } from '../../core/api/supabase'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoginInput from '../../Components/Form/LoginInput'
import { login } from '../../core/modules/auth/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true);
        if (email !== '' && password !== '') {
            try {
                await login({ email, password })
            } catch (error) {
                console.error(error)
                Alert.alert(error.message)
            }
        } else {
            Alert.alert("Vul alle velden in")
        }

        /* await AsyncStorage.setItem('user', JSON.stringify({ email, password }))
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            await AsyncStorage.removeItem('user')
            Alert.alert(error.message)
        } */

        setLoading(false)
    }

    return (
        <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            className="flex-1 "
        >
            <SafeAreaView className="flex-1 items-center justify-center">
                <View className="h-1/6 items-center justify-center">
                    <Image
                        source={require('../../assets/logo/Logo-Purple.png')}
                        style={{ width: 130, resizeMode: 'contain' }}
                    />
                </View>
                <View className="h-5/6 w-full bg-white rounded-t-[50px] items-center px-7 pt-10 pb-0 mb-0">
                    <Text
                        style={{ fontFamily: 'Poppins_600SemiBold' }}
                        className="text-3xl font-semibold"
                    >Log in</Text>
                    <View className="flex-1 w-full mt-12 space-y-7">
                        <View>
                            <LoginInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" secureTextEntry={false} onChangeText={(text) => setEmail(text)} value={email}>
                                <EnvelopeIcon color="#0F172A" size={22} />
                            </LoginInput>
                        </View>
                        <View>
                            <LoginInput placeholder="Wachtwoord" keyboardType="default" autoCapitalize="none" secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password}>
                                <LockClosedIcon color="#0F172A" size={22} />
                            </LoginInput>
                        </View>
                    </View>
                    <View className="py-8 w-full items-center">
                        <TouchableOpacity className={`${loading ? 'bg-neutral-500' : 'bg-neutral-900'} w-full p-4 rounded-[10px] justify-center items-center`} onPress={() => handleLogin()} disabled={loading}>
                            <Text
                                className="text-white text-base"
                                style={{ fontFamily: 'Poppins_400Regular' }}
                            >Login</Text>
                        </TouchableOpacity>
                        <Text className="mt-2 text-sm text-gray-400">
                            Nog geen account? <Text className="text-violet-600" onPress={() => navigation.navigate('Register')}>Registreer</Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView >
        </LinearGradient>
    )
}