import { createContext, useContext, useState } from "react";

const NfcModalContext = createContext();

const NfcModalProvider = ({ children }) => {
    const [modalData, setModalData] = useState({
        visible: true,
        message: 'Ready to scan NFC',
    });

    return (
        <NfcModalContext.Provider value={{ modalData, setModalData }}>
            {children}
        </NfcModalContext.Provider>
    )

}

export const useNfcModalContext = () => useContext(NfcModalContext);

export default NfcModalProvider;