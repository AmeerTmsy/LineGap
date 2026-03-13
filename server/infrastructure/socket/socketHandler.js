// infrastructure/socket/socketHandler.js
const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ENVIRONMENT == 'development' ? 'http://localhost:4000' : 'https://line-gap.vercel.app',
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData.id);
      socket.userId = userData.id;
      console.log("User joined personal room:", userData.id);
    });

    socket.on("join chat", (chatId) => {
      socket.join(chatId);
      console.log("User joined chat room:", chatId);
    });

    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing", { userId: socket.userId });
    });

    socket.on("stop typing", (chatId) => {
      socket.to(chatId).emit("stop typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

// Function to get the io instance from other files (like controllers)
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };