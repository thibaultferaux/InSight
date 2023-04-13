import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import AdminHeader from '../../Components/Admin/AdminHeader'
import TeacherTabBar from '../../Components/Teacher/TeacherTabBar'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAllStudents, getAllTeachers } from '../../../core/modules/users/api'
import UserList from '../../Components/Admin/UserList'

const UsersOverview = () => {
    const [students, setStudents] = useState();
    const [teachers, setTeachers] = useState();
    const { control, watch } = useForm({
        defaultValues: {
            search: '',
        }
    })

    useEffect(() => {
        getStudents()
        getTeachers()
    }, [])

    const getStudents = async () => {
        try {
            const data = await getAllStudents();

            if (data) {
                setStudents(data);
            }
        } catch (error) {
            console.error(error)
            Alert.alert('Er is iets misgegaan met het ophalen van de gebruikers. Probeer het later opnieuw.')
        }
    } 

    const getTeachers = async () => {
        try {
            const data = await getAllTeachers();

            if (data) {
                setTeachers(data);
            }
        } catch (error) {
            console.error(error)
            Alert.alert('Er is iets misgegaan met het ophalen van de gebruikers. Probeer het later opnieuw.')
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-white">
            <Tabs.Container
                renderHeader={() => (<AdminHeader control={control} />)}
                headerContainerStyle={{ backgroundColor: '#fff', shadowOpacity: 0, elevation: 0 }}
                containerStyle={{ height: '100%' }}
                allowHeaderOverscroll={true}
                renderTabBar={TeacherTabBar}
            >
                <Tabs.Tab name="Studenten">
                    <UserList users={students} search={watch('search')} />
                </Tabs.Tab>
                <Tabs.Tab name="Docenten">
                    <UserList users={teachers} search={watch('search')} />
                </Tabs.Tab>
            </Tabs.Container>
        </SafeAreaView>
    )
}

export default UsersOverview