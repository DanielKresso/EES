import "./Button.css"

const Button = ({ text, action, color, isSmall }) => {
    const handleClick = (e) => {
        e.preventDefault()
        if (typeof action === "function")
            action()
    }

    return (
        <div className={isSmall ? "button buttonSmall" : "button"} onClick={handleClick} style={{ background: color }} >
            {text}
        </div >
    )
}

export default Button