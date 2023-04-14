import { supabase } from "../../api/supabase";

export const getAllOtherCourses = async (courseIds) => {
    const { data, error } = await supabase
        .from('course')
        .select()
        .not('id', 'in', `(${courseIds.join(',')})`)

    if (error) throw error;

    return data;
}

export const getStudentsFromCourse = async (courseId) => {
    const { data, error } = await supabase
            .from('usercourse')
            .select('id, userId, courseId')
            .eq('courseId', courseId)

    if (error) throw error;

    return data;
}

export const getCoursesFromTeacher = async (teacherId) => {
    const { data, error, status } = await supabase
        .from('course')
        .select()
        .eq('teacherId', teacherId)

    if (error) throw error;

    return data;
}

export const removeUserFromCourse = async (userId, courseId) => {
    const { data, error } = await supabase
        .from('usercourse')
        .delete()
        .eq('userId', userId)
        .eq('courseId', courseId)

    if (error) throw error;

    return data;
}

export const deleteCourse = async (courseId) => {
    const { data, error } = await supabase
        .from('course')
        .delete()
        .eq('id', courseId)

    if (error) throw error;

    return data;
}

export const addCoursesToStudent = async (userId, courseIds) => {
    const { data, error } = await supabase
        .from('usercourse')
        .insert(courseIds.map(courseId => ({ userId, courseId })))

    if (error) throw error;

    return data;
}

export const makeCourseWithTeacher = async (courseName, teacherId) => {
    const { data, error } = await supabase
        .from('course')
        .insert({ name: courseName, teacherId })

    if (error) throw error;

    return data;
}