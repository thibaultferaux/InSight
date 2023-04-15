import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowUpRightIcon } from 'react-native-heroicons/outline'
import { formatDateLong, formatTime } from '../../../core/utils/dateTime'
import { Tabs } from 'react-native-collapsible-tab-view'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'

const TeacherPreviousLessons = ({ lessons }) => {
    const navigation = useNavigation()

    return (
        <Tabs.ScrollView className="space-y-4"
            contentContainerStyle={{ marginTop: 16, paddingHorizontal: 28, paddingBottom: 56 }}
            showsVerticalScrollIndicator={false}
        >
            {lessons && (lessons.length > 0 ? 
                
            
            lessons.map((lesson, index) => (
                <View key={index} className={`border-b-gray-300 pb-3 ${index === lessons.length - 1 ? 'border-none' : 'border-b-[1px]'}`}>
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400">{ formatDateLong(lesson.date)}</Text>
                    {lesson.items.map((item, index) => (
                        <TouchableOpacity key={index} className="flex-row justify-between bg-white shadow-lg shadow-black/40 mb-2 p-3 rounded-2xl" onPress={() => navigation.navigate('ViewAttendances', {lesson: item})}>
                            <View className="justify-between space-y-3">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-neutral-900">{item.course.name}</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
                            </View>
                            <View className="justify-between items-end">
                                <ArrowUpRightIcon color="#c4b5fd" size={24} />
                                <LinearGradient
                                    colors={['#E5E6EA', '#F8FAFC', '#F8FAFC']}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="px-2 py-[1px] rounded-full shadow-inner shadow-black/40 bg-slate-50"
                                >
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm uppercase text-neutral-900">{item.classroomtag.name}</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))
             : (
                <View className="justify-center items-center mt-20 space-y-4">
                    <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen lessen om weer te geven</Text>
                </View>
            ))}
        </Tabs.ScrollView>
    )
}

export default TeacherPreviousLessons