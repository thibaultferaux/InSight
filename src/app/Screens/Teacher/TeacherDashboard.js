import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Modal, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../core/api/supabase';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import { getLessonsForTeacher } from '../../../core/modules/lesson/api';
import TeacherHeader from '../../Components/Teacher/TeacherHeader';
import TeacherTabBar from '../../Components/Teacher/TeacherTabBar';
import { Tabs } from 'react-native-collapsible-tab-view';
import TeacherPreviousLessons from '../../Components/Teacher/TeacherPreviousLessons';
import TeacherFutureLessons from '../../Components/Teacher/TeacherFutureLessons';


const TeacherDashboard = () => {
    const { user } = useAuthContext();
    const [futurelessons, setFutureLessons] = useState();
    const [pastLessons, setPastLessons] = useState();
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

            await getLessonsForTeacher({teacherId: user.id, setFutureLessons, setPastLessons, setCurrentLesson});

        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het ophalen van de lessen. Probeer het later opnieuw.")
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">                    
            <Tabs.Container
                renderHeader={() => (<TeacherHeader currentLesson={currentLesson} />)}
                headerContainerStyle={{ backgroundColor: '#f8fafc', shadowOpacity: 0, elevation: 0 }}
                allowHeaderOverscroll={false}
                renderTabBar={TeacherTabBar}
            >
                <Tabs.Tab name="Komende Lessen">
                    <TeacherFutureLessons lessons={futurelessons} />
                </Tabs.Tab>
                <Tabs.Tab name="Vorige Lessen">
                    <TeacherPreviousLessons lessons={pastLessons} />
                </Tabs.Tab>
            </Tabs.Container>
        </SafeAreaView>
    )
}

export default TeacherDashboard