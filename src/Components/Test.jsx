import "../StyleSheets/Test.css";

import { WordList, planeWordList } from "../WordList/planewordlist";
import react, { useEffect, useRef, useState } from "react";

import Refresh from "../Assets/refresh.png";

const Test = () => {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currWordStatus, setCurrWordStatus] = useState(false);
  const [wordListArray, setWordListArray] = useState(planeWordList.split(" "));
  const [timeElapsed, setTimElapsed] = useState(0);
  const [isBlock, setIsBlock] = useState(false);
  const intervalRef = useRef(null);
  // new logic
  const [wordnew, setWordnew] = useState(() => {
    const wordArray = [];
    WordList.map((value, idx) => {
      const initialState = {};
      initialState["word"] = value;
      initialState["backspace"] = 0;
      initialState["typed"] = "";
      initialState["keyStrokes"] = 0;
      wordArray.push(initialState);
    });
    return wordArray;
  });

  function startTimer(event) {
    event.preventDefault();
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000);
    }
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimElapsed(0);
  }

  const [wordListStat, setWordListStat] = useState(() => {
    const initialWordListStat = {};
    wordListArray.forEach((value, idx) => {
      initialWordListStat[idx] = { test: false };
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

  const handleUpdateNew = (value) => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = { ...words[currWordIndex], typed: value };
      return words;
    });
  };

  const handleBackspace = (value) => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = {
        ...words[currWordIndex],
        backspace: words[currWordIndex].backspace + 1,
      };
      return words;
    });
  };

  const handleKeyStrokes = () => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = {
        ...words[currWordIndex],
        keyStrokes: words[currWordIndex].keyStrokes + 1,
      };
      return words;
    });
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
      handleUpdateNew(event.target.value);
      setCurrWordStatus(false);
      event.target.value = "";
      setCurrWordIndex(currWordIndex + 1);
      event.preventDefault();
    }
    if (event.key === "Backspace") {
      handleBackspace();
    }
    if (event.key !== "Backspace" && event.key !== " ") {
      handleKeyStrokes();
    }
  };

  function getAccuracy() {
    let correctWords = wordnew.filter((elm, idx) => elm.word == elm.typed);
    let wrongWords = wordnew.filter(
      (elm, idx) => elm.word !== elm.typed && elm.typed
    );

    let backSpacesum = correctWords.reduce((acc, elm, idx) => {
      return acc + elm.backspace;
    }, 0);
    backSpacesum += wrongWords.reduce((acc, elm, idx) => {
      return acc + elm.backspace + elm.keyStrokes;
    }, 0);
    let keyStrokeCount = correctWords.reduce((acc, elm, idx) => {
      return acc + elm.keyStrokes;
    }, 0);

    console.log(keyStrokeCount, backSpacesum);
    const accuracy = Math.max(
      (keyStrokeCount / (keyStrokeCount + backSpacesum)) * 100,
      0
    );
    // console.log(accuracy);
  }

  function getWPM() {
    let count = wordnew.filter((elm, idx) => !!elm.typed).length;
    const wpm = (count / (timeElapsed || 1)) * 60;
    // console.log("WPM : ", wpm);
    return wpm;
  }

  useEffect(() => {
    if (timeElapsed == 60) {
      getAccuracy();
      stopTimer();
    }
  }, [timeElapsed]);

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  const handleConrrection = (e) => {
    let currWord = e.target.value;
    let currIndex = currWord.length;

    // if (wordListArray[currWordIndex]?.slice(0, currIndex) !== currWord) {
    //   setCurrWordStatus(true);
    // } else {
    //   setCurrWordStatus(false);
    // }
    getWPM();
    if (wordnew[currWordIndex].word?.slice(0, currIndex) !== currWord) {
      setCurrWordStatus(true);
    } else {
      setCurrWordStatus(false);
    }
  };

  // return (
  //   <>
  //     <div className="text-displaycomponent-container">
  //       <div className="text-displaycomponent-content">
  //         {wordnew.map((elm, idx) => (
  //           <p
  //             key={idx}
  //             // style={{
  //             //   color:
  //             //     currWordStatus && idx == currWordIndex
  //             //       ? "red"
  //             //       : wordListStat[idx].color,
  //             // }}
  //             className={`default ${elm.typed == elm.word && "green"} ${
  //               elm.typed !== elm.word && !!elm.typed && "red"
  //             } ${currWordIndex == idx && currWordStatus && "red-cur"}`}
  //           >
  //             {elm.word}
  //           </p>
  //         ))}
  //       </div>
  //     </div>
  //     <h1>{timeElapsed}</h1>
  //     <div className="test-input-container">
  //       <input
  //         ref={inputRef}
  //         type="text"
  //         defaultValue=""
  //         onChange={handleConrrection}
  //         onKeyDown={handlekeyUp}
  //         onInput={startTimer}
  //         disabled={isBlock}
  //       />
  //     </div>
  //   </>
  // );
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div className="home-Page-content">
      <div className="typing-test-container">
        <div className="typing-word-display-container">
          {wordnew.map((elm, idx) => (
            <p
              key={idx}
              style={{
                color:
                  currWordStatus && idx == currWordIndex
                    ? "red"
                    : wordListStat[idx].color,
              }}
              className={`default ${elm.typed == elm.word && "green"} ${
                elm.typed !== elm.word && !!elm.typed && "red"
              } ${currWordIndex == idx && currWordStatus && "red-cur"}`}
            >
              {elm.word}
            </p>
          ))}
        </div>
        <div className="typing-pallete-container">
          <div className="typing-input-container flex-center">
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
          <div className="wpm-result-container flex-center">
            {Math.ceil(getWPM())} wpm
          </div>
          <div className="typing-test-timer-container flex-center">
            {formatTime(timeElapsed)}
          </div>
          <div className="typing-test-reset-btn flex-center">
            <img src={Refresh} alt="refrsh" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
