import { Alert, Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import FormInput from '../../Components/Form/FormInput';
import { register } from '../../../core/modules/auth/api';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '../../../core/constants/constants';

const RegisterScreen = () => {
    const [loading, setLoading] = useState(false);
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const { control, handleSubmit, formState: {errors}} = useForm();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleRegister = async (data) => {
        try {
            setLoading(true);
            await register(data)
            showMessage({
                message: "Je account is succesvol aangemaakt",
                type: "success",
                style: { paddingTop: insets.top + 15 },
                duration: 5000,
                icon: 'success',
                position: 'left'
            })
        } catch (error) {
            Alert.alert(error.message);
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
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
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
                        >Registreer</Text>
                        <View className="flex-1 w-full mt-12 space-y-7">
                            <View>
                                <FormInput
                                    name="first_name"
                                    placeholder="Voornaam"
                                    ref={firstNameInputRef}
                                    control={control}
                                    rules={{ required: 'Voornaam is verplicht'}}
                                    autoCapitalize="words"
                                    keyboardType="default"
                                    returnKeyType="next"
                                    onSubmitEditing={() => lastNameInputRef.current && lastNameInputRef.current.focus()}
                                >
                                    <UserIcon color="#171717" size={22} />
                                </FormInput>
                            </View>
                            <View>
                                <FormInput
                                    name="last_name"
                                    placeholder="Familienaam"
                                    ref={lastNameInputRef}
                                    control={control}
                                    rules={{ required: 'Familienaam is verplicht'}}
                                    autoCapitalize="words"
                                    keyboardType="default"
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
                                >
                                    <UserIcon color="#171717" size={22} />
                                </FormInput>
                            </View>
                            <View>
                                <FormInput
                                    name="email"
                                    placeholder="E-mail"
                                    ref={emailInputRef}
                                    control={control}
                                    rules={{
                                        required: 'E-mailadres is verplicht',
                                        pattern: {
                                            value: EMAIL_REGEX,
                                            message: 'Vul een geldig e-mailadres in'
                                        }
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
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
                                    rules={{ 
                                        required: 'Wachtwoord is verplicht',
                                        minLength: {
                                            value: 6,
                                            message: 'Wachtwoord moet minstens 6 karakters zijn'
                                        }
                                    }}
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                >
                                    <LockClosedIcon color="#171717" size={22} />
                                </FormInput>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="px-10 py-8 w-full items-center bg-white absolute bottom-0">
                    <TouchableOpacity className={`${loading ? 'bg-neutral-500' : 'bg-neutral-900'} w-full p-4 rounded-[10px] justify-center items-center`} onPress={handleSubmit(handleRegister)} disabled={loading}>
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