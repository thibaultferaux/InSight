import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { XMarkIcon } from 'react-native-heroicons/outline';
import { formatTime } from '../../../core/utils/dateTime';

const LessonsDetailsModal = ({ 
    modalVisible,
    setModalVisible,
    classroomName,
    courseName,
    teacherName,
    startTime,
    endTime,
    children
}) => {
    if (!classroomName || !courseName || !startTime || !endTime) return null;

    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 justify-center items-center w-full px-12">
                    <View className="bg-white rounded-3xl w-full mb-16 shadow-2xl shadow-black px-6 py-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xl">Lesinfo</Text>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <XMarkIcon color="#d4d4d4" size={32} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row space-x-1">
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Klas:</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{ classroomName }</Text>
                        </View>
                        <View className="flex-row space-x-1">
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Les:</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{ courseName }</Text>
                        </View>
                        { teacherName && (
                            <View className="flex-row space-x-1">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Leerkracht:</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{ teacherName }</Text>
                            </View>
                        )}
                        <View className="flex-row space-x-1">
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Datum:</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{new Date(startTime).toLocaleDateString()}</Text>
                        </View>
                        <View className="flex-row space-x-1">
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-400">Tijd:</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{formatTime(startTime)} - {formatTime(endTime)}</Text>
                        </View>
                        <View className="mt-4 flex-row gap">
                            { children }
                            {/* <TouchableOpacity className="bg-violet-500 items-center py-3 rounded-xl flex-1 mr-1" onPress={() => handleSetActive(lesson)}>
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-white mt-[2px]">Zet actief</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-neutral-400 items-center rounded-xl aspect-square justify-center">
                                <PencilIcon color="white" size={22} />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>
    )
}

export default LessonsDetailsModal