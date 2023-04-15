import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { getCoursesFromTeacher } from '../../../core/modules/course/api';
import { getAllClassrooms } from '../../../core/modules/classroom/api';
import { ArrowRightIcon, CalendarIcon, ChevronDownIcon, ClockIcon } from 'react-native-heroicons/outline';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuthContext } from '../Auth/AuthProvider';
import { checkTime, formatDateFull, formatTime, isToday } from '../../../core/utils/dateTime';

const LessonForm = ({ lesson, onSubmit, submitLabel, loading }) => {
    const { user } = useAuthContext();
    const [ courses, setCourses ] = useState([]);
    const [ classrooms, setClassrooms ] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    const { control, handleSubmit, formState: { errors }, getValues } = useForm({
        defaultValues: {
            subject: lesson ? lesson.course : null,
            classroom: lesson ? lesson.classroomtag : null,
            date: lesson ? new Date(lesson.startTime) : null,
            startTime: lesson ? new Date(lesson.startTime) : null,
            endTime: lesson ? new Date(lesson.endTime) : null,
        }
    });

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




    return (
        <>
            <Controller
                control={control}
                name='subject'
                rules={{ required: "Vak is verplicht" }}
                render={({ 
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                }) => (
                    <View className="mt-12">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Vak</Text>
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
                            className={`items-center bg-slate-100 w-full px-4 py-[14px] rounded-[10px] space-x-4 text-sm border ${error ? 'border-red-500' : 'border-transparent'}`}
                            placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                            selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                            activeColor="#f1f5f9"
                            itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                            itemContainerStyle={{ borderRadius: 10 }}
                            fontFamily="Poppins_400Regular"
                            labelField="name"
                            valueField="id"
                            renderRightIcon={() => <ChevronDownIcon size={24} color="#171717" /> }
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
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Lokaal</Text>
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
                            className={`items-center bg-slate-100 w-full px-4 py-[14px] rounded-[10px] space-x-4 text-sm border ${error ? 'border-red-500' : 'border-transparent'}`}
                            placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                            selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                            activeColor="#f1f5f9"
                            itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#171717' }}
                            itemContainerStyle={{ borderRadius: 10 }}
                            fontFamily="Poppins_400Regular"
                            labelField="name"
                            valueField="id"
                            renderRightIcon={() => <ChevronDownIcon size={24} color="#171717" /> }
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
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Datum</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                            <CalendarIcon size={22} color="#171717" />
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-neutral-900 align-text-bottom">{ value ? formatDateFull(value) : (<Text className="text-gray-500">Kies een datum</Text>) }</Text>
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
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Start</Text>
                                <TouchableOpacity onPress={() => setStartTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                                    <ClockIcon size={22} color="#171717" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-neutral-900 align-text-bottom">{ value && formatTime(value) }</Text>
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
                                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2 text-neutral-900">Einde</Text>
                                <TouchableOpacity onPress={() => setEndTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5
                                 rounded-[10px] space-x-4 border ${ error ? 'border-red-500' : 'border-transparent'}`}>
                                    <ClockIcon size={22} color="#171717" />
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-neutral-900 align-text-bottom">{ value && formatTime(value) }</Text>
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
                <TouchableOpacity className={`py-[10px] px-[15px] flex-row space-x-2 rounded-lg ${ (Object.keys(errors).length === 0 && !loading) ? 'bg-violet-500' : 'bg-violet-300'}`} onPress={handleSubmit(onSubmit)} disabled={(Object.keys(errors).length !== 0) || loading}>
                    <Text className="text-white">{ submitLabel }</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default LessonForm