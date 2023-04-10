import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContainer from './src/app/Components/App/AppContainer';
import AuthProvider from './src/app/Components/Auth/AuthProvider';
import AppContent from './src/app/Navigators/AppContent';
import NfcContainer from './src/app/Components/Nfc/NfcContainer';
import NfcModalAndroid from './src/app/Components/Nfc/NfcModalAndroid';
import { StatusBar } from 'expo-status-bar';


export default function App() {
    return (
        <AppContainer>
            <NfcContainer>
                <AuthProvider>
                    <NavigationContainer>
                        <SafeAreaProvider>
                            <AppContent />
                            <FlashMessage position="top" />
                            <NfcModalAndroid />
                        </SafeAreaProvider>
                    </NavigationContainer>
                </AuthProvider>
            </NfcContainer>
        </AppContainer>
    );
}