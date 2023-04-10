import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Modal, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ArrowRightOnRectangleIcon, ArrowUpRightIcon, PencilIcon, PlusIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDate, formatDateLong, formatTime, isToday } from '../../../core/utils/dateTime';
import NfcProxy from '../../../core/proxy/NfcProxy';
import { addStudentsToAttendance } from '../../../core/modules/attendance/api';
import { supabase } from '../../../core/api/supabase';
import { useAuthContext } from '../../Components/Auth/AuthProvider';
import LogoutAlert from '../../Components/Auth/LogoutAlert';
import { getLessonsForTeacher } from '../../../core/modules/lesson/api';
import { NfcNotEnabledAlert } from '../../../core/utils/nfc';
import CurrentLessons from './CurrentLessons';
import { SceneMap, TabView } from 'react-native-tab-view';
import PreviousLessons from './PreviousLessons';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import TeacherHeader from '../../Components/Teacher/TeacherHeader';
import TeacherTabBar from '../../Components/Teacher/TeacherTabBar';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);
  
const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const TeacherDashboard = () => {
    const { user } = useAuthContext();
    const [refreshing, setRefreshing] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'current', title: 'Huidige lessen' },
        { key: 'past', title: 'Voorbije lessen' },
    ]);


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
            setRefreshing(true);
            setCurrentLesson(null);

            await getLessonsForTeacher(user.id, setLessons, setCurrentLesson);

        } catch (error) {
            console.error(error)
            Alert.alert("Er is iets misgegaan met het ophalen van de lessen. Probeer het later opnieuw.")
        } finally {
            setRefreshing(false)
        }
    }

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'current':
                return <CurrentLessons lessons={lessons} />;
            case 'past':
                return <PreviousLessons lessons={lessons} />;
            default:
                return null;
        }
    };

    const TabBarComponent = useCallback(
        (props) => <Tabs.MaterialTabBar />,
        []
    )

    return (
        <SafeAreaView className="flex-1 justify-start bg-slate-50">
            {/* <ScrollView
            className="flex-1"
                refreshControl={
                    <RefreshControl onRefresh={getLessons} refreshing={refreshing} />
                }
            > */}

            
                    
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
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}

export default TeacherDashboard