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

    if (error) {
        error.status = status;
        throw error;
    };
}

export const updateClassroom = async (name, id) => {
    let { error, status } = await supabase
        .from('classroomtag')
        .update({ name: name })
        .eq('id', id)

    if (error) {
        error.status = status;
        throw error;
    };
}