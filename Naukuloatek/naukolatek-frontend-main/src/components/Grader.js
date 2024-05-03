import "./Grader.css";
import Slider from "./Slider";
import Button from "./Button";
import { useState } from "react";
import { addGrade, getTimeTable } from "../api"; 
import { getCurrentLesson } from "../common";

const Grader = () => {
    const [sliderIndex, setSliderIndex] = useState(3);
    const [gradeAdded, setGradeAdded] = useState(false); 

    const handleAddGrade = async () => {
        try {
            const timeTable = await getTimeTable()
            const teacherName = getCurrentLesson(timeTable).teacher
            await addGrade(sliderIndex + 1, teacherName);
            setGradeAdded(true); 
        } catch (error) {
            console.error("Error adding grade:", error);
        }
    };

    if (gradeAdded) {
        return <div className="grader"><h3>Dodano ocenę</h3></div>;
    }

    return (
        <div className="grader">
            <h3>Oceń pracę klasy</h3>
            <Slider sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} />
            <div className="grader__buttons">
                <Button text="Zatwierdź" color="#0D8982" action={handleAddGrade} />
                <Button text="X" isSmall={true} color="#C73C33" />
            </div>
        </div>
    );
};

export default Grader;