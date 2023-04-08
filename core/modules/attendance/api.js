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