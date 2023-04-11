import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'

const StudentDetailsData = ({ lessons, attendances }) => {
    return (
        <Tabs.ScrollView
            style={{ flex: 0, flexGrow: 0 }}
            contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 56, flexGrow: 0, flex: 0}}
            showsVerticalScrollIndicator={false}
        >

            { (attendances && lessons) && (attendances.total > 0 ? (
                <>
                    <View className="flex-row pb-5 pt-7 border-b-[1px] border-b-gray-300">
                        <View className="items-center flex-1">
                            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl">{ attendances.present }</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }}>Aanwezig</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl">{ attendances.total - attendances.present }</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular' }}>Afwezig</Text>
                        </View>
                    </View>
                    <View className="mt-8">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-xl">Aanwezigheden</Text>
                        <View>
                            {lessons.map((item, index) => (
                                <View className="mt-6" key={index}>
                                    <View className="flex-row justify-between">
                                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base">{ item.course.name }</Text>
                                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-500">{ item.present }/{ item.total }</Text>
                                    </View>
                                    <View className="bg-gray-300 h-1.5 rounded-full mt-1">
                                        <View className="bg-violet-500 h-full rounded-full" style={{ width: `${item.present/item.total * 100}%` }} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </>
            ) : (
                <View className="justify-center items-center mt-20 space-y-4">
                    <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen aanwezigheden gevonden</Text>
                </View>
            ))}
        </Tabs.ScrollView>
    )
}

export default StudentDetailsData