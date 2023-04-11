export const filterStudents = (students, value) => {
    let filteredStudentsObject = {};
    if (students.present) {
        const filteredPresent = students.present.filter(student => (student.profiles.first_name + ' ' + student.profiles.last_name).toLowerCase().includes(value.toLowerCase()));

        if (filteredPresent.length > 0) {
            filteredStudentsObject.present = filteredPresent;
        }
    }
    if (students.absent) {
        const filteredAbsent = students.absent.filter(student => (student.profiles.first_name + ' ' + student.profiles.last_name).toLowerCase().includes(value.toLowerCase()));

        if (filteredAbsent.length > 0) {
            filteredStudentsObject.absent = filteredAbsent;
        }
    }
    return filteredStudentsObject;
}