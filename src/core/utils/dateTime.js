// check if date is equal to today
export const isToday = (date) => {
    const today = new Date()
    const someDate = new Date(date)
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}

export const formatDate = (date) => {
    const someDate = new Date(date)
    // weekday as short form in dutch
    const weekday = someDate.getDay();
    const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
    const weekdayName = weekdays[weekday];
    // day with leading zero
    const day = String(someDate.getDate()).padStart(2, '0');
    // month with leading zero
    const month = String(someDate.getMonth() + 1).padStart(2, '0');

    return `${weekdayName} ${day}/${month}`
}

export const formatTime = (time) => {
    const someTime = new Date(time)
    // hours with leading zero
    const hours = String(someTime.getHours()).padStart(2, '0');
    // minutes with leading zero
    const minutes = String(someTime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`
}