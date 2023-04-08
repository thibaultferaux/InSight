import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContainer from './Components/App/AppContainer';
import AuthProvider from './Components/Auth/AuthProvider';
import AppContent from './Navigators/AppContent';
import NfcContainer from './Components/Nfc/NfcContainer';
import NfcModalAndroid from './Components/Nfc/NfcModalAndroid';


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