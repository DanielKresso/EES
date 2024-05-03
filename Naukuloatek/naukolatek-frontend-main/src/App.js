import { useState } from "react"
import "./App.css"
import Header from "./components/Header"
import Grader from "./components/Grader"
import MainScreenFooter from "./components/MainScreenFooter"

const App = () => {
  const [temperature, setTemperature] = useState(0)

  return (
    <div className="App">
      <Header />
      <Grader />
      <MainScreenFooter />
    </div>
  )
}

export default App