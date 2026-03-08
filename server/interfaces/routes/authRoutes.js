const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const protect = require("../middleware/authMiddleware");

router.post("/register", (req, res) => {
  AuthController.register(req, res);
});

router.post("/login", (req, res) => {
  AuthController.login(req, res);
});

router.get("/user", protect,  (req, res) => {
  AuthController.findAll(req, res);
});
router.get("/user/:id", protect,  (req, res) => {
  AuthController.findOne(req, res);
});

module.exports = router;