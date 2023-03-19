import { View, Text, TouchableOpacity, Alert, Button } from 'react-native'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from "react-hook-form";
import { supabase } from '../../lib/supabase';
import { Dropdown } from 'react-native-element-dropdown';

const MakeLesson = ({ route }) => {
    const navigation = useNavigation();
    const { session } = route.params;
    const [ name, setName ] = useState('');
    const [ courses, setCourses ] = useState([]);

    const { control, handleSubmit, formState: { errors } } = useForm({
        
    });

    useEffect(() => {
        if (session) getCourses()
    }, [])

    const getCourses = async () => {
        try {
            if (!session?.user) throw new Error('No user on the session')

            let { data, error, status } = await supabase
                .from('course')
                .select()
                .eq('teacherId', session?.user.id)

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setCourses(data)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);

        console.log(currentDate);
    };

    const showMode = (currentMode) => {
        setShowDate(true);
    };

    // load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold
    });

    // if fonts are not loaded, return null
    if (!fontsLoaded) {
        return null;
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
            <View>
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-lg mt-10">Vak</Text>
                <Dropdown
                    label="Vak"
                    data={courses}
                    valueExtractor={({ id }) => id}
                    labelExtractor={({ name }) => name}
                    onChange={value => setName(value)}
                    value={name}
                    containerStyle={{ width: '100%', borderRadius: 10 }}
                    placeholder="Selecteer een vak"
                    className="mt-2 items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 text-sm"
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
            </View>
            <View>
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-lg mt-10">Datum</Text>
            </View>
        </SafeAreaView>
    )
}

export default MakeLesson