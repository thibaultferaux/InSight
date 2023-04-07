import { Alert } from "react-native";
import { supabase } from "../../api/supabase"

export const getCurrentSession = async () => {
    const { 
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        throw error;
    }

    return session;
}

export const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        throw error;
    }
    return Promise.resolve(data);
}

export const register = async (credentials) => {
    console.log(credentials)
    const { email, password, ...extra } = credentials;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                ...extra
            }
        }
    });
    if (error) {
        return Promise.reject(error);
    }
    return Promise.resolve(data);
}

export const logout = () => {
    return supabase.auth.signOut();
}