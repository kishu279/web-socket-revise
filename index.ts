// RAW WEB SOCKETS

// import WebSocket, { WebSocketServer } from "ws";
// import { createServer } from "http";
// import type { serverMessageType } from "./types";

// const server = createServer(); // http
// const wss = new WebSocketServer({ server });

// let subscribers: WebSocket[] = [];

// main();

// // const userConnectedToServer = new Map<WebSocket, Set<WebSocket>>();
// // const userConnectedToServerId = new Map<string, Set<string>>();

// wss.on("connection", (ws) => {
//   // on message event
//   ws.on("message", async (message: serverMessageType) => {
//     try {
//       const data: serverMessageType = JSON.parse(message.toString());

//       // switch case for the proper data handling
//       switch (data.type) {
//         case "join":
//           console.log("joined");
//           subscribers.push(ws); // pushing the client websocket object to the array
//           break;

//         case "message":
//           console.log("meesage reciecved ", data.data);
//           subscribers.forEach((client) => {
//             if (ws !== client && client.readyState === WebSocket.OPEN) {
//               const dataToSend = JSON.stringify({
//                 data: data.data,
//               });
//               client.send(dataToSend);
//             }
//           });
//           break;

//         default:
//           console.log("Unknown message type : ", data.type);
//       }
//     } catch (err) {
//       console.error("Error processing message ", err);
//     }
//   });

//   // on close event
//   ws.on("close", () => {
//     console.log("closed");
//   });

//   ws.send("hii from server");
// });

// function main() {
//   server.listen("8080", () => {
//     console.log("server is listening");
//   });
// }

// SOCKET.IO with EXPRESS
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
  },
});

// server is initiating
httpServer.listen(3001, () => {
  console.log("Socket.IO server listening on http://localhost:3001");
});

// sending the frontend
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("subscribe", (channel) => {
    console.log(`User ${socket.id} subscribing to channel: ${channel}`);
    socket.join(channel);
    socket.emit("subscribed", {
      channel,
      message: `Successfully joined channel: ${channel}`,
    });
  });

  socket.on("unsubscribe", (channel) => {
    console.log(`User ${socket.id} unsubscribing from channel: ${channel}`);
    socket.leave(channel);
    socket.emit("unsubscribed", {
      channel,
      message: `Left channel: ${channel}`,
    });
  });

  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}:`, data);
    if (data.channel) {
      socket.to(data.channel).emit("message", {
        user: socket.id,
        message: data.message,
        channel: data.channel,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});
