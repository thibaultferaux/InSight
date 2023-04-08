import { supabase } from "../../api/supabase";

export const getStudentsFromCourse = async (courseId) => {
    const { data, error } = await supabase
            .from('usercourse')
            .select('id, userId, courseId')
            .eq('courseId', courseId)

    if (error) throw error;

    return data;
}