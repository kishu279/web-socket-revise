export interface serverMessageType {
  // which server will recieve from the client
  type: "join" | "message";
  data: string;
  roomId: string;
  userId: string;
}
