import { View, Text } from 'react-native'
import React from 'react'
import { formatDateLong, formatTime, isToday } from '../../../core/utils/dateTime'
import { ArrowUpRightIcon } from 'react-native-heroicons/outline'
import { Tabs } from 'react-native-collapsible-tab-view'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const CurrentLessons = ({ lessons }) => {    

    return (
        <Tabs.ScrollView className="space-y-4"
            contentContainerStyle={{ marginTop: 16, flex: 1, paddingHorizontal: 28}}
            showsVerticalScrollIndicator={false}
        >
            {lessons.map((lesson, index) => (
                <View key={index} className={`border-b-gray-300 pb-3 mt-4 mb-4 ${index === lessons.length - 1 ? 'border-none' : 'border-b-[1px]'}`}>
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base mb-2 text-slate-400">{ isToday(lesson.date) ? 'Vandaag' : formatDateLong(lesson.date)}</Text>
                    {lesson.items.map((item, index) => (
                        <View key={index} className="flex-row justify-between bg-white shadow-lg shadow-black/40 mb-2 p-3 rounded-2xl">
                            <View className="justify-between space-y-3">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{item.course.name}</Text>
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
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm uppercase">{item.classroomtag.name}</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </Tabs.ScrollView>
    )
}

export default CurrentLessons