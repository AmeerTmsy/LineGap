const RegisterUser = require("../../application/usecases/auth/RegisterUser");
const LoginUser = require("../../application/usecases/auth/LoginUser");
const { userRepository } = require("../../infrastructure/container")

class AuthController {
  async register(req, res) {
    try {
      const registerUser = new RegisterUser(userRepository);
      const user = await registerUser.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const loginUser = new LoginUser(userRepository);
      const result = await loginUser.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();