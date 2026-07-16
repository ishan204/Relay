import express from "express";
import JobRouter from "./routes/jobs.ts";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import subscriber from "./redis/subscriber.ts";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
subscriber.on("message", (channel, message) => {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
});
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ message: "Successfully connected to server" }));
  ws.on("close", () => {
    console.log("client disconnected");
  });
});
async function main() {
  console.log("Mounting JobRouter");
  app.use("/job", JobRouter);

  server.listen(8080, () => {
    console.log("HTTP + Websocket server listening on port 8080");
  });
}

main();
