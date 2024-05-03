const getCurrentLesson = (timeTable) => {
    const date = new Date()
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()
    const currentTime = date.getHours() * 60 + date.getMinutes()

    const lessons = timeTable[dayOfWeek]
    if (lessons) {
        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i]
            const lessonTime = lesson.time.split(":")
            const lessonStart = parseInt(lessonTime[0]) * 60 + parseInt(lessonTime[1])
            const lessonEnd = lessonStart + lesson.duration

            if (currentTime >= lessonStart && currentTime < lessonEnd) {
                const minutesLeft = lessonEnd - currentTime
                return {
                    lesson: lesson.name,
                    minutesLeft,
                    teacher: lesson.teacher
                }
            }
        }
    }

    const nextLesson = getNextLesson(dayOfWeek, timeTable)
    if (nextLesson) {
        const nextLessonTime = nextLesson.time.split(":")
        const nextLessonStart = parseInt(nextLessonTime[0]) * 60 + parseInt(nextLessonTime[1])
        const minutesLeft = nextLessonStart - currentTime
        return {
            lesson: "przerwa",
            minutesLeft,
            teacher: ""
        }
    }

    return {
        lesson: "brak lekcji",
        minutesLeft: 0,
        teacher: ""
    }
}

const getNextLesson = (dayOfWeek, timeTable) => {
    const days = Object.keys(timeTable)
    const currentDayIndex = days.indexOf(dayOfWeek)
    let nextLesson = null

    if (currentDayIndex !== -1) {
        const lessons = timeTable[dayOfWeek]
        for (let i = 0; i < lessons.length; i++) {
            const lessonTime = lessons[i].time.split(":")
            const lessonStart = parseInt(lessonTime[0]) * 60 + parseInt(lessonTime[1])
            const currentTime = new Date().getHours() * 60 + new Date().getMinutes()
            if (currentTime < lessonStart) {
                return lessons[i]
            }
        }
    }

    for (let i = currentDayIndex; i < days.length; i++) {
        const lessons = timeTable[days[i]]
        if (lessons && lessons.length > 0) {
            nextLesson = lessons[0]
            break
        }
    }

    return nextLesson
}

export { getCurrentLesson }