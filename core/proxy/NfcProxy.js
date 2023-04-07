import NfcManager, { NfcTech } from 'react-native-nfc-manager';

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

    async readTag() {
        let tag = null;

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            tag = await NfcManager.getTag();

            console.warn('Tag found', tag);

            NfcManager.cancelTechnologyRequest();
        } catch (error) {
            console.warn('Oops', error);
        }

        return tag;
    }
}

export default new NfcProxy();