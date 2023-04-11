import { supabase } from "../../api/supabase"

export const getStudentsForTeacher = async (teacherId) => {
    const { data, error } = await supabase.rpc('getStudentsFromTeacher', { teacherIdParam: teacherId });

    if (error) throw error

    return data
}