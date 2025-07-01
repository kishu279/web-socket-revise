import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import type { serverMessageType } from "./types";

const server = createServer(); // http
const wss = new WebSocketServer({ server });

let subscribers: WebSocket[] = [];

main();

// const userConnectedToServer = new Map<WebSocket, Set<WebSocket>>();
// const userConnectedToServerId = new Map<string, Set<string>>();

wss.on("connection", (ws) => {
  // on message event
  ws.on("message", async (message: serverMessageType) => {
    try {
      const data: serverMessageType = JSON.parse(message.toString());

      // switch case for the proper data handling
      switch (data.type) {
        case "join":
          console.log("joined");
          subscribers.push(ws); // pushing the client websocket object to the array
          break;

        case "message":
          console.log("meesage reciecved ", data.data);
          subscribers.forEach((client) => {
            if (ws !== client && client.readyState === WebSocket.OPEN) {
              const dataToSend = JSON.stringify({
                data: data.data,
              });
              client.send(dataToSend);
            }
          });
          break;

        default:
          console.log("Unknown message type : ", data.type);
      }
    } catch (err) {
      console.error("Error processing message ", err);
    }
  });

  // on close event
  ws.on("close", () => {
    console.log("closed");
  });

  ws.send("hii from server");
});

function main() {
  server.listen("8080", () => {
    console.log("server is listening");
  });
}
