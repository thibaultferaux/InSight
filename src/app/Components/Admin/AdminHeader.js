import { View, Text, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { ArrowRightOnRectangleIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline'
import FormInput from '../Form/FormInput'
import { useNavigation } from '@react-navigation/native'
import LogoutAlert from '../Auth/LogoutAlert'

const AdminHeader = ({ control }) => {
    const [showLogout, setShowLogout] = useState(false);
    const navigation = useNavigation();

    return (
        <View className="px-7 pt-14">
            <View className="flex-row justify-between items-start">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Gebruikers</Text>
                <TouchableOpacity className="bg-neutral-900 p-2 rounded-md" onPress={() => setShowLogout(true)}>
                    <ArrowRightOnRectangleIcon color="white" size={22} />
                </TouchableOpacity>
            </View>
            <View className="mt-4 flex-row">
                <View className="flex-1 mr-4">
                    <FormInput
                        name="search"
                        placeholder="Zoek een gebruiker"
                        control={control}
                        autoCapitalize='none'
                        returnKeyType='search'
                        onSubmitEditing={Keyboard.dismiss}
                    >
                        <MagnifyingGlassIcon size={22} color="#0F172A" />
                    </FormInput>
                </View>
                <TouchableOpacity className="bg-violet-500 justify-center h-fit aspect-square items-center rounded-2xl">
                    <PlusIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
            { showLogout && <LogoutAlert onCancel={() => setShowLogout(false)} /> }
        </View>
    )
}

export default AdminHeader