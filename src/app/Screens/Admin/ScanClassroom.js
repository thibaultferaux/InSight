import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLottieView from 'lottie-react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import 'expo-dev-client';
import NfcManager from 'react-native-nfc-manager';
import * as Haptics from 'expo-haptics';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { makeClassroom } from '../../../core/modules/classroom/api';


NfcManager.start();

const ScanClassroom = ({ route }) => {
    const { name } = route.params;

    const navigation = useNavigation();

    useEffect(() => {
        NfcProxy.readTag()
            .then((tag) => {
                if (tag) {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning
                    )
                    handleMakeClassroom(name, tag.id);
                }
            })
    }, [navigation])

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

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-2xl h-36">Scan de tag</Text>
            <View className="justify-center items-center">
                <AnimatedLottieView source={require('../../../../assets/animations/NFC-Scan.json')} autoPlay loop style={{ width: '80%' }} />
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