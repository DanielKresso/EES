import { useState, useEffect } from "react"
import "./Header.css"
import polishMonths from "../data/polishMonths.json"
import { getTimeTable } from "../api"
import { getCurrentLesson } from "../common"

const Header = () => {
    const [currentTime, setCurrentTime] = useState("00:00")
    const [currentDate, setCurrentDate] = useState("1 stycznia 2000")
    const [currentLesson, setCurrentLesson] = useState("Obecna lekcja: brak lekcji")
    const [minutesLeft, setMinutesLeft] = useState(0)
    const [timeTable, setTimeTable] = useState({})

    const updateTime = () => {
        const date = new Date()
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        setCurrentTime(`${hours}:${minutes}`)
    }

    const updateTimeTable = async () => {
        try {
            const data = await getTimeTable()
            setTimeTable(data)
        } catch (error) {
            console.error("Failed to fetch timetable:", error)
        }
    }

    const updateDate = () => {
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        setCurrentDate(`${day} ${translateMonth(month)} ${year}`)
    }

    const updateLesson = () => {
        const lesson = getCurrentLesson(timeTable)
        setCurrentLesson(`Obecna lekcja: ${lesson.lesson}`)
        if (lesson.minutesLeft > 0) {
            setMinutesLeft(`Zostało: ${lesson.minutesLeft} minut`)
        } else {
            setMinutesLeft("")
        }
    }

    const translateMonth = (month) => {
        return polishMonths[month.toString()]
    }

    const everyMinute = () => {
        updateTime()
        updateDate()
        updateLesson()
        updateTimeTable()
    }

    useEffect(() => {
        const date = new Date()
        const seconds = date.getSeconds()
        const milliseconds = date.getMilliseconds()
        const interval = (60 - seconds) * 1000 - milliseconds
        everyMinute()
        setTimeout(() => {
            everyMinute()
            const timer = setInterval(updateTime, 60000)
            return () => clearInterval(timer)
        }, interval)
    })

    return (
        <div className="header">
            <div className="header__datetime">
                <h1>{currentTime}</h1>
                <h3>{currentDate}</h3>
            </div>
            <div className="header__lesson">
                <h4>{currentLesson}</h4>
                <h5>{minutesLeft}</h5>
            </div>
        </div>
    )
}

export default Header