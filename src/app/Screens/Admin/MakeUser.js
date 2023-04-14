import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import UserForm from '../../Components/Form/UserForm';
import { randomPassword } from '../../../core/utils/randomPassword';
import { createUser, register } from '../../../core/modules/auth/api';
import { showMessage } from 'react-native-flash-message';

const MakeUser = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const onSubmit = async ({ first_name, last_name, email, role}) => {
        
        const data = {
            first_name,
            last_name,
            email,
            password: randomPassword(),
            role_id: role.value,
        }
        
        try {
            setLoading(true);
            await createUser(data)
            navigation.goBack();
            showMessage({
                message: "Je account is succesvol aangemaakt",
                type: "success",
                style: { paddingTop: insets.top + 15 },
                duration: 3000,
                icon: 'success',
                position: 'left'
            })
            Alert.alert("Gebruiker aangemaakt", "De gebruiker is succesvol aangemaakt. Het wachtwoord is: " + data.password)
        } catch (error) {
            console.log(error);
            Alert.alert(error.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 40 }}
            >
                <View className="justify-between items-start space-y-2">
                    <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon size={16} color="#9ca3af" />
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Maak een gebruiker aan</Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Vul alle gegevens in om de gebruiker aan te maken.</Text>
                </View>
                <UserForm onSubmit={onSubmit} submitLabel="Maak" loading={loading} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default MakeUser