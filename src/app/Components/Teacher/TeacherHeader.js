import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import TeacherCurrentLesson from './TeacherCurrentLesson'
import { useAuthContext } from '../Auth/AuthProvider';
import { ArrowRightOnRectangleIcon, PlusIcon } from 'react-native-heroicons/outline';
import LogoutAlert from '../Auth/LogoutAlert';
import { useNavigation } from '@react-navigation/native';

const TeacherHeader = ({ currentLesson }) => {
    const [showLogout, setShowLogout] = useState(false);
    const { user } = useAuthContext();
    const navigation = useNavigation()


    return (
        <View className="px-7 pt-14">
            <View className="flex-row justify-between items-start mb-4">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Hallo {user.first_name},</Text>
                <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                    <ArrowRightOnRectangleIcon color="white" size={22} />
                </TouchableOpacity>
            </View>
            {/* if there is a lesson at current time */}
            {currentLesson && (<TeacherCurrentLesson currentLesson={currentLesson} />) }
            <View className="mt-2">
                <TouchableOpacity className="w-full rounded-full flex-row bg-violet-500 p-4 justify-center align-middle space-x-2" onPress={() => navigation.navigate("MakeLesson", { userId: user.id })}>
                    <PlusIcon color="white" size={24} />
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-white mt-[2px]">Nieuwe les</Text>
                </TouchableOpacity>
            </View>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </View>
    )
}

export default TeacherHeader