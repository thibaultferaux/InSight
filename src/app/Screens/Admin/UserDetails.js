import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AcademicCapIcon, ArrowLeftIcon, EnvelopeIcon, PlusIcon } from 'react-native-heroicons/mini';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { deleteUser } from '../../../core/modules/auth/api';
import { showMessage } from 'react-native-flash-message';
import { AUTHROLES } from '../../../core/constants/constants';
import { getStudentById, getTeacherById } from '../../../core/modules/users/api';
import { deleteCourse, removeUserFromCourse } from '../../../core/modules/course/api';

const UserDetails = ({ route }) => {
    const { userId, roleId } = route.params;
    const [user, setUser] = useState();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            getUser();
        }, [])
    );

    const getUser = async () => {
        try {
            let response;

            if (roleId === 1) {
                response = await getStudentById(userId);
            } else {
                response = await getTeacherById(userId);
            }

            setUser(response);

        } catch (error) {
            console.log(error);
            Alert.alert("Er is iets misgegaan. Probeer het later opnieuw.");
        }
    }

    const handleRemoveCourse = async (courseId) => {
        try {
            Alert.alert(
                "Weet je het zeker?",
                "Weet je zeker dat je deze cursus wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                [
                    {
                        text: "Annuleren",
                        style: "cancel"
                    },
                    {
                        text: "Verwijderen",
                        onPress: async () => {
                            roleId === 1 ? await removeUserFromCourse(userId, courseId) : await deleteCourse(courseId);
                            getUser();
                        }
                    }
                ],
            )
        } catch (error) {
            console.log(error);
            Alert.alert("Er is iets misgegaan. Probeer het later opnieuw.");
        }

    }


    const handleDelete = () => {
        try {
            
            Alert.alert(
                "Weet je het zeker?",
                "Weet je zeker dat je deze gebruiker wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                [
                    {
                        text: "Annuleren",
                        style: "cancel"
                    },
                    {
                        text: "Verwijderen",
                        onPress: async () => {
                            await deleteUser(user.id);
                            navigation.goBack();
                            showMessage({
                                message: "Gebruiker succesvol verwijderd",
                                type: "success",
                                style: { paddingTop: insets.top + 15 },
                                duration: 3000,
                                icon: 'success',
                                position: 'left'
                            })
                        }
                    }
                ],
            )
                

        } catch (error) {
            console.log(error);
            Alert.alert("Er is iets misgegaan. Probeer het later opnieuw.");
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
            { user && (
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 40, flexGrow: 1 }}
                >
                    <View className="pb-6 border-b-[1px] border-b-gray-300">
                        <TouchableOpacity className="flex-row space-x-1 mb-2" onPress={() => navigation.goBack()}>
                            <ArrowLeftIcon size={16} color="#9ca3af" />
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-between">
                            <View className="items-start space-y-2">
                                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xl pt-1 text-neutral-900">{ user.first_name + ' ' + user.last_name }</Text>
                                <View className="flex-row space-x-1">
                                    <EnvelopeIcon size={16} color="#9ca3af" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xs text-gray-500">{ user.email }</Text>
                                </View>
                                <View className="flex-row space-x-1">
                                    <AcademicCapIcon size={16} color="#9ca3af" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-xs text-gray-500">
                                        { AUTHROLES.find(role => role.value === roleId)?.label ?? 'Unknown' }
                                    </Text>
                                </View>
                                <View className="pt-3">
                                    <TouchableOpacity
                                        className="px-4 py-[5px] bg-gray-200 rounded-md"
                                        onPress={() => navigation.navigate('EditUser', { user })}
                                    >
                                        <Text style={{ fontFamily: 'Poppins_500Medium', paddingTop: 1 }} className="text-neutral-900" >
                                            Gegevens bewerken
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View className="aspect-square h-24 rounded-full bg-zinc-200 justify-center items-center">
                                {/* first letter firstname + first letter lastname */}
                                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl pt-1 text-gray-400">
                                    {user.first_name.charAt(0) + user.last_name.charAt(0)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="mt-10 mb-12">
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-gray-500 uppercase">
                            Vakken
                        </Text>

                        <View className="mt-4 space-y-4">
                            {user.course.map((course) => (
                                <View key={course.id} className="flex-row justify-between items-center">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-lg text-neutral-900">
                                        {course.name}
                                    </Text>
                                    <TouchableOpacity>
                                        <XMarkIcon size={24} color="#C4C4C4" onPress={() => handleRemoveCourse(course.id)} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity
                                className="bg-gray-200 self-start px-4 py-2 rounded-md"
                                onPress={() => user.role_id === 1 ? navigation.navigate('AddCourseToUser', { user }) : navigation.navigate('MakeCourse', { user })}
                            >
                                <PlusIcon size={20} color="#171717" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 items-center justify-end mt-8">
                        <TouchableOpacity className="pt-2 px-2" onPress={handleDelete}>
                            <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-red-500">
                                Gebruiker verwijderen
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default UserDetails