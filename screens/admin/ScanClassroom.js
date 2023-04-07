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
import { makeClassroom } from '../../core/modules/classroom/api';
import NfcProxy from '../../core/proxy/NfcProxy';


NfcManager.start();

const ScanClassroom = ({ route }) => {
    /* const [hasNfc, setHasNfc] = useState(false);
    const [isScanning, setIsScanning] = useState(false); */
    const { name } = route.params;

    const navigation = useNavigation();

    /* const readTag = async () => {
        setIsScanning(true);
        await NfcManager.registerTagEvent();
    } */

    useEffect(() => {
        NfcProxy.readTag()
            .then((tag) => {
                if (tag) {
                    console.log(tag);
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning
                    )
                    handleMakeClassroom(name, tag.id);
                }
            })

        /* const checkIsSupported = async () => {
            const deviceIsSupported = await NfcManager.isSupported();

            setHasNfc(deviceIsSupported);
            if (deviceIsSupported) {
                await NfcManager.start();
            }
        }

        checkIsSupported();

        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
            )
            NfcManager.unregisterTagEvent().catch(() => 0);
            handleMakeClassroom(name, tag.id);
        })

        readTag();

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        } */
    }, [navigation])

    // if (hasNfc === null) return null;

    /* if (!hasNfc) {
        return (
            <View className="flex-1 items-center justify-center bg-white space-y-4">
                <Text className="text-gray-500">NFC not supported</Text>
            </View>
        )
    } */

    const handleMakeClassroom = async (name, id) => {
        try {
            await makeClassroom(name, id);
            navigation.navigate('ScanSuccess')
        } catch (error) {
            if (error.status) {
                Alert.alert('Dit klaslokaal bestaat al, u kunt deze aanpassen in het overzicht');
            } else {
                console.error(error);
            }
        }
    }

    /* const stopScanning = async () => {
        setIsScanning(false);
        await NfcManager.unregisterTagEvent();
    } */


    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl h-36">Scan de tag</Text>
            <View className="justify-center items-center">
                <AnimatedLottieView source={require('../../assets/animations/NFC-Scan.json')} autoPlay loop style={{ width: '80%' }} />
            </View>
            <View className="mt-12 items-start">
                <TouchableOpacity className="py-[10px] px-[15px] bg-neutral-400 flex-row space-x-2 rounded-lg" onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon size={22} color="white" />
                    <Text className="text-white">Vorige</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ScanClassroom