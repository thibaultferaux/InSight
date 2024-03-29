import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { EnvelopeIcon, LockClosedIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native'
import FormInput from '../../Components/Form/FormInput'
import { login } from '../../../core/modules/auth/api';
import { useForm } from 'react-hook-form';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const { control, handleSubmit, formState: {errors}} = useForm();

    const navigation = useNavigation();

    const handleLogin = async (data) => {
        setLoading(true);
        try {
            await login(data)
        } catch (error) {
            Alert.alert(error.message)
        } finally {
            setLoading(false)
        }


    }

    return (
        <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            className="flex-1 "
        >
            <SafeAreaView className="flex-1 items-center justify-center">
                <ScrollView
                    className="w-full"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="h-1/6 items-center justify-center">
                        <Image
                            source={require('../../../../assets/logo/Logo-Purple.png')}
                            style={{ width: 130, resizeMode: 'contain' }}
                        />
                    </View>

                    <View className="flex-1 w-full bg-white rounded-t-[50px] items-center px-7 pt-10">
                        <Text
                            style={{ fontFamily: 'Poppins_600SemiBold' }}
                            className="text-3xl font-semibold text-neutral-900"
                        >Log in</Text>
                        <View className="flex-1 w-full mt-12 space-y-7">
                            <View>
                                <FormInput
                                    name="email"
                                    placeholder="E-mail"
                                    ref={emailInputRef}
                                    control={control}
                                    rules={{ required: "E-mail is verplicht" }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                                >
                                    <EnvelopeIcon color="#171717" size={22} />
                                </FormInput>
                            </View>
                            <View>
                                <FormInput
                                    name="password"
                                    placeholder="Wachtwoord"
                                    ref={passwordInputRef}
                                    control={control}
                                    rules={{ required: "Wachtwoord is verplicht" }}
                                    autoCapitalize="none"
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(handleLogin)}
                                >
                                    <LockClosedIcon color="#171717" size={22} />
                                </FormInput>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="py-8 px-10 w-full items-center bg-white absolute bottom-0">
                    <TouchableOpacity className={`${loading ? 'bg-neutral-500' : 'bg-neutral-900'} w-full p-4 rounded-[10px] justify-center items-center`} onPress={handleSubmit(handleLogin)} disabled={loading}>
                        <Text
                            className="text-white text-base"
                            style={{ fontFamily: 'Poppins_400Regular' }}
                        >Login</Text>
                    </TouchableOpacity>
                    <Text className="mt-2 text-sm text-gray-400">
                        Nog geen account? <Text className="text-violet-600" onPress={() => navigation.navigate('Register')}>Registreer</Text>
                    </Text>
                </View>
            </SafeAreaView >
        </LinearGradient>
    )
}