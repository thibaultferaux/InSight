import { supabase } from "../../api/supabase"

export const getStudentsForTeacher = async (teacherId) => {
    const { data, error } = await supabase.rpc('getStudentsFromTeacher', { teacherIdParam: teacherId });

    if (error) throw error

    return data
}

export const getAllStudents = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, usercourse!left(courseId, course!inner(name))')
        .eq('role_id', 1)
        .order('last_name', { ascending: true })

    if (error) throw error

    return data
}

export const getAllTeachers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, course!inner(id, name)')
        .eq('role_id', 2)
        .order('last_name', { ascending: true })

    if (error) throw error

    return data
}