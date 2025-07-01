# web-chat

A real-time WebSocket-based chat server built with Bun and TypeScript.

## Installation

To install dependencies:

```bash
bun install
```

## Running the Server

To run:

```bash
bun run index.ts
```

The server will start listening on port `8080`.

## Server Architecture

This is a WebSocket-based chat server that handles real-time messaging between connected clients. The server uses the `ws` library for WebSocket connections and maintains a list of active subscribers.

### Supported Message Types

The server accepts JSON messages with the following structure:

```typescript
interface serverMessageType {
  type: "join" | "message";
  data: string;
  roomId: string;
  userId: string;
}
```

### Message Types

#### 1. Join Message
When a client wants to join the chat:

```json
{
  "type": "join",
  "data": "",
  "roomId": "room123",
  "userId": "user456"
}
```

- **Purpose**: Registers the client as a subscriber to receive messages
- **Behavior**: Adds the WebSocket connection to the subscribers array
- **Response**: Server logs "joined" and the client starts receiving broadcast messages

#### 2. Chat Message
When a client sends a chat message:

```json
{
  "type": "message",
  "data": "Hello everyone!",
  "roomId": "room123",
  "userId": "user456"
}
```

- **Purpose**: Broadcasts a message to all connected clients
- **Behavior**: Server forwards the message to all subscribers except the sender
- **Response**: All other connected clients receive the message data

### Server Behavior

1. **Connection**: When a client connects, the server sends a welcome message: "hii from server"
2. **Message Broadcasting**: Messages are broadcast to all connected clients except the sender
3. **Error Handling**: Invalid JSON messages are caught and logged
4. **Connection Management**: Clients are automatically removed from subscribers when they disconnect

### WebSocket Endpoint

Connect to the WebSocket server at:
```
ws://localhost:8080
```

### Example Client Usage

```javascript
const ws = new WebSocket('ws://localhost:8080');

// Join the chat
ws.send(JSON.stringify({
  type: "join",
  data: "",
  roomId: "general",
  userId: "user123"
}));

// Send a message
ws.send(JSON.stringify({
  type: "message",
  data: "Hello world!",
  roomId: "general",
  userId: "user123"
}));

// Listen for messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

---

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
