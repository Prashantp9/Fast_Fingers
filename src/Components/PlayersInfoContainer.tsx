import "../stylesheets/PlayersInfoContainer.scss";

import React, { useState } from "react";

import { socket } from "../customHooks/useSetupHook";
import { useParams } from "react-router-dom";
import useSocketroom from "../customHooks/useSocketroom";

// import Profile from "../Assets/images/Vector (1).svg";

const PlayersInfoContainer = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [start, setStart] = useState(false);
  // const [count, setCount] = useState(0);
  let count = 0;
  socket.on("room_members", (data: any) => {
    setPlayers(data.members);
  });

  function convertToSocketId(str: any) {
    const result = str.replace(new RegExp("room", "g"), ""); // remove all occurrences of the target string
    return result;
  }
  const startGame = (roomId: any) => {
    useSocketroom.startGame(roomId);
  };
  socket.on("start", (status: any) => {
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
      </div>
    </>
  );
};

export default PlayersInfoContainer;
