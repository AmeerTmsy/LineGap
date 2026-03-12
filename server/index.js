require("dotenv").config();
const express = require('express');
const cors = require("cors");
const http = require("http");

const connectDB = require("./infrastructure/config/database");
const { initSocket } = require("./infrastructure/socket/socketHandler")

const authRoutes = require('./interfaces/routes/authRoutes');
const chatRoutes = require('./interfaces/routes/chatRoutes')
const messageRoutes = require('./interfaces/routes/messageRoutes');

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors({
  origin: process.env.ENVIRONMENT == 'development' ? 'http://localhost:4000' : 'https://line-gap.vercel.app', credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes)

app.get('/', (req, res) => res.send('Hello from Node backend!'));

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();


// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allows every origin for web sockets
//     methods: ["GET", "POST"],
//   },
// });
// module.exports.io = io;

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("setup", (userData) => {
//     socket.join(userData.id);
//     socket.userId = userData.id; // store for later use
//     console.log("User joined personal room:", userData.id);
//   });

//   // join chat room
//   socket.on("join chat", (chatId) => {
//     socket.join(chatId);
//     console.log("User joined chat room:", chatId);
//   });

//   // typing event
//   socket.on("typing", (chatId) => {
//     socket.to(chatId).emit("typing", {
//       userId: socket.userId,
//     });
//   });

//   socket.on("stop typing", (chatId) => {
//     socket.to(chatId).emit("stop typing");
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });