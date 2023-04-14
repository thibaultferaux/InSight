import { Alert } from "react-native";
import { supabase, supabaseAdmin } from "../../api/supabase"

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
    const { email, password, ...extra } = credentials;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                ...extra,
                role_id: extra.role_id || 1
            }
        }
    });
    if (error) {
        return Promise.reject(error);
    }
    return Promise.resolve(data);
}

export const createUser = async (credentials) => {
    const { email, password, ...extra } = credentials;
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
            ...extra,
            role_id: extra.role_id || 1
        }
    });
    if (error) {
        return Promise.reject(error);
    }
    return Promise.resolve(data);
}

export const updateUser = async (userId, credentials) => {
    const { email, password, ...extra } = credentials;
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email: email,
        password: password,
        user_metadata: {
            ...extra,
            role_id: extra.role_id || 1
        }
    });
    if (error) {
        return Promise.reject(error);
    }
    return Promise.resolve(data);
}

export const deleteUser = async (userId) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
        return Promise.reject(error);
    }
    return Promise.resolve();
}

export const logout = () => {
    return supabase.auth.signOut();
}