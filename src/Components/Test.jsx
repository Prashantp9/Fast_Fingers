import react, { useEffect, useState, useRef } from "react";
import { planeWordList } from "../WordList/planewordlist";
import "../StyleSheets/Test.css";

const Test = () => {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currWordStatus, setCurrWordStatus] = useState(false);
  const [wordListArray, setWordListArray] = useState(planeWordList.split(" "));

  const [wordListStat, setWordListStat] = useState(() => {
    const initialWordListStat = {};
    wordListArray.forEach((value) => {
      initialWordListStat[value] = { test: false, color: "black" };
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

  const inputRef = useRef(null);

  // console.log(WordListStat);

  const handlekeyUp = (event) => {
    if (event.key == " ") {
      if (event.target.value !== wordListArray[currWordIndex]) {
        handleUpdate(wordListArray[currWordIndex]);
      }
      event.target.value = "";
      setCurrWordIndex(currWordIndex + 1);
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
                    : wordListStat[elm].color,
              }}
            >
              {elm}
            </p>
          ))}
        </div>
      </div>
      <div className="test-input-container">
        <input
          ref={inputRef}
          type="text"
          defaultValue=""
          onChange={handleConrrection}
          onKeyDown={handlekeyUp}
        />
      </div>
    </>
  );
};

export default Test;
