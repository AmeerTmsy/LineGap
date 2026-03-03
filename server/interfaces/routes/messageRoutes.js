const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, (req, res) => {
  MessageController.sendMessage(req, res);
});
router.get("/:chatId", protect, (req, res) => {
  MessageController.getMessages(req, res);
});

module.exports = router;