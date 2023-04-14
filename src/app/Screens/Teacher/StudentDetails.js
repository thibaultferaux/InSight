import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Components/Auth/AuthProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StudentDetailHeader from '../../Components/Teacher/StudentDetailHeader';
import { Tabs } from 'react-native-collapsible-tab-view';
import TeacherTabBar from '../../Components/Teacher/TeacherTabBar';
import { getAttendancesOfStudentForTeacher } from '../../../core/modules/attendance/api';
import StudentDetailsData from '../../Components/Teacher/StudentDetailsData';
import { supabase } from '../../../core/api/supabase';

const StudentDetails = ({ route }) => {
    const { user } = useAuthContext();
    const { student } = route.params;
    const [attendancesAll, setAttendancesAll] = useState();
    const [lessonsAll, setLessonsAll] = useState();
    const [attendances30Days, setAttendances30Days] = useState();
    const [lessons30Days, setLessons30Days] = useState();

    useEffect(() => {
        getAllAttendances();
        get30DayAttendances();
        supabase
            .channel('public:presentstudent:userId=eq.' + student.studentId)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'presentstudent', filter: 'userId=eq.' + student.studentId },
                () => {
                    getAllAttendances();
                    get30DayAttendances();
                }
            ).subscribe();
    }, [])

    getAllAttendances = async () => {
        try {
            const { lessons, attendanceAll } = await getAttendancesOfStudentForTeacher(student.studentId, user.id);

            setAttendancesAll(attendanceAll);
            setLessonsAll(lessons);

        } catch (error) {
            console.error(error);
            Alert.alert('Er is iets misgegaan met het ophalen van de aanwezigheden. Probeer het later opnieuw.')
        }
    }

    get30DayAttendances = async () => {
        try {
            const { lessons, attendanceAll } = await getAttendancesOfStudentForTeacher(student.studentId, user.id, true);

            setAttendances30Days(attendanceAll);
            setLessons30Days(lessons);

        } catch (error) {
            console.error(error);
            Alert.alert('Er is iets misgegaan met het ophalen van de aanwezigheden. Probeer het later opnieuw.')
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
            <Tabs.Container
                renderHeader={() => (<StudentDetailHeader student={student} />)}
                headerContainerStyle={{ backgroundColor: '#f8fafc', shadowOpacity: 0, elevation: 0 }}
                containerStyle={{ height: '100%' }}
                allowHeaderOverscroll={true}
                renderTabBar={TeacherTabBar}
            >
                <Tabs.Tab name="Altijd">
                    <StudentDetailsData lessons={lessonsAll} attendances={attendancesAll} />
                </Tabs.Tab>
                <Tabs.Tab name="30 dagen">
                    <StudentDetailsData lessons={lessons30Days} attendances={attendances30Days} />
                </Tabs.Tab>
            </Tabs.Container>
        </SafeAreaView>
    )
}

export default StudentDetails