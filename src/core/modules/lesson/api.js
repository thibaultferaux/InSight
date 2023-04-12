import { supabase } from "../../api/supabase";
import { addStudentsToAttendance } from "../attendance/api";

export const getLessonsForTeacher = async ({teacherId, setFutureLessons, setPastLessons, setCurrentLesson}) => {
    let { data, error } = await supabase
        .from('lesson')
        .select('id, startTime, endTime, course!inner(id, name), classroomtag(id, name)')
        .eq('course.teacherId', teacherId)
        .order('startTime', { ascending: true })

        
        if (error) throw error

        if (data) {
            // split lessons into current, previous and future
            // split lessons into current, previous and future
            const filteredLessons = data.reduce((r, a) => {
                const now = new Date()
                const startTime = new Date(a.startTime)
                const endTime = new Date(a.endTime)
                if (startTime < now && endTime > now) {
                    setCurrentLesson(a);
                } else if (startTime < now && endTime < now) {
                    r.previous.push(a);
                } else {
                    r.future.push(a);
                }
                return r;
            }, { previous: [], future: [] });

            // group futurelessons by day
            const groupedLessonsFuture = filteredLessons.future.reduce((r, a) => {
                r[a.startTime.split('T')[0]] = [...r[a.startTime.split('T')[0]] || [], a];
                return r;
            }, {});

            // convert object to array
            const groupedLessonsFutureArray = Object.entries(groupedLessonsFuture).map(([date, items]) => ({ date, items }));

            setFutureLessons(groupedLessonsFutureArray)

            // group previouslessons by day
            const groupedLessonsPrevious = filteredLessons.previous.reduce((r, a) => {
                r[a.startTime.split('T')[0]] = [...r[a.startTime.split('T')[0]] || [], a];
                return r;
            }, {});

            // reverse order of previous lessons and convert object to array
            const groupedLessonsPreviousArray = Object.entries(groupedLessonsPrevious).map(([date, items]) => ({ date, items })).reverse();

            setPastLessons(groupedLessonsPreviousArray)
        }
}

export const getLessonsForStudent = async (studentId, setLessons, setCurrentLesson) => {
    let { data, error } = await supabase.rpc('getLessons', { profileId: studentId });

    if (error) throw error

    if (data) {
        const filteredLessons = data.filter(lesson => {
            const now = new Date()
            const startTime = new Date(lesson.startTime)
            const endTime = new Date(lesson.endTime)
            if (startTime < now && endTime > now) {
                setCurrentLesson(lesson);
                return false
            } else {
                return true
            }
        });

        // group by day
        const groupedLessons = filteredLessons.reduce((r, a) => {
            r[a.startTime.split('T')[0]] = [...r[a.startTime.split('T')[0]] || [], a];
            return r;
        }, {});

        // convert object to array
        const groupedLessonsArray = Object.entries(groupedLessons).map(([date, items]) => ({ date, items }));

        setLessons(groupedLessonsArray)
    }
}

export const makeLessonActive = async (lessonId) => {
    const { error } = await supabase
        .from('lesson')
        .update({ active: true })
        .eq('id', lessonId)

    if (error) throw error;
}

export const makeLesson = async (courseId, classroomtagId, startTime, endTime) => {
    const { data, error } = await supabase
        .from('lesson')
        .upsert(
            {
                courseId,
                classroomtagId,
                startTime,
                endTime,
            }
        )
        .select()

    if (error) throw error;

    if(data) {
        await addStudentsToAttendance(courseId, data[0].id)
    }
}

export const updateLesson = async (lessonId, courseId, classroomtagId, startTime, endTime) => {
    const { error } = await supabase
        .from('lesson')
        .update(
            {
                courseId,
                classroomtagId,
                startTime,
                endTime,
            }
        )
        .eq('id', lessonId)

    if (error) throw error;
}