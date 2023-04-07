import { supabase } from "../../api/supabase";

export const getAllClassrooms = async () => {
    const { data, error } = await supabase
        .from('classroomtag')
        .select()
        .order('name', { ascending: true })

    if (error) throw error;

    return data;
}

export const makeClassroom = async (name, id) => {
    const classroom = {
        id: id,
        name: name,
    }
    let { error, status } = await supabase.from('classroomtag').upsert(classroom);

    error.status = status;

    if (error) throw error;
}