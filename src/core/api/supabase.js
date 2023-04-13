import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_ANON, SUPABASE_SERVICE_ROLE } from "@env"
import 'react-native-url-polyfill/auto'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

export const createAccounts = async () => {
    const { data, error } = await supabase.auth.signUp({
        email: "admin@example.com",
        password: "password123",
        options: {
            data: {
                first_name: "Admin",
                last_name: "Admin",
                role_id: 3
            }
        }
    });
    if (error) {
        console.error(error);
    }
    const { data: data2, error: error2 } = await supabase.auth.signUp({
        email: "teacher@example.com",
        password: "password123",
        options: {
            data: {
                first_name: "Teacher",
                last_name: "Teacher",
                role_id: 2
            }
        }
    });
    if (error2) {
        console.error(error2);
    }
}