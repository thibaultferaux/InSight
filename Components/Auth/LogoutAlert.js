import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { logout } from '../../src/core/modules/auth/api'

const LogoutAlert = ({ onCancel }) => {
    useEffect(() => {
        Alert.alert(
            "Ben je zeker dat je wilt uitloggen?",
            "",
            [
                {
                    text: "Annuleer",
                    onPress: () => onCancel(),
                    style: "cancel"
                },
                { text: "OK", onPress: () => logout() }
            ],
            { cancelable: false }
        );
    }, [])

    return null
}

export default LogoutAlert