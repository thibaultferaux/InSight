import { supabase } from "../../api/supabase"

export const getStudentsForTeacher = async (teacherId) => {
    const { data, error } = await supabase.rpc('getStudentsFromTeacher', { teacherIdParam: teacherId });

    if (error) throw error

    return data
}

export const getAllStudents = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role_id', 1)
        .order('last_name', { ascending: true })

    if (error) throw error

    return data
}

export const getStudentById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, usercourse!left(courseId, course!inner(name))')
        .eq('id', id)
        .single()

    if (error) throw error

    data.course = data.usercourse.map((usercourse) => {
        return {...usercourse.course, id: usercourse.courseId}
    })
    delete data.usercourse

    return data
}

export const getAllTeachers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role_id', 2)
        .order('last_name', { ascending: true })

    if (error) throw error

    return data
}

export const getTeacherById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, course(id, name)')
        .eq('id', id)
        .single()

    if (error) throw error

    return data
}