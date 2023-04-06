import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from './core/api/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContainer from './Components/App/AppContainer';
import AuthProvider from './Components/Auth/AuthProvider';
import AppContent from './Navigators/AppContent';


export default function App() {
    return (
        <AppContainer>
            <AuthProvider>
                <NavigationContainer>
                    <SafeAreaProvider>
                        <AppContent />
                        <FlashMessage position="top" />
                    </SafeAreaProvider>
                </NavigationContainer>
            </AuthProvider>
        </AppContainer>
    );
}