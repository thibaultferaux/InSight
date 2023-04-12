import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ArrowRightIcon, TagIcon } from 'react-native-heroicons/outline';
import FormInput from '../../Components/Form/FormInput';
import { updateClassroom } from '../../../core/modules/classroom/api';
import NfcProxy from '../../../core/proxy/NfcProxy';

const EditClassroom = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { classroom } = route.params;

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: classroom.name,
        }
    });

    const handleUpdateClassroom = async ({ name }) => {
        setLoading(true);
        
        if (await NfcProxy.isEnabled()) {
            const { result, tag } = await NfcProxy.checkTag(classroom.id)
            
            if (result) {
                try {
                    await updateClassroom(name, tag.id);
                } catch (error) {
                    if (error.status == 409) {
                        Alert.alert('Een klaslokaal met deze naam bestaat al, gelieve een andere naam te kiezen.');
                    } else {
                        console.error(error);
                        Alert.alert('Er is iets misgelopen, probeer het later opnieuw.')
                    }
                } finally {
                    navigation.navigate('Dashboard')
                }
            } else {
                if (tag) {
                    Alert.alert("Dit is niet de tag van het lokaal, gelieve de juiste tag te scannen")
                }
            }
        } else {
            NfcNotEnabledAlert(() => handleUpdateClassroom({ name }));
        }

        setLoading(false);
    }


    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-10">
            <View className="justify-between items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Wijzig lokaalnaam</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Vul de nieuwe naam van het lokaal in en scan de tag om deze te bevestigen.</Text>
            </View>
            <View className="mt-12">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-neutral-900 mb-1">Naam van het lokaal</Text>
                <View className="">
                    <FormInput
                        name="name"
                        placeholder="bv. B24"
                        control={control}
                        rules={{ required: "Naam is verplicht" }}
                        autoCapitalize="false"
                        keyboardType="default"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(handleUpdateClassroom)}
                    >
                        <TagIcon color="#0F172A" size={22} />
                    </FormInput>
                </View>
            </View>
            <View className="mt-12 items-end">
                <TouchableOpacity className={`${loading ? 'bg-violet-300': 'bg-violet-500'} py-[10px] px-[15px] flex-row space-x-2 rounded-lg`} onPress={handleSubmit(handleUpdateClassroom)} disabled={loading}>
                    <Text className="text-white">Scan</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditClassroom