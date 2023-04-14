import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { getCurrentSession } from "../modules/auth/api";


const useSupabaseAuth = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getCurrentSession();
            setAuth(session);
            setIsInitialized(true);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            switch (event) {
                case 'SIGNED_IN':
                case 'USER_UPDATED':
                case 'TOKEN_REFRESHED':
                    setAuth(session);
                    break;

                case 'SIGNED_OUT':
                case 'USER_DELETED':
                    setAuth(null);
                    break;
            }
        });  
    }, []);

    const user = useMemo(
        () => (auth ? { ...auth.user, ...auth.user.user_metadata } : null),
        [auth]
    );

    const isLoggedIn = isInitialized && !!auth;

    return { isInitialized, isLoggedIn, auth, user };
}

export default useSupabaseAuth