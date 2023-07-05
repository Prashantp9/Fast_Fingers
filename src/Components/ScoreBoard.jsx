import "../StyleSheets/scoreboard.css";

import { addPlayers, setShowBoard } from "../redux/app/fetures/playersSlice";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "../customHooks/useSetupHook";

export default function ScoreBoard() {
  const dispatch = useDispatch();
  const rankResult = useSelector(
    (state) => state.rootReducer.playersInfo.scoreRank
  );

  return (
    <div
      className="scoreboard-backgroud-div"
      onClick={(e) => {
        if ((e.currentTarget = e.target)) {
          dispatch(setShowBoard());
        }
      }}
    >
      <div className="scoreboard-container">
        {rankResult.map((elm, idx) => (
          <div className="runners-div">
            <div className="runner-info-div">
              <span
                // className={`${socket.id == elm.id && idx !== 0 ? "user" : ""}`}
                id={`${idx + 1 == 1 && "winner-green"}}`}
              >
                {idx + 1}
              </span>
              <span
                className={`${socket.id == elm.id && "user"}`}
                id={`${idx + 1 == 1 && "winner"}`}
              >
                {elm?.id}
              </span>
              <span
                className={`${socket.id == elm.id && "user"}`}
                id={`${idx + 1 == 1 && "winner"}`}
              >
                Accuracy {elm?.accuracy}
              </span>
            </div>
            <div
              className="runner-result-div"
              id={`${idx + 1 == 1 && "winner-green"}`}
            >
              {elm.wpm}wpm
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
