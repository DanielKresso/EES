import Button from "./Button"
import "./MainScreenFooter.css"

const MainScreenFooter = () => {
    const handleClick = () => {
        window.open('https://technikum.infotech.edu.pl', '_blank');
      };
      
    return (
        <div className="mainScreenFooter">
            <Button text="Infotech" color="#5B2784" isSmall={true} action={handleClick} />
        </div>
    )
}

export default MainScreenFooter