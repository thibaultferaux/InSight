import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { forwardRef, useState } from 'react'
import { Controller } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from 'react-native-heroicons/outline';

const FormInput = forwardRef(
    (
        {
            control,
            name,
            placeholder,
            secureTextEntry,
            rules = {},
            autoCapitalize = 'sentences',
            keyboardType = 'default',
            returnKeyType,
            onSubmitEditing,
            children,
            ...props
        },
        ref
    ) => {
        const [visible, setVisible] = useState(false)

        return (
            <Controller
                control={control}
                name={name}
                rules={rules}
                render = {({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <>
                        <View
                            className={`flex-row items-center bg-slate-100 px-4 py-[14px] rounded-[10px] space-x-4 border relative ${error ? 'border-red-500 focus:border-red-600' : 'border-transparent focus:border-violet-500'}`}
                        >
                            {children}
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder={placeholder}
                                placeholderTextColor="#6B7280"
                                style={{ fontFamily: 'Poppins_400Regular', paddingTop: 4, paddingBottom: 0 }}
                                textAlignVertical="center"
                                className="flex-1 text-sm text-slate-900 font-normal align-text-bottom"
                                secureTextEntry={secureTextEntry ? !visible : false}
                                autoCapitalize={autoCapitalize}
                                keyboardType={keyboardType}
                                returnKeyType={returnKeyType}
                                onSubmitEditing={onSubmitEditing}
                                blurOnSubmit={false}
                                ref={ref}
                            />
                            { secureTextEntry &&(
                                <TouchableOpacity
                                    className="items-center justify-center"
                                    onPress={() => setVisible(!visible)}
                                >
                                    { visible ? (
                                        <EyeIcon size={22} color="#0F172A" />
                                    ) : (
                                        <EyeSlashIcon size={22} color="#0F172A" />
                                    ) }
                                </TouchableOpacity>
                            ) }
                            {/* x icon when typing to clear input */}
                            { (name === 'search' && value.length > 0) && (
                                <TouchableOpacity
                                    className="items-center justify-center"
                                    onPress={() => onChange('')}
                                >
                                    <XMarkIcon size={22} color="#0F172A" />
                                </TouchableOpacity>
                            ) }
                        </View>
                        {error && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{error.message || 'Error'}</Text>}
                    </>
                ) }
            />
    )}
)

export default FormInput