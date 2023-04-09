// check if date is equal to today
export const isToday = (date) => {
    const today = new Date()
    const someDate = new Date(date)
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}

export const formatDateLong = (date) => {
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

export const formatDateFull = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const formatDateShort = (date) => {
    const someDate = new Date(date)
    // day with leading zero
    const day = String(someDate.getDate()).padStart(2, '0');
    // month with leading zero
    const month = String(someDate.getMonth() + 1).padStart(2, '0');

    return `${day}/${month}`
}


export const formatTime = (time) => {
    const someTime = new Date(time)
    // hours with leading zero
    const hours = String(someTime.getHours()).padStart(2, '0');
    // minutes with leading zero
    const minutes = String(someTime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`
}

export const combineDateAndTime = (date, time) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return new Date(year, month, day, hours, minutes, seconds);
}