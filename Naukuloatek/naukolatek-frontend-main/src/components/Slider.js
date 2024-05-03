import "./Slider.css"
import { useEffect, useState } from "react"

const Slider = ({ sliderIndex, setSliderIndex }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [pointerX, setPointerX] = useState(0)
    const [sliderValues, setSliderValues] = useState({})

    useEffect(() => {
        setSliderValues({
            0: 0,
            1: 50,
            2: 101,
            3: 152,
            4: 203,
            5: 254
        })
    }, [setSliderValues])

    const calculateSliderPosition = (index, pointerX) => {
        if (isDragging)
            if (!(pointerX > document.querySelector(".slider__element").getBoundingClientRect().left))
                return pointerX
        return sliderValues[index]
    }

    const onDragStart = (e) => {
        e.preventDefault()
        if (e.target.className !== "slider__legend" && e.target.className !== "slider__legend__text") {
            setIsDragging(true)
            setPointerX(e.clientX)
        }
    }

    const onDrag = (e) => {
        e.preventDefault()
        if (isDragging) {
            const pointZero = document.querySelector(".slider__element").getBoundingClientRect().left
            const diff = e.clientX - pointZero - 8
            if (diff < 0 || diff > 270)
                return
            setSliderIndex(() => {
                let closestIndex = null
                let closestDistance = Infinity

                Object.entries(sliderValues).forEach(([index, value]) => {
                    const distance = Math.abs(pointerX - value)
                    if (distance < closestDistance) {
                        closestIndex = index
                        closestDistance = distance
                    }
                })
                return closestIndex
            })
            setPointerX(diff)
        }
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onLegendClick = (e) => {
        e.preventDefault()
        if (e.target.className === "slider__legend__text") {
            setSliderIndex(parseInt(e.target.innerText) - 1)
            setIsDragging(false)
        }
    }

    return (
        <div className="slider" onMouseDown={onDragStart} onMouseMove={onDrag} onMouseUp={() => setIsDragging(false)}>
            <div className="slider__element">
                <div className="slider__background">
                    <div className="slider__background__line" style={{ width: (calculateSliderPosition(sliderIndex, pointerX) + 10 + "px") }} />
                    <div className={isDragging ? "draggedSlider slider__background__image" : "slider__background__image"} style={{ left: (calculateSliderPosition(sliderIndex, pointerX) + "px") }} draggable="true" onDragEnd={onDragEnd} onDragStart={onDragStart} onDrag={onDrag}></div>
                </div>
                <div className="slider__legend" onClick={onLegendClick}>
                    <h2 className="slider__legend__text">1</h2>
                    <h2 className="slider__legend__text">2</h2>
                    <h2 className="slider__legend__text">3</h2>
                    <h2 className="slider__legend__text">4</h2>
                    <h2 className="slider__legend__text">5</h2>
                    <h2 className="slider__legend__text">6</h2>
                </div>
            </div>
        </div>
    )
}

export default Slider