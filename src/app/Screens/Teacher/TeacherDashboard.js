import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Modal, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../core/api/supabase';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import { getLessonsForTeacher } from '../../../core/modules/lesson/api';
import CurrentLessons from './CurrentLessons';
import PreviousLessons from './PreviousLessons';
import TeacherHeader from '../../Components/Teacher/TeacherHeader';
import TeacherTabBar from '../../Components/Teacher/TeacherTabBar';
import { Tabs } from 'react-native-collapsible-tab-view';

const TeacherDashboard = () => {
    const { user } = useAuthContext();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);

    useEffect(() => {
        getLessons()
        const lessonListener = supabase
            .channel('public:lesson')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lesson' },
                (payload) => {
                    getLessons()
                }
            ).subscribe();
    }, [])

    const getLessons = async () => {
        try {
            setCurrentLesson(null);

            await getLessonsForTeacher(user.id, setLessons, setCurrentLesson);

        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het ophalen van de lessen. Probeer het later opnieuw.")
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">                    
            <Tabs.Container
                renderHeader={() => (<TeacherHeader currentLesson={currentLesson} />)}
                headerContainerStyle={{ backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }}
                allowHeaderOverscroll={false}
                renderTabBar={TeacherTabBar}
            >
                <Tabs.Tab name="Komende Lessen">
                    <CurrentLessons lessons={lessons} />
                </Tabs.Tab>
                <Tabs.Tab name="Vorige Lessen">
                    <PreviousLessons lessons={lessons} />
                </Tabs.Tab>

                
            </Tabs.Container>
        </SafeAreaView>
    )
}

export default TeacherDashboard