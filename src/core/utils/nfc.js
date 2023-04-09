import { Alert } from "react-native";
import NfcProxy from "../proxy/NfcProxy";

export const NfcNotEnabledAlert = (fn) => {
    Alert.alert(
        'NFC is niet ingeschakeld',
        'Schakel NFC in om verder te gaan',
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