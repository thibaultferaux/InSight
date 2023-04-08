import React, { useEffect, useState } from 'react'
import NfcProxy from '../../../core/proxy/NfcProxy';
import NfcNotSupported from '../../Screens/Nfc/NfcNotSupported';

const NfcContainer = ({ children }) => {
    const [supported, setSupported] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        initNfc();
    }, [])

    const initNfc = async () => {
        setRefreshing(true);
        const supported = await NfcProxy.init();
        setSupported(supported);
        setRefreshing(false);
    }

    return supported ? children : <NfcNotSupported reloadFunction={() => initNfc()} reload={refreshing} />;
}

export default NfcContainer