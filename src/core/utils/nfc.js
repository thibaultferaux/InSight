import { Alert } from "react-native";
import NfcProxy from "../proxy/NfcProxy";

export const NfcNotEnabledAlert = (fn) => {
    Alert.alert(
        'NFC is not enabled',
        'Please enable NFC in your phone settings',
        [
            {
                text: 'Probeer opnieuw',
                onPress: fn,
                style: 'cancel',
            },
            {
                text: 'Ga naar instellingen',
                onPress: () => NfcProxy.goToNfcSetting(),
                style: 'default',
            }
        ],
        { cancelable: false }
    );
};