import "../StyleSheets/Test.css";

import { WordList, planeWordList } from "../WordList/planewordlist";
import react, { useEffect, useRef, useState } from "react";

import PlayersInfoContainer from "./PlayersInfoContainer";
import Refresh from "../Assets/refresh.png";
import { socket } from "../customHooks/useSetupHook.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Test = () => {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currWordStatus, setCurrWordStatus] = useState(false);
  const [wordListArray, setWordListArray] = useState(planeWordList.split(" "));
  const [startbutton, setStartButton] = useState(false);
  const [timeElapsed, setTimElapsed] = useState(0);
  const [isBlock, setIsBlock] = useState(false);
  const intervalRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  // resulting states
  const [correctWords, setCorrectWords] = useState(0);
  const [inCorrectWords, setIncorrectWords] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
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

  const { id } = useParams();
  const players = useSelector((state) => state.rootReducer.playersInfo.players);

  function convertToSocketId(str) {
    const result = str.replace(new RegExp("room", "g"), ""); // remove all occurrences of the target string
    return result;
  }

  socket.on("start", (data) => {
    console.log(data);
  });

  function startTimer(event) {
    const isOwner = convertToSocketId(id) == socket.id;
    const isStart = players.length == 1 || startbutton;
    if (isOwner && isStart) {
      event?.preventDefault();
      if (!intervalRef.current) {
        socket.emit("startgame", { start: true, id: id });
        intervalRef.current = setInterval(() => {
          setTimElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
        }, 1000);
      }
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

  function startRefresh() {
    setRefresh(true);
    window.location.reload();
  }

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

    const accuracy = Math.max(
      (keyStrokeCount / (keyStrokeCount + backSpacesum)) * 100,
      0
    );
    return {
      accuracy: accuracy,
      correctWords: correctWords.length,
      wrong: wrongWords.length,
    };
  }

  function getWPM() {
    let count = wordnew.filter((elm, idx) => !!elm.typed).length;
    const wpm = (count / (timeElapsed || 1)) * 60;
    return wpm;
  }
  function setResultStates(accuracy, correctWords, incorrectWords) {
    setAccuracy(accuracy);
    setCorrectWords(correctWords);
    setIncorrectWords(incorrectWords);
    setWpm(getWPM());
  }

  useEffect(() => {
    if (timeElapsed == 60) {
      const { accuracy, correctWords, wrong } = getAccuracy();
      setResultStates(accuracy, correctWords, wrong);
      stopTimer();
      setIsBlock(true);
    }
  }, [timeElapsed]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleConrrection = (e) => {
    let currWord = e.target.value;
    let currIndex = currWord.length;
    getWPM();
    if (wordnew[currWordIndex].word?.slice(0, currIndex) !== currWord) {
      setCurrWordStatus(true);
    } else {
      setCurrWordStatus(false);
    }
  };

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
          <div
            className="typing-test-reset-btn flex-center"
            onClick={() => startRefresh()}
          >
            <img src={Refresh} alt="refrsh" id={refresh ? `rotate` : ``} />
          </div>
          {convertToSocketId(id) == socket.id && (
            <div className="wpm-result-container">
              <p
                id="gredient-color"
                className="wpm-result-container flex-center"
                onClick={() => {
                  setStartButton(true);
                  startTimer();
                }}
              >
                start
              </p>
            </div>
          )}
        </div>
        {/* for singal player css */}
        {/* typing-test-result-container-singal-player */}
        <div className="typing-test-result-container">
          <div className="typing-test-inner-left-container">
            <PlayersInfoContainer />
          </div>
          <dis className="typing-test-result-content">
            <div className="final-wpm-result">
              {wpm} <span>wpm</span>
            </div>
            <p id="result-alter-color">
              Accuracy <span>{Math.ceil(accuracy)}%</span>
            </p>
            <p>
              Correct Characters <span class="green"> {correctWords}</span>{" "}
            </p>
            <p id="result-alter-color">
              Incorrect Characters <span class="red">{inCorrectWords}</span>
            </p>
            <p>
              Time <span> 0.60</span>{" "}
            </p>
          </dis>
        </div>
      </div>
    </div>
  );
};

export default Test;
