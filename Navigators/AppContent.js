import React from 'react'
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