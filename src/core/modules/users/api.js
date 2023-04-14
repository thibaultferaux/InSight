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
    
    // make course array first level in the object
    data.forEach((student) => {
        student.course = student.usercourse.map((usercourse) => {
            return {...usercourse.course, id: usercourse.courseId}
        })
        delete student.usercourse
    })

    return data
}

export const getAllTeachers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, course(id, name)')
        .eq('role_id', 2)
        .order('last_name', { ascending: true })

    if (error) throw error

    return data
}