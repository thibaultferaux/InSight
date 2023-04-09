import { View, Text, Animated, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AnimatedLottieView from 'lottie-react-native';
import NfcManager from 'react-native-nfc-manager';
import { useGlobalState } from 'state-pool';
import { store } from '../../../core/store/store';

const NfcModalAndroid = (props) => {
    const [visible, setVisible] = useState(false);
    const animValue = useRef(new Animated.Value(0)).current;
    const [ modalData, setModalData ] = useGlobalState(store);

    useEffect(() => {
        if (modalData.visible) {
            setVisible(true);
            Animated.timing(animValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        }
    }, [modalData.visible, animValue])

    const cancelNfcScan = () => {
        setTimeout(() => {
            NfcManager.cancelTechnologyRequest().catch(() => 0);
        }, 200);
        setModalData({
            visible: false,
            message: '',
        });
    }

    const promptAnimatedStyle = {
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [350, 0],
                }),
            },
        ],
    }

    const bgAnimatedStyle = {
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: animValue,
    };

    return (
        <Modal transparent visible={visible}>
            <View className="h-full w-full bg-transparent items-center">
                <View className="flex-1" />
                <Animated.View
                    className="h-[350px] self-stretch p-7 bg-white rounded-3xl m-5 z-10"
                    style={promptAnimatedStyle}
                >
                    <View className="flex-1 justify-between items-center pb-6">
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-gray-400 text-xl">
                            {modalData.message}
                        </Text>
                        {
                            modalData.success ? (
                                <AnimatedLottieView source={require('../../../../assets/animations/NFC-succes.json')} autoPlay loop={false} style={{ width: 120 }} />
                            ) : (
                                <AnimatedLottieView source={require('../../../../assets/animations/NFC-Scan.json')} autoPlay loop style={{ width: 120 }} />
                            )
                        }
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className={`text-base ${modalData.success && 'opacity-0'}`}>
                            Hou je telefoon tegen de NFC tag
                        </Text>
                    </View>

                    <TouchableOpacity onPress={cancelNfcScan} disabled={modalData.success} className={`w-full justify-center items-center py-5 bg-gray-300 rounded-lg ${modalData.success && 'opacity-0'}`}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-base pt-[1px]">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View className="absolute inset-0" style={bgAnimatedStyle} />
            </View>
        </Modal>
    )
}

export default NfcModalAndroid