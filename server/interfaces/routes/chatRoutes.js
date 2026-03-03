const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, (req, res) => {
  ChatController.getChats(req, res);
});
router.post("/", protect, (req, res) => {
  ChatController.createChat(req, res);
});

module.exports = router;