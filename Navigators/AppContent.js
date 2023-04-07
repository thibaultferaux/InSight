import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { supabase } from '../core/api/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AdminDashboard from '../screens/admin/AdminDashboard'
import MakeClassroom from '../screens/admin/MakeClassroom'
import ScanClassroom from '../screens/admin/ScanClassroom'
import ScanSuccess from '../screens/admin/ScanSuccess'
import TeacherDashboard from '../screens/teacher/TeacherDashboard'
import MakeLesson from '../screens/teacher/MakeLesson'
import ScanActive from '../screens/teacher/ScanActive'
import ViewAttendances from '../screens/teacher/ViewAttendances'
import StudentDashboard from '../screens/student/StudentDashboard'
import ScanAttendance from '../screens/student/ScanAttendance'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import { getCurrentSession } from '../core/modules/auth/api'
import { useAuthContext } from '../Components/Auth/AuthProvider'
import AuthNavigator from './AuthNavigator'
import StudentNavigator from './StudentNavigator'
import TeacherNavigator from './TeacherNavigator'
import AdminNavigator from './AdminNavigator'

const AppContent = () => {
    const { isLoggedIn, user } = useAuthContext();

    if (!isLoggedIn) {
        return <AuthNavigator />
    } else if (user.role_id === 3) {
        return <AdminNavigator />
    } else if (user.role_id === 2) {
        return <TeacherNavigator />
    } else {
        return <StudentNavigator />
    }
}

export default AppContent