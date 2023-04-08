import { Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { store } from '../store/store';
import * as Haptics from 'expo-haptics';



// wrapper function that checks if platform is android and if so shows the androidmodal
const checkPlatform = (fn) => {
    const wrapper = async () => {
        try {
            let modalData;
            if (Platform.OS == 'android') {
                modalData = {
                    visible: true,
                    message: 'Klaar om te scannen',
                    success: false,
                };
                store.setValue(modalData);
            }

            const data = await fn.apply(null, arguments);

            if (Platform.OS === 'android') {
                modalData = {
                    visible: true,
                    message: 'Gescand',
                    success: true,
                };
                store.setValue(modalData);
            }

            return data;
        } catch (error) {
            throw error;
        } finally {
            if (Platform.OS === 'android') {
                setTimeout(() => {
                    modalData = {
                        visible: false,
                        message: '',
                        success: true,
                    };
                    store.setValue(modalData);
                }, 1800)
            }
        }
    };

    return wrapper;
}


class NfcProxy {
    async init() {
        const supported = await NfcManager.isSupported();
        if (supported) {
            await NfcManager.start();
        }
        return supported;
    }

    async isEnabled() {
        return NfcManager.isEnabled();
    }

    async goToNfcSetting() {
        return NfcManager.goToNfcSetting();
    }

    readTag = checkPlatform(async () => {
        let tag = null;

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            tag = await NfcManager.getTag();

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            )
        } catch (error) {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
            )
            console.error('Oops', error);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }

        return tag;
    });
}

export default new NfcProxy();