import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

const LoginInput = ({ placeholder, keyboardType, autoCapitalize, secureTextEntry, onChangeText, value, children }) => {
    const [borderColor, setBorderColor] = useState('#00000000');

    const onFocus = () => {
        setBorderColor('#a78bfa');
    }

    const onBlur = () => {
        setBorderColor('#00000000');
    }

    return (
        <View
            className={`flex-row items-center bg-slate-100 w-full p-4 rounded-[10px] space-x-4 border`}
            style={{ borderColor: borderColor }}
        >
            {children}
            <TextInput
                placeholder={placeholder}
                keyboardType={keyboardType} placeholderTextColor="#6B7280"
                style={{ fontFamily: 'Poppins_400Regular', paddingTop: 4, paddingBottom: 0 }}
                textAlignVertical="center"
                className="flex-1 text-sm text-slate-900 font-normal align-text-bottom"
                autoCapitalize={autoCapitalize}
                onFocus={() => onFocus()}
                onBlur={() => onBlur()}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                value={value}
            />
        </View>
    )
}

export default LoginInput