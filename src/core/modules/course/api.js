import { supabase } from "../../api/supabase";

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