import React, { createContext, useContext } from 'react'
import useSupabaseAuth from '../../core/api/useSupabaseAuth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const { isInitialized, isLoggedIn, user, auth } = useSupabaseAuth();

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, auth }}>
            {isInitialized ? children : null}
        </AuthContext.Provider>
    )
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider