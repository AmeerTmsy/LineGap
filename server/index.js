require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const connectDB = require("./infrastructure/config/database");
const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./interfaces/routes/authRoutes');
const protect = require("./interfaces/middleware/authMiddleware");

app.use(express.json());

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

app.get('/api/data', (req, res) => res.json({ message: 'Here is some data' }));

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Hello from Node backend!');
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();