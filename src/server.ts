import dotenv from "dotenv";
import app from "./app";
import { Server } from "socket.io";
import http from "http";
import { connectToDB } from "./utils/database";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to the database
connectToDB();

const io = new Server(server);

// Listen for client connections
// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);
// });

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default server;
