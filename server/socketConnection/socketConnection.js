import { Server } from "socket.io";

// import cors from "cors";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "192.168.2.104:3000",
    },
  });

  //   const io = new Server(httpServer);
  return io;
};
