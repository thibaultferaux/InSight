import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon, ArrowRightIcon, TagIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { makeClassroom } from '../../../core/modules/classroom/api';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { useForm } from 'react-hook-form';
import FormInput from '../../Components/Form/FormInput';
import { NfcNotEnabledAlert } from '../../../core/utils/nfc';

const MakeClassroom = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm();

    const handleMakeClassroom = async ({ classroom }) => {

        setLoading(true);

        if (await NfcProxy.isEnabled()) {
            const tag = await NfcProxy.readTag()
            if (tag) {
                try {
                    await makeClassroom(classroom, tag.id);
                } catch (error) {
                    if (error.status == 409) {
                        Alert.alert('Dit klaslokaal bestaat al, u kunt deze aanpassen in het overzicht');
                    } else {
                        console.error(error);
                    }
                } finally {
                    navigation.navigate('Dashboard')
                }
            }
        } else {
            NfcNotEnabledAlert(() => handleMakeClassroom({ classroom }));
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
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl text-neutral-900">Maak lokaal aan</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Vul de naam van het lokaal in en scan de tag van het bijhorende lokaal bij de volgende stap.</Text>
            </View>

            <View className="mt-12">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-neutral-900 mb-1">Naam van het lokaal</Text>
                <FormInput
                    name="classroom"
                    placeholder="bv. B24"
                    control={control}
                    rules={{ required: "Naam is verplicht" }}
                    autoCapitalize="false"
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(handleMakeClassroom)}
                >
                    <TagIcon color="#171717" size={22} />
                </FormInput>
            </View>

            <View className="mt-12 items-end">
                <TouchableOpacity className={`${loading ? 'bg-violet-300': 'bg-violet-500'} py-[10px] px-[15px] flex-row space-x-2 rounded-lg`} onPress={handleSubmit(handleMakeClassroom)} disabled={loading}>
                    <Text className="text-white">Scan</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

export default MakeClassroom