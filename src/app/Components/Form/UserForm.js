import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { AcademicCapIcon, ArrowRightIcon, ChevronDownIcon, EnvelopeIcon, UserIcon } from 'react-native-heroicons/outline'
import { Controller, useForm } from 'react-hook-form'
import FormInput from './FormInput'
import { Dropdown } from 'react-native-element-dropdown'

const AUTHROLES = [
    { label: 'Student', value: 1 },
    { label: 'Docent', value: 2 },
    { label: 'Admin', value: 3 },
]
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const UserForm = ({ onSubmit, submitLabel, loading}) => {
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const roleInputRef = useRef(null);


    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            role: null,
        }
    });

    return (
        <View className="space-y-4">
            <View className="mt-12">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Voornaam</Text>
                <FormInput
                    name="first_name"
                    ref={firstNameInputRef}
                    control={control}
                    rules={{ required: 'Voornaam is verplicht'}}
                    autoCapitalize="words"
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameInputRef.current && lastNameInputRef.current.focus()}
                >
                    <UserIcon color="#0F172A" size={22} />
                </FormInput>
            </View>
            <View>
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Familienaam</Text>
                <FormInput
                    name="last_name"
                    ref={lastNameInputRef}
                    control={control}
                    rules={{ required: 'Familienaam is verplicht'}}
                    autoCapitalize="words"
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
                >
                    <UserIcon color="#0F172A" size={22} />
                </FormInput>
            </View>
            <View>
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">E-mail</Text>
                <FormInput
                    name="email"
                    ref={emailInputRef}
                    control={control}
                    rules={{
                        required: 'E-mailadres is verplicht',
                        pattern: {
                            value: EMAIL_REGEX,
                            message: 'Vul een geldig e-mailadres in'
                        }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        if (roleInputRef.current) {
                            emailInputRef.current.blur();
                            roleInputRef.current.open();
                        }
                    }}
                >
                    <EnvelopeIcon color="#0F172A" size={22} />
                </FormInput>
            </View>
            <View className="mb-12">
                <Text style={{ fontFamily: 'Poppins_500Medium' }} className="text-sm mb-2">Rol</Text>
                <Controller
                    control={control}
                    name="role"
                    rules={{ required: 'Rol is verplicht' }}
                    render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error }
                    }) => (
                        <>
                            <Dropdown
                                label="Rol"
                                data={AUTHROLES}
                                value={value}
                                valueExtractor={({ value }) => value}
                                labelExtractor={({ label }) => label}
                                ref={roleInputRef}
                                onChange={onChange}
                                onBlur={onBlur}
                                containerStyle={{ width: '100%', borderRadius: 10 }}
                                placeholder=""
                                className={`items-center bg-slate-100 w-full px-4 py-[14px] rounded-[10px] space-x-4 text-sm border ${error ? 'border-red-500' : 'border-transparent'}`}
                                placeholderStyle={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}
                                selectedTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                                activeColor="#f1f5f9"
                                itemTextStyle={{ marginTop: 4, fontSize: 14, color:'#0F172A' }}
                                itemContainerStyle={{ borderRadius: 10 }}
                                fontFamily="Poppins_400Regular"
                                labelField="label"
                                valueField="value"
                                renderLeftIcon={() => (
                                    <View className="mr-4">
                                        <AcademicCapIcon size={24} color="#0F172A" />
                                    </View>
                                )}
                                renderRightIcon={() => <ChevronDownIcon size={24} color="#0F172A" /> }
                            />
                            {error && <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-sm text-red-500">{error.message || 'Error'}</Text>}
                        </>
                    )}
                />
            </View>
            <View className="items-end">
                <TouchableOpacity className={`py-[10px] px-[15px] flex-row space-x-2 rounded-lg ${ (Object.keys(errors).length === 0 && !loading) ? 'bg-violet-500' : 'bg-violet-500/50'}`} onPress={handleSubmit(onSubmit)} disabled={(Object.keys(errors).length !== 0) || loading}>
                    <Text className="text-white">{ submitLabel }</Text>
                    <ArrowRightIcon size={22} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UserForm