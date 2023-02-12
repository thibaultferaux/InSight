import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "react-native-heroicons/outline";
import LoginInput from '../components/LoginInput'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'


const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold
    });

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
    }

    const register = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            Alert.alert(error.message)
        } else {
            console.log(data)
            console.log(data.user.id)
            const profile = {
                id: data.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName,
                updated_at: new Date()
            }

            const { error } = await supabase.from('profiles').upsert(profile)

            if (error) {
                Alert.alert(error.message)
            } else {
                supabase.auth.signOut()
                navigation.navigate("Login")
                showMessage({
                    message: "Je account is succesvol aangemaakt",
                    type: "success",
                    style: { paddingTop: insets.top },
                    duration: 5000,
                    icon: 'success',
                    position: 'left'
                })
            }

        }
        setLoading(false)
    }

    return (
        <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            className="flex-1 "
        >
            <SafeAreaView className="flex-1 items-center justify-center">
                <ScrollView className="w-full">

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
                        >Registreer</Text>
                        <View className="flex-1 w-full mt-12 space-y-7">
                            <View>
                                <LoginInput placeholder="Voornaam" keyboardType="default" autoCapitalize="words" secureTextEntry={false} onChangeText={(text) => setFirstName(text)} value={firstName}>
                                    <UserIcon color="#0F172A" size={22} />
                                </LoginInput>
                            </View>
                            <View>
                                <LoginInput placeholder="Familienaam" keyboardType="default" autoCapitalize="words" secureTextEntry={false} onChangeText={(text) => setLastName(text)} value={lastName}>
                                    <UserIcon color="#0F172A" size={22} />
                                </LoginInput>
                            </View>
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
                    </View>
                </ScrollView>
                <View className="px-10 py-8 w-full items-center bg-white absolute bottom-0">
                    <TouchableOpacity className={`${loading ? 'bg-neutral-500' : 'bg-neutral-900'} w-full p-4 rounded-[10px] justify-center items-center`} onPress={() => register()} disabled={loading}>
                        <Text
                            className="text-white text-base"
                            style={{ fontFamily: 'Poppins_400Regular' }}
                        >Registreer</Text>
                    </TouchableOpacity>
                    <Text className="mt-2 text-sm text-gray-400">
                        Heb je al een account <Text className="text-violet-600" onPress={() => navigation.navigate('Login')}>Log in</Text>
                    </Text>
                </View>
            </SafeAreaView >
        </LinearGradient>
    )
}

export default RegisterScreen