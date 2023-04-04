import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import React, { useEffect, useState } from 'react'
import moment from 'moment/moment'

const DateSlider = ({ lessons, onDaySelected }) => {
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        const selectedDay = lessons.find((lesson) => lesson.date === selectedDate) ?? { date: selectedDate, items: [] };
        onDaySelected(selectedDay);
    }, [ selectedDate ]);

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    const twoWeeksFromNow = moment().add(2, 'weeks');
    const dates = [];

    for (let date = moment(); date.isBefore(twoWeeksFromNow); date.add(1, 'day')) {
        dates.push(date.format('YYYY-MM-DD'));
    }

    const handleDayPress = (date) => {
        setSelectedDate(date);
    };

    const formatDay = (date) => {
        const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
        const day = moment(date).format('d');
        return weekdays[day];
    };

    const renderDay = ({ item, index }) => {
        const dayLessons = lessons.find((lesson) => lesson.date == item)?.items ?? [];
        const isSelected = item === selectedDate;

        return (
            <TouchableOpacity onPress={() => handleDayPress(item)} className={`my-6 mx-1 ${index == 0 ? 'ml-7' : index + 1 == dates.length && 'mr-7'} w-16 px-5 py-3 rounded-2xl items-center shadow-lg shadow-slate-500/40 ${isSelected ? 'bg-violet-500' : 'bg-white'}`}>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className={`${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>{formatDay(item)}</Text>
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className={`text-xl -mt-[6px] ${isSelected ? 'text-white' : 'text-gray-500'}`}>{moment(item).format('D')}</Text>
                { dayLessons.length > 0 && <View className={`h-1 w-4 mt-[1px] bg-violet-300 rounded-sm`} /> }
            </TouchableOpacity>
        )

    };

    return (
        <FlatList
            horizontal
            data={dates}
            renderItem={renderDay}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            className="-mx-7"
        />
    )
}

export default DateSlider