import { supabase } from "../../api/supabase";

export const getLessonsForTeacher = async (teacherId, setLessons, setCurrentLesson) => {
    let { data, error } = await supabase
        .from('lesson')
        .select('id, startTime, endTime, active, course!inner(id, name), classroomtag(id, name)')
        .eq('course.teacherId', teacherId)
        .order('startTime', { ascending: true })
        .gte('endTime', new Date().toISOString())

        
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
            
            setLessons(groupedLessonsArray);
        }
}