import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/mini';
import { addCoursesToStudent, getAllOtherCourses } from '../../../core/modules/course/api';
import { Controller, useForm } from 'react-hook-form';
import { MultiSelect } from 'react-native-element-dropdown';

const AddCourseToUser = ({ route }) => {
    const [courses, setCourses] = useState();
    const [loading, setLoading] = useState(false);
    const { user } = route.params;
    const navigation = useNavigation();
    const courseIds = user.course.map(course => course.id);
    const { control, handleSubmit } = useForm({
        defaultValues: {
            courses: []
        }
    });

    useEffect(() => {
        getCourses();
    }, []);

    const onSubmit = async ({courses}) => {

        try {
            setLoading(true);
            
            await addCoursesToStudent(user.id, courses);

            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Er is iets mis gegaan bij het toevoegen van de vakken. Probeer het later opnieuw.')
        } finally {
            setLoading(false);
        }
    }

    const getCourses = async () => {
        try {
            setLoading(true);

            const data = await getAllOtherCourses(courseIds);

            if (data) setCourses(data);
        } catch (error) {
            console.log(error);
            Alert.alert('Er is iets mis gegaan bij het ophalen van de vakken. Probeer het later opnieuw.')
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 40 }}
            >
                <View className="justify-between items-start space-y-2">
                    <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon size={16} color="#9ca3af" />
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl text-neutral-900">Vakken toevoegen</Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Voeg de gewenste vakken toe aan de student.</Text>
                </View>

                {courses && (courses.length > 0 ? (
                    <>
                        <Controller
                            control={control}
                            name='courses'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mt-12">
                                    <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Vakken</Text>
                                    <MultiSelect
                                        label="Vakken"
                                        data={courses}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        labelField="name"
                                        valueField="id"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        containerStyle={{ width: '100%', borderRadius: 10 }}
                                        placeholder="Selecteer een of meerdere vakken"
                                        className="items-center bg-slate-100 w-full px-4 py-[14px] rounded-[10px] space-x-4 text-sm mb-4"
                                        placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                                        selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                                        activeColor="#f1f5f9"
                                        itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                                        itemContainerStyle={{ borderRadius: 10 }}
                                        fontFamily="Poppins_400Regular"
                                        renderRightIcon={() => <ChevronDownIcon size={24} color="#171717" /> }
                                        search
                                        searchPlaceholder="Zoek een vak"
                                        inputSearchStyle={{ fontFamily: 'Poppins_400Regular', fontSize: 14, paddingTop: 1, color: '#171717', borderRadius: 10, paddingHorizontal: 10, backgroundColor: '#f8fafc' }}
                                        renderSelectedItem={(item, unSelect) => (
                                            <TouchableOpacity onPress={unSelect} className="mt-2 mr-3">
                                                <View className="flex-row space-x-2 items-center rounded-full bg-slate-100 px-4 py-2">
                                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-base text-neutral-900">{item.name}</Text>
                                                        <XMarkIcon size={16} color="#171717" />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                        />

                        <View className="mt-12 items-end">
                            <TouchableOpacity className={`py-[10px] px-[15px] flex-row space-x-2 rounded-lg ${ !loading ? 'bg-violet-500' : 'bg-violet-300'}`} onPress={handleSubmit(onSubmit)} disabled={loading}>
                                <Text className="text-white">Toevoegen</Text>
                                <ArrowRightIcon size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View className="justify-center items-center mt-20 space-y-4">
                        <Image source={require('../../../../assets/NoLessonsIcon.png')} style={{ width: 200, height: 120, resizeMode:'contain' }} />
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-base text-gray-300 text-center">Je hebt alle vakken al toegevoegd.</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddCourseToUser