import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5000 });
console.log("WebSocket server running on ws://localhost:5000");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    // Broadcast to others
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
