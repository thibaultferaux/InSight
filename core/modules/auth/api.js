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