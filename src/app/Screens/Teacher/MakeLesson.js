import { View, Text, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ClockIcon } from 'react-native-heroicons/outline';
import { CalendarIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from "react-hook-form";
import { supabase } from '../../../core/api/supabase';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getCoursesFromTeacher } from '../../../core/modules/course/api';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import { combineDateAndTime, formatDateFull, formatTime, isToday } from '../../../core/utils/dateTime';
import { getAllClassrooms } from '../../../core/modules/classroom/api';
import { makeLesson } from '../../../core/modules/lesson/api';

const MakeLesson = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuthContext();
    const [ subject, setSubject ] = useState();
    const [ classroom, setClassroom ] = useState();
    const [ courses, setCourses ] = useState([]);
    const [ classrooms, setClassrooms ] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState('');
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [startTime, setStartTime] = useState();
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [endTime, setEndTime] = useState();
    const [ errors, setErrors ] = useState({ subject: '', classroom: '', date: '', time: '' });

    useEffect(() => {
        getCourses();
        getClassrooms();
    }, [])

    const changeSubject = (item) => {
        setSubject(item);
        setErrors({ ...errors, subject: '' })
    }

    const changeClassroom = (item) => {
        setClassroom(item);
        setErrors({ ...errors, classroom: '' })
    }

    const handleDateConfirm = (date) => {
        setDate(date);
        setDatePickerVisibility(false);
        checkDate(date);
    };

    const handleStartTimeConfirm = (time) => {
        setStartTime(time);
        setStartTimePickerVisibility(false);
        checkTime(time, endTime);
    };

    const handleEndTimeConfirm = (time) => {
        setEndTime(time);
        setEndTimePickerVisibility(false);
        checkTime(startTime, time);
    };

    const checkDate = (date) => {
        if (isToday(date)) {
            setErrors({ ...errors, date: 'Datum kan niet vandaag zijn' })
            return false
        } else if (date < new Date()) {
            setErrors({ ...errors, date: 'Datum kan niet in het verleden liggen' })
            return false
        } else {
            setErrors({ ...errors, date: '' })
            return true
        }
    }

    const checkTime = (startTime, endTime) => {
        if (startTime && endTime) {
            if (startTime >= endTime) {
                setErrors({ ...errors, time: 'Starttijd moet voor eindtijd liggen' })
                return false
            } else {
                setErrors({ ...errors, time: '' })
                return true
            }
        }
    }

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

    const onSubmit = async () => {

        if(!subject || !classroom || !date || !startTime || !endTime) {
            setErrors({
                ...errors,
                subject: !subject ? 'Vak is verplicht' : '',
                classroom: !classroom ? 'Lokaal is verplicht' : '',
                date: !date ? 'Datum is verplicht' : '',
                time: !startTime || !endTime ? 'Tijd is verplicht' : ''
            })
            return
        }
        
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
            <View className="mt-12">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Vak</Text>
                <Dropdown
                    label="Vak"
                    data={courses}
                    valueExtractor={({ id }) => id}
                    labelExtractor={({ name }) => name}
                    onChange={changeSubject}
                    value={subject}
                    containerStyle={{ width: '100%', borderRadius: 10 }}
                    placeholder="Selecteer een vak"
                    className={`items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 text-sm ${errors.subject && 'border-red-500 border'}`}
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
                {errors.subject && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{errors.subject}</Text>}
            </View>
            <View className="mt-4">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Lokaal</Text>
                <Dropdown
                    label="Vak"
                    data={classrooms}
                    valueExtractor={({ id }) => id}
                    labelExtractor={({ name }) => name}
                    onChange={changeClassroom}
                    value={classroom}
                    containerStyle={{ width: '100%', borderRadius: 10 }}
                    placeholder="Selecteer een lokaal"
                    className={`items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 text-sm ${errors.classroom && 'border-red-500 border'}`}
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
                {errors.classroom && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{errors.classroom}</Text>}
            </View>
            <View className="mt-4">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Datum</Text>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 ${ errors.date && 'border border-red-600'}`}>
                    <CalendarIcon size={22} color="#0F172A" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ date ? formatDateFull(date) : (<Text className="text-gray-500">Kies een datum</Text>) }</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                    date={new Date()}
                    locale="nl-BE"
                />
                { errors.date && <Text className="text-red-600 text-sm">{ errors.date }</Text> }
            </View>
            <View className="mt-4">
                <View className="flex-row w-full space-x-4">
                    <View className="flex-1">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Start</Text>
                        <TouchableOpacity onPress={() => setStartTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 ${ errors.time && 'border border-red-500'}`}>
                            <ClockIcon size={22} color="#0F172A" />
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ startTime && formatTime(startTime) }</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isStartTimePickerVisible}
                            mode="time"
                            onConfirm={handleStartTimeConfirm}
                            onCancel={() => setStartTimePickerVisibility(false)}
                            date={ startTime ? startTime : new Date() }
                            locale='nl-BE'
                        />
                    </View>
                    <View className="flex-1">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Einde</Text>
                        <TouchableOpacity onPress={() => setEndTimePickerVisibility(true)} className={`flex-row items-center bg-slate-100 w-full px-4 py-5 rounded-[10px] space-x-4 ${ errors.time && 'border border-red-500'}`}>
                            <ClockIcon size={22} color="#0F172A" />
                            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-slate-900 align-text-bottom">{ endTime && formatTime(endTime) }</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isEndTimePickerVisible}
                            mode="time"
                            onConfirm={handleEndTimeConfirm}
                            onCancel={() => setEndTimePickerVisibility(false)}
                            date={ endTime ? endTime : new Date() }
                            locale='nl-BE'
                        />
                    </View>
                </View>
                { errors.time && <Text className="text-red-600 text-sm">{ errors.time }</Text> }
            </View>
            <View className="mt-12 items-end">
                <TouchableOpacity className={`py-[10px] px-[15px] flex-row space-x-2 rounded-lg ${(errors.subject || errors.classroom || errors.date || errors.time) ? 'bg-neutral-400' : 'bg-violet-500'}`} onPress={async () => await onSubmit()} disabled={errors.subject != '' || errors.classroom != '' || errors.date != '' || errors.time != '' }>
                    <Text className="text-white">Maak</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MakeLesson