import { useState } from "react";
import './App.css'
import wordsList from "./assets/words.json";

function App() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");

  function handleBackgroundChanges() {
    const input = value.toLowerCase().trim();

    if(!input){
      return;
    }

    if (wordsList.good.includes(input)) {
      setStatus("good");
    } else if (wordsList.meh.includes(input)) {
      setStatus("meh");
    } else if (wordsList.bad.includes(input)) {
      setStatus("bad");
    } else {
      setStatus("not-found");
    }

    setTimeout(() => setStatus("idle"), 1000);
  }

  // map status to colors
  const backgroundColor = {
    idle: "",
    good: "var(--green)",
    meh: "var(--yellow)",
    bad: "var(--red)",
    "not-found": "var(--gray)"
  }[status];

  const borderColor = {
    idle: "",
    good: "var(--darker-green)",
    meh: "var(--darker-yellow)",
    bad: "var(--darker-red)",
    "not-found": "var(--darker-gray)"
  }[status];

  return (
    <>
      <section id="center"
      style={{
        backgroundColor,
        transition: "background-color 0.3s",
      }}>
        <div>
          <h1>O que pretendemos comer?</h1>
          <div className="space"></div>
          <input className="button" 
            style={{
              borderColor,
              transition: "border-color 0.3s",
            }}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBackgroundChanges}
          ></input>
        </div>
      </section>
    </>
  )
}

export default App
