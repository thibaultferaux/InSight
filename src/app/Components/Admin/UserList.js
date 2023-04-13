import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { ArrowUpRightIcon } from 'react-native-heroicons/outline'

const UserList = ({ users, search }) => {
    return (
        <Tabs.ScrollView
            contentContainerStyle={{ marginTop: 16, paddingHorizontal: 28, paddingBottom: 56}}
            showsVerticalScrollIndicator={false}
        >
            {users && (users.length > 0 ? 
                users.filter((user) => {
                    return (user.first_name + ' ' + user.last_name).toLowerCase().includes(search.toLowerCase())                     
                }).map((user, index) => {
                    const name = user.first_name + ' ' + user.last_name;
                    const indexMatch = name.toLowerCase().indexOf(search.toLowerCase());
                    const beforeMatch = name.slice(0, indexMatch);
                    const match = name.slice(indexMatch, indexMatch + search.length);
                    const afterMatch = name.slice(indexMatch + search.length);

                    return (
                        <TouchableOpacity key={index} className="flex-row justify-between items-center py-4 border-b-[1px] border-gray-300">
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">
                                {beforeMatch}
                                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-base text-neutral-900">{match}</Text>
                                {afterMatch}
                            </Text>
                            <ArrowUpRightIcon size={24} color="#7C3AED" />
                        </TouchableOpacity>
                    )

            }) : (
                <View className="justify-center items-center mt-20 space-y-4">
                    <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300">Geen gebruikers gevonden</Text>
                </View>
            ))}
        </Tabs.ScrollView>
    )
}

export default UserList