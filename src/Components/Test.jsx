import "../StyleSheets/Test.css";

import react, { useEffect, useRef, useState } from "react";

import { planeWordList } from "../WordList/planewordlist";

const Test = () => {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currWordStatus, setCurrWordStatus] = useState(false);
  const [wordListArray, setWordListArray] = useState(planeWordList.split(" "));
  const [timeElapsed, setTimElapsed] = useState(0);
  const [isBlock, setIsBlock] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timeElapsed == 10) {
      setIsBlock(true);
      const result = [Object.values(wordListStat)].filter((elm) => {
        return elm.color == "green";
      });
      console.log(result);
    }
  }, [timeElapsed]);

  function startTimer(event) {
    event.preventDefault();
    if (!intervalRef.current) {
      console.log("function called", timeElapsed);
      intervalRef.current = setInterval(() => {
        setTimElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000);
    }
  }

  const [wordListStat, setWordListStat] = useState(() => {
    const initialWordListStat = {};
    wordListArray.forEach((value, idx) => {
      initialWordListStat[idx] = { test: false, color: "black" };
    });
    return initialWordListStat;
  });

  const handleUpdate = (word) => {
    // Update the "test" property of the object for the specified word to true
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        test: true,
      },
    }));

    // Update the "color" property of the object for the specified word to "blue"
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        color: "#D34E4E",
      },
    }));
  };

  const handleCorrectWord = (word) => {
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        color: "green",
      },
    }));
  };

  const inputRef = useRef(null);

  const handlekeyUp = (event) => {
    if (event.key == " ") {
      if (event.target.value !== wordListArray[currWordIndex]) {
        handleUpdate(currWordIndex);
      }
      if (event.target.value == wordListArray[currWordIndex]) {
        handleCorrectWord(currWordIndex);
      }
      event.target.value = "";
      setCurrWordIndex(currWordIndex + 1);
      event.preventDefault();
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleConrrection = (e) => {
    // console.log(e.target.value);
    let currWord = e.target.value;
    let currIndex = currWord.length;

    if (wordListArray[currWordIndex]?.slice(0, currIndex) !== currWord) {
      setCurrWordStatus(true);
    } else {
      setCurrWordStatus(false);
    }
  };

  return (
    <>
      <div className="text-displaycomponent-container">
        <div className="text-displaycomponent-content">
          {wordListArray.map((elm, idx) => (
            <p
              key={idx}
              style={{
                color:
                  currWordStatus && idx == currWordIndex
                    ? "red"
                    : wordListStat[idx].color,
              }}
            >
              {elm}
            </p>
          ))}
        </div>
      </div>
      <h1>{timeElapsed}</h1>
      <div className="test-input-container">
        <input
          ref={inputRef}
          type="text"
          defaultValue=""
          onChange={handleConrrection}
          onKeyDown={handlekeyUp}
          onInput={startTimer}
          disabled={isBlock}
        />
      </div>
    </>
  );
};

export default Test;
