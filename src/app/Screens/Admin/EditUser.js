import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/mini';
import UserForm from '../../Components/Form/UserForm';
import { updateUser } from '../../../core/modules/auth/api';
import { showMessage } from 'react-native-flash-message';

const EditUser = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const onSubmit = async ({ first_name, last_name, email, role}) => {

        const data = {
            first_name,
            last_name,
            email,
            role_id: role.value,
        }
        
        try {
            setLoading(true);
            await updateUser(user.id, data)
            navigation.navigate('Gebruikers');
            showMessage({
                message: "De gebruiker is succesvol aangepast",
                type: "success",
                style: { paddingTop: insets.top + 15 },
                duration: 3000,
                icon: 'success',
                position: 'left'
            })
        } catch (error) {
            console.log(error);
            Alert.alert("Er is iets misgegaan met wijzigen van de gebruiker. Probeer het later opnieuw.")
        } finally {
            setLoading(false);
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
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Gebruiker wijzigen</Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Verander geweste velden over de gebruiker.</Text>
                </View>
                <UserForm user={user} onSubmit={onSubmit} submitLabel="Update" loading={loading} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditUser