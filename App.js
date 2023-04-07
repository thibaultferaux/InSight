import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAccounts, supabase } from './core/api/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContainer from './Components/App/AppContainer';
import AuthProvider from './Components/Auth/AuthProvider';
import AppContent from './Navigators/AppContent';
import NfcContainer from './Components/Nfc/NfcContainer';
import NfcModalProvider from './Components/Nfc/NfcModalProvider';
import NfcModalAndroid from './Components/Nfc/NfcModalAndroid';


export default function App() {
    return (
        <AppContainer>
            <NfcContainer>
                <AuthProvider>
                    <NavigationContainer>
                        <SafeAreaProvider>
                            <NfcModalProvider>
                                <AppContent />
                                <FlashMessage position="top" />
                                <NfcModalAndroid />
                            </NfcModalProvider>
                        </SafeAreaProvider>
                    </NavigationContainer>
                </AuthProvider>
            </NfcContainer>
        </AppContainer>
    );
}