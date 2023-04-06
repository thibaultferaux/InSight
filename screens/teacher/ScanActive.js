import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLottieView from 'lottie-react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import 'expo-dev-client';
import NfcManager, { NfcTech, Ndef, NfcEvents } from 'react-native-nfc-manager';
import { supabase } from '../../core/api/supabase';
import * as Haptics from 'expo-haptics';

NfcManager.start();

const ScanActive = ({ route }) => {
    const [hasNfc, setHasNfc] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const { lessonId, classroomId, courseId } = route.params;

    const navigation = useNavigation();

    const readTag = async () => {
        setIsScanning(true);
        await NfcManager.registerTagEvent();
    }

    useEffect(() => {
        const checkIsSupported = async () => {
            const deviceIsSupported = await NfcManager.isSupported();

            setHasNfc(deviceIsSupported);
            if (deviceIsSupported) {
                await NfcManager.start();
            }
        }

        checkIsSupported();

        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
            if (tag.id == classroomId) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                )
                addStudentsToAttendance();
            } else {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                )
                Alert.alert('Fout', 'Dit is niet het juiste lokaal');
            }
        })

        readTag();

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        }
    })

    if (!hasNfc) {
        return (
            <View className="flex-1 items-center justify-center bg-white space-y-4">
                <Text className="text-gray-500">NFC not supported</Text>
            </View>
        )
    }

    const makeLessonActive = async () => {
        // update lesson with lessonId to active
        const { error } = await supabase
            .from('lesson')
            .update({ active: true })
            .eq('id', lessonId)

        if (error) {
            Alert.alert('Er ging iets mis', 'Probeer het later opnieuw');
            return;
        } else {
            stopScanning();
            navigation.navigate('Dashboard');
        }
    }

    const addStudentsToAttendance = async () => {
        try {
            // get all students from classroom that exist in the usercourse table
            const { data, error } = await supabase
                .from('usercourse')
                .select('id, userId, courseId')
                .eq('courseId', courseId)

            if (error) {
                console.error(error);
                throw new Error('Er ging iets mis, probeer het later opnieuw')
            }

            // add students to attendance table
            const attendanceData = data.map((student) => ({
                userId: student.userId,
                lessonId: lessonId,
            }))

            const { error: insertError } = await supabase.from('presentstudent').insert(attendanceData)
            
            if (insertError) {
                console.error(insertError);
                throw new Error('Er ging iets mis, probeer het later opnieuw')
            }

            makeLessonActive();

        } catch (error) {
            console.error(error);
            Alert.alert('Fout', error.message)
        }
    }
        

    const stopScanning = async () => {
        setIsScanning(false);
        await NfcManager.unregisterTagEvent();
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <View className="items-start space-y-2 h-36">
                <TouchableOpacity className="flex-row space-x-1 justify-center items-center" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={16} color="#9ca3af" />
                    <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400">Terug</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl">Scan de tag van het lokaal</Text>
            </View>
            <View className="justify-center items-center mt-12">
                <AnimatedLottieView source={require('../../assets/animations/NFC-Scan.json')} autoPlay loop style={{ width: '80%' }} />
            </View>
            <View className="mt-6 items-center">
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-gray-400 text-center">Raak met de achterkant van je telefoon te tag aan om deze te scannen.</Text>
            </View>
        </SafeAreaView>
    )
}

export default ScanActive