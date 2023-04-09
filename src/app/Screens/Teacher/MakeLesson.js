import { View, Text, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ClockIcon } from 'react-native-heroicons/outline';
import { CalendarIcon } from 'react-native-heroicons/solid';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from "react-hook-form";
import { supabase } from '../../../core/api/supabase';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getCoursesFromTeacher } from '../../../core/modules/course/api';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import { checkTime, combineDateAndTime, formatDateFull, formatTime, isToday } from '../../../core/utils/dateTime';
import { getAllClassrooms } from '../../../core/modules/classroom/api';
import { makeLesson } from '../../../core/modules/lesson/api';
import { showMessage } from 'react-native-flash-message';

const MakeLesson = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuthContext();
    const [ courses, setCourses ] = useState([]);
    const [ classrooms, setClassrooms ] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const insets = useSafeAreaInsets();

    const { control, handleSubmit, formState: {errors}, getValues } = useForm();

    useEffect(() => {
        getCourses();
        getClassrooms();
    }, [])

    const getCourses = async () => {
        try {

            const data = await getCoursesFromTeacher(user.id);

            if (data) {
                setCourses(data)
            }

        } catch (error) {
            console.error(error)
            Alert.alert(error.message)
        }
    }

    const getClassrooms = async () => {
        try {
            
            const data = await getAllClassrooms();

            if (data) {
                setClassrooms(data)
            }
        } catch (error) {
            console.error(error)
            Alert.alert(error.message)
        }
    }

    const onSubmit = async ({ subject, classroom, date, startTime, endTime}) => {
        
        try {
            await makeLesson(subject.id, classroom.id, combineDateAndTime(date, startTime), combineDateAndTime(date, endTime));

            showMessage({
                message: "De les is succesvol aangemaakt",
                type: "success",
                style: { paddingTop: insets.top },
                duration: 3000,
                icon: 'success',
                position: 'left'
            })
            navigation.goBack()
        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het aanmaken van de les. Probeer het later opnieuw.")
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 pt-10">
            <View className="justify-between items-start space-y-2">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Maak les aan</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Selecteer het vak en vul bijhorende info in over de les.</Text>
            </View>
            <Controller
                control={control}
                name='subject'
                rules={{ required: "Vak is verplicht" }}
                render={({ 
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                }) => (
                    <View className="mt-12">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Vak</Text>
                        <Dropdown
                            label="Vak"
                            data={courses}
                            valueExtractor={({ id }) => id}
                            labelExtractor={({ name }) => name}
                            onChange={onChange}
                            value={value}
                            onBlur={onBlur}
                            containerStyle={{ width: '100%', borderRadius: 10 }}
                            placeholder="Selecteer een vak"
                            className={`items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 text-sm border ${error ? 'border-red-500' : 'border-transparent'}`}
                            placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                            selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                            activeColor="#f1f5f9"
                            itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                            itemContainerStyle={{ borderRadius: 10 }}
                            fontFamily="Poppins_400Regular"
                            labelField="name"
                            valueField="id"
                            renderRightIcon={() => <ChevronDownIcon size={24} color="#0F172A" /> }
                        />
                        {error && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{error.message || 'Error'}</Text>}
                    </View>
                )}
            />
            <Controller
                control={control}
                name='classroom'
                rules={{ required: "Lokaal is verplicht" }}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                }) => (
                    <View className="mt-4">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Lokaal</Text>
                        <Dropdown
                            label="Vak"
                            data={classrooms}
                            valueExtractor={({ id }) => id}
                            labelExtractor={({ name }) => name}
                            onChange={onChange}
                            value={value}
                            onBlur={onBlur}
                            containerStyle={{ width: '100%', borderRadius: 10 }}
                            placeholder="Selecteer een lokaal"
                            className={`items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 text-sm border ${error ? 'border-red-500' : 'border-transparent'}`}
                            placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                            selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                            activeColor="#f1f5f9"
                            itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                            itemContainerStyle={{ borderRadius: 10 }}
                            fontFamily="Poppins_400Regular"
                            labelField="name"
                            valueField="id"
                            renderRightIcon={() => <ChevronDownIcon size={24} color="#0F172A" /> }
                        />
                        {error && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{error.message || 'Error' }</Text>}
                    </View>
                )}
            />
            <Controller
                control={control}
                name='date'
                rules={{
                    required: "Datum is verplicht",
                    validate: (value) => isToday(value) ? "Datum kan niet vandaag zijn" : true
                }}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                }) => (
                    <View className="mt-4">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Datum</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                            <CalendarIcon size={22} color="#0F172A" />
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ value ? formatDateFull(value) : (<Text className="text-gray-500">Kies een datum</Text>) }</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            minimumDate={new Date()}
                            mode="date"
                            onConfirm={(date) => {
                                setDatePickerVisibility(false);
                                onChange(date);
                            }}
                            onCancel={() => setDatePickerVisibility(false)}
                            onBlur={onBlur}
                            date={value || new Date()}
                            locale="nl-BE"
                        />
                        { error && <Text className="text-red-500 text-sm">{ error.message || 'Error' }</Text> }
                    </View>
                )}
            />
            <View className="mt-4">
                <View className="flex-row w-full">
                    <Controller
                        control={control}
                        name='startTime'
                        rules={{
                            required: "Tijd is verplicht",
                            validate: (value) => checkTime(value, getValues('endTime'))
                        }}
                        render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                        }) => (
                            <View className="flex-1 mr-2">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Start</Text>
                                <TouchableOpacity onPress={() => setStartTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                                    <ClockIcon size={22} color="#0F172A" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ value && formatTime(value) }</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isStartTimePickerVisible}
                                    mode="time"
                                    onConfirm={(time) => {
                                        setStartTimePickerVisibility(false);
                                        onChange(time);
                                    }}
                                    onCancel={() => setStartTimePickerVisibility(false)}
                                    onBlur={onBlur}
                                    date={ value || new Date() }
                                    locale='nl-BE'
                                />
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name='endTime'
                        rules={{
                            required: "Tijd is verplicht",
                            validate: (value) => checkTime(getValues('startTime'), value)
                        }}
                        render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                        }) => (
                            <View className="flex-1 ml-2">
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Einde</Text>
                                <TouchableOpacity onPress={() => setEndTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                                    <ClockIcon size={22} color="#0F172A" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ value && formatTime(value) }</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isEndTimePickerVisible}
                                    mode="time"
                                    onConfirm={(time) => {
                                        setEndTimePickerVisibility(false);
                                        onChange(time);
                                    }}
                                    onCancel={() => setEndTimePickerVisibility(false)}
                                    onBlur={onBlur}
                                    date={ value || new Date() }
                                    locale='nl-BE'
                                />
                            </View>
                        )}
                    />
                </View>
                { (errors.startTime && errors.endTime) || errors.startTime ? (<Text className="text-red-500 text-sm">{ errors.startTime.message }</Text>) : (errors.endTime && (<Text className="text-red-500 text-sm">{ errors.endTime.message }</Text>))}
            </View>
            <View className="mt-12 items-end">
                <TouchableOpacity className={`py-[10px] px-[15px] flex-row space-x-2 rounded-lg ${ Object.keys(errors).length === 0 ? 'bg-violet-500' : 'bg-neutral-400'}`} onPress={handleSubmit(onSubmit)} disabled={Object.keys(errors).length !== 0}>
                    <Text className="text-white">Maak</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MakeLesson