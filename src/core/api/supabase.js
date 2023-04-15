import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_ANON, SUPABASE_SERVICE_ROLE } from "@env"
import 'react-native-url-polyfill/auto'
import { createUser } from "../modules/auth/api"

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

/* export const createAccounts = async () => {
    try {
        await createUser({
            email: "admin@example.com",
            password: "InSight_Admin123",
            first_name: "Martin",
            last_name: "Delmote",
            role_id: 3
        })
        await createUser({
            email: "teacher@example.com",
            password: "InSight_Teacher123",
            first_name: "Jannick",
            last_name: "Louage",
            role_id: 2
        })
    } catch (error) {
        console.error(error)
    }
} */