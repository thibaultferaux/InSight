import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

const StudentDetailHeader = ({ student }) => {
    const navigation = useNavigation();

    return (
        <View className="flex-row justify-between px-7 pt-10">
            <View className="items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xl pt-1">{ student.first_name + ' ' + student.last_name }</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xs text-gray-500 pt-2">{ student.email }</Text>
            </View>
            <View className="aspect-square h-24 rounded-full bg-zinc-200 justify-center items-center">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl pt-1 text-gray-400">
                    {student.first_name.charAt(0) + student.last_name.charAt(0)}
                </Text>
            </View>
        </View>
    )
}

export default StudentDetailHeader