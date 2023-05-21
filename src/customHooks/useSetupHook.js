import { useEffect, useState } from "react";

import { io } from "socket.io-client";

const socket = new io("http://172.23.192.1:5000");

const useSocketHook = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connected", (data) => {
      console.log(data);
    });

    socket.on("room_members", (data) => {
      console.log(data);
    });

    socket.on("room_update", (data) => {
      console.log(data);
    });
  }, [socket]);

  return [socket.id];
};

export default useSocketHook;
export { socket };
