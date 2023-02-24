import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { ArrowLeftIcon, ArrowRightIcon, TagIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

const MakeClassroom = () => {
    const [classroom, setClassroom] = useState('')
    const navigation = useNavigation();

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
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
                <TouchableOpacity className="py-[10px] px-[15px] bg-violet-500 flex-row space-x-2 rounded-lg" onPress={() => navigation.navigate("ScanClassroom", { name: classroom })}>
                    <Text className="text-white">Volgende</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MakeClassroom