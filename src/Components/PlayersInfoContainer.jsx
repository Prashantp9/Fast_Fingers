import "../StyleSheets/PlayersInfoContainer.css";

import React, { useState } from "react";

import Performance from "../Assets/performance.svg";
import Profile from "../Assets/Profile.jpg";
import { socket } from "../customHooks/useSetupHook";
import { useParams } from "react-router-dom";
import useSocketroom from "../customHooks/useSocketroom";

// import Profile from "../Assets/images/Vector (1).svg";

const PlayersInfoContainer = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [start, setStart] = useState(false);
  let count = 0;
  socket.on("room_members", (data) => {
    setPlayers(data.members);
  });

  function convertToSocketId(str) {
    const result = str.replace(new RegExp("room", "g"), ""); // remove all occurrences of the target string
    return result;
  }
  const startGame = (roomId) => {
    useSocketroom.startGame(roomId);
  };
  socket.on("start", (status) => {
    switch (status.start) {
      case true:
        setStart(true);
        setTimeout(() => {
          setStart(false);
        }, 3000);
        break;
    }
  });

  return (
    <>
      {start && (
        <div className="start-countdown">
          <p className="count">starting...</p>
        </div>
      )}
      <div className="players-stat-container">
        {players.map(() => (
          <div className="player-stat-card">
            <div className="player-profile-conatainer">
              <img src={Profile} alt="" />
            </div>
            <div className="player-stat-wpm-conatainer">
              <img src={Performance} alt="" />
              <p>
                85 <span>wpm</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* 
      <div className="players-profile-base-container">
        {convertToSocketId(id) == socket.id && (
          <button onClick={() => startGame(id)} id="start-button">
            Start
          </button>
        )}
        {players.map(() => (
          <div className="players-profile-card">
            <p className="inner-profile-container"></p>
          </div>
        ))}
      </div> */}
    </>
  );
};

export default PlayersInfoContainer;