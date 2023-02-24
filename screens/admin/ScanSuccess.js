import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AnimatedLottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'

const ScanSuccess = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 justify-start bg-white px-7 py-10">
            <View className="justify-center items-center mt-36">
                <AnimatedLottieView source={require('../../assets/animations/NFC-succes.json')} autoPlay loop={false} style={{ width: '80%' }} onAnimationFinish={() => navigation.navigate('Dashboard')} />
            </View>
        </SafeAreaView>
    )
}

export default ScanSuccess