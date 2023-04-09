import { supabase } from "../../api/supabase";
import { getStudentsFromCourse } from "../course/api";
import { makeLessonActive } from "../lesson/api";

export const addStudentsToAttendance = async (courseId, lessonId) => {
    const data = await getStudentsFromCourse(courseId)

    // add students to attendance table
    const attendanceData = data.map((student) => ({
        userId: student.userId,
        lessonId: lessonId,
    }))

    const { error } = await supabase.from('presentstudent').insert(attendanceData)

    if (error) throw error

    await makeLessonActive(lessonId);
}

export const makeStudentPresent = async (lessonId, userId) => {
    const { error } = await supabase
        .from('presentstudent')
        .update({ present: true, presentAt: new Date() })
        .eq('lessonId', lessonId)
        .eq('userId', userId);

    if (error) throw error
}

export const getAttendencesForLesson = async (lessonId, setStudents) => {
    const { data, error } = await supabase
        .from('presentstudent')
        .select('userId, present, presentAt, profiles(first_name, last_name)')
        .eq('lessonId', lessonId)
        .order('presentAt', { ascending: true })

    if (error) throw error;

    if (data) {
        // group by present true or false
        const grouped = data.reduce((acc, obj) => {
            const key = obj.present ? 'present' : 'absent';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});

        setStudents(grouped);
    }
}

export const setPresent = async (userId, lessonId) => {
    const { error } = await supabase
        .from('presentstudent')
        .update({ present: true, presentAt: new Date() })
        .eq('userId', userId)
        .eq('lessonId', lessonId)

    if (error) throw error;
}

export const setAbsent = async (userId, lessonId) => {
    const { error } = await supabase
        .from('presentstudent')
        .update({ present: false, presentAt: new Date() })
        .eq('userId', userId)
        .eq('lessonId', lessonId)

    if (error) throw error;
}