const cors = require("cors");
require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const connectDB = require("./infrastructure/config/database");
const app = express();
app.use(
  cors({
    origin: "*", // Allows every origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Keep this if you're using cookies/sessions
  })
);
app.use(express.json());
const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows every origin for web sockets
    methods: ["GET", "POST"],
  },
});
module.exports.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.userId = userData.id; // store for later use
    console.log("User joined personal room:", userData.id);
  });

  // join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat room:", chatId);
  });

  // typing event
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing", {
      userId: socket.userId,
    });
  });

  socket.on("stop typing", (chatId) => {
    socket.to(chatId).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const protect = require("./interfaces/middleware/authMiddleware");
const authRoutes = require('./interfaces/routes/authRoutes');
const chatRoutes = require('./interfaces/routes/chatRoutes')
const messageRoutes = require('./interfaces/routes/messageRoutes')


app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

app.get('/api/data', (req, res) => res.json({ message: 'Here is some data' }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes)


app.get('/', (req, res) => {
  res.send('Hello from Node backend!');
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();