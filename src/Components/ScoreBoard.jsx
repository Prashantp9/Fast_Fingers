import "../StyleSheets/scoreboard.css";

import { useDispatch, useSelector } from "react-redux";

import { addPlayers } from "../redux/app/fetures/playersSlice";
import { socket } from "../customHooks/useSetupHook";
import { useState } from "react";

export default function ScoreBoard() {
  const [players, setPlayers] = useState([]);
  const [assignProfile, setAssignedProfile] = useState({});
  const dispatch = useDispatch();
  const playerResult = useSelector(
    (state) => state.rootReducer.playersInfo.scoreRecord
  );

  socket.on("room_members", (data) => {
    setPlayers(data.members);
    dispatch(addPlayers({ players: data?.members }));
    setAssignedProfile(data.assignedProfiles);
  });
  return (
    <div className="scoreboard-backgroud-div">
      <div className="scoreboard-container">
        {players.map(() => {
          <div className="runners-div">
            <div className="runner-info-div">
              <span id="winner-green">1</span>
              <span id="winner">Prashant</span>
            </div>
            <div className="runner-result-div" id="winner-green">
              45 wpm
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
