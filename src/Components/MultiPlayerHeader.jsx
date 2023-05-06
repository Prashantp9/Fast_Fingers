import "../StyleSheets/MultiPlayerHeader.css";

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSocketHook, { socket } from "../customHooks/useSetupHook.js";

import useSocketroom from "../customHooks/useSocketroom.js";

const CreateRoomContainer = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setRoomParams = () => {
    useSocketroom.createRoom(socket.id + "room");
    navigate(`fast_fingers/${socket.id + "room"}`);
  };
  return (
    <>
      <div className="create-rooom-component">
        <div className="link-container">{socket.id + "room"}</div>
        <button onClick={() => setRoomParams()}>Create Room</button>
        <button>Copy Link</button>
      </div>
    </>
  );
};

const JoinRoomContainer = () => {
  const navigate = useNavigate();
  const [joiningLink, setJoiningLink] = useState("");
  return (
    <>
      <div className="create-rooom-component">
        <input
          placeholder="enter joining link here"
          onChange={(e) => {
            setJoiningLink(e.target.value);
          }}
          value={joiningLink}
        />
        <button
          onClick={() => {
            useSocketroom.createRoom(joiningLink);
            navigate(`/fast_fingers/${joiningLink}`);
          }}
        >
          Join Room
        </button>
      </div>
    </>
  );
};
const MultiPlayerHeader = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [socketId] = useSocketHook();
  console.log("Accessing state socket", socketId);

  return (
    <>
      <div className="create-room-main-container">
        <div className="room-optin-container">
          <div
            className="create-room-container"
            onClick={() => setCreateRoom(!createRoom)}
          >
            Create
            {createRoom && <CreateRoomContainer socketId={socketId} />}
          </div>
          <div
            className="join-room-container"
            onClick={() => setJoinRoom(true)}
          >
            Join
            {joinRoom && <JoinRoomContainer />}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiPlayerHeader;
