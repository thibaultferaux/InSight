import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon, ArrowRightIcon, TagIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { makeClassroom } from '../../../core/modules/classroom/api';
import NfcProxy from '../../../core/proxy/NfcProxy';

const MakeClassroom = () => {
    const [classroom, setClassroom] = useState('')
    const navigation = useNavigation();

    const handleMakeClassroom = async () => {
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
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-10">
            <View className="justify-between items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Maak lokaal aan</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Vul de naam van het lokaal in en scan de tag van het bijhorende lokaal bij de volgende stap.</Text>
            </View>
            <View className="mt-12 space-y-1">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-neutral-900">Naam van het lokaal</Text>
                <View className="flex-row items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 border border-transparent focus:border-violet-400">
                    <TagIcon color="#0F172A" size={22} />
                    <TextInput placeholder='bv. B24' keyboardType='default' placeholderTextColor="#6B7280" style={{ fontFamily: 'Poppins_400Regular', paddingTop: 4, paddingBottom: 0 }} textAlignVertical="center" className="flex-1 text-sm text-slate-900 font-normal align-text-bottom" autoCapitalize='false' value={classroom} onChangeText={(text) => setClassroom(text)} />
                </View>
            </View>
            <View className="mt-12 items-end">
                <TouchableOpacity className="py-[10px] px-[15px] bg-violet-500 flex-row space-x-2 rounded-lg" onPress={handleMakeClassroom}>
                    <Text className="text-white">Scan</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MakeClassroom