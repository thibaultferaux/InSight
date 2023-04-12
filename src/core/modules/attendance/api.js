import { supabase } from "../../api/supabase";
import { getStudentsFromCourse } from "../course/api";

export const addStudentsToAttendance = async (courseId, lessonId) => {
    const data = await getStudentsFromCourse(courseId)

    // add students to attendance table
    const attendanceData = data.map((student) => ({
        userId: student.userId,
        lessonId: lessonId,
    }))

    const { error } = await supabase.from('presentstudent').insert(attendanceData)

    if (error) throw error
}

export const makeStudentPresent = async (lessonId, userId) => {
    const { error } = await supabase
        .from('presentstudent')
        .update({ present: true, presentAt: new Date() })
        .eq('lessonId', lessonId)
        .eq('userId', userId);

    if (error) throw error
}

export const getAttendencesForLesson = async (lessonId) => {
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

        return grouped;
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

export const getAttendancesOfStudentForTeacher = async (userId, teacherId, filter30Days = false) => {
    let attendanceAll = {present: 0, total: 0}

    let query = supabase
        .from('presentstudent')
        .select('lessonId, present, presentAt, lesson!inner(courseId, endTime, course!inner(name, teacherId))')
        .eq('userId', userId)
        .eq('lesson.course.teacherId', teacherId)
        .lt('lesson.endTime', new Date().toISOString())


    if (filter30Days) {
        query = query.gt('lesson.endTime', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString())
    }

    const { data, error } = await query

    if (error) throw error;

    if (data) {

        // group by courseId without keys and count present and total attendances
        const grouped = data.reduce((acc, obj) => {
            const key = obj.lesson.courseId;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});

        const lessons = Object.keys(grouped).map((key) => {
            const lesson = grouped[key][0].lesson;
            const present = grouped[key].filter((item) => item.present).length;
            const total = grouped[key].length;

            attendanceAll.present += present;
            attendanceAll.total += total;

            return {
                ...lesson,
                present: present,
                total: total,
            }
        }
        )

        return {lessons, attendanceAll}
    }

}