import { Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { store } from '../store/store';
import * as Haptics from 'expo-haptics';

// wrapper function that checks if platform is android and if so shows the androidmodal
const checkPlatform = (fn) => {
    async function wrapper() {
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
                if (data) {
                    modalData = {
                        visible: true,
                        message: 'Gescand',
                        success: true,
                    };
                } else {
                    modalData = {
                        visible: false,
                        message: '',
                        success: false,
                    };
                }
                store.setValue(modalData);
            }

            return data;
        } catch (error) {
            modalData = {
                visible: false,
                message: '',
                success: false,
            };
            store.setValue(modalData);
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
                }, 800)
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
            
            if (Platform.OS === 'ios') {
                await NfcManager.setAlertMessageIOS('Success');
            }

        } catch (error) {
            if (tag) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                )
                console.error('Oops', error);
            }
        } finally {
            NfcManager.cancelTechnologyRequest();
        }

        return tag;
    });

    checkTag = checkPlatform(async (classroomId) => {
        let tag = null;
        let result = false;

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            tag = await NfcManager.getTag();

            if (tag.id !== classroomId) {
                throw new Error('Tag is niet hetzelfde');
            }

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            )

            if (Platform.OS === 'ios') {
                await NfcManager.setAlertMessageIOS('Success');
            }

            result = true
        } catch (error) {
            if (tag) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                )
            }
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
            
        return { result, tag};
    })
}

export default new NfcProxy();