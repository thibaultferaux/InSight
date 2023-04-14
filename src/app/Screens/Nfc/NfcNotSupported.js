import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const NfcNotSupported = ({ reloadFunction, reload }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView className="px-12 flex-1 justify-center">
                <ScrollView contentContainerStyle={{ flex: 1 }} vertical
                    refreshControl={
                        <RefreshControl refreshing={reload} onRefresh={reloadFunction} />
                    }
                >
                    <View className="flex-1 justify-center items-center space-y-4">
                        <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-lg text-center text-neutral-900">
                            Nfc wordt niet ondersteund op uw apparaat.
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-center text-gray-500">
                            Tot er een oplossing is, kunt u de app niet gebruiken. Onze excuses voor het ongemak.
                        </Text>
                    </View> 
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default NfcNotSupported