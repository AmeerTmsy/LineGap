const RegisterUser = require("../../application/usecases/auth/RegisterUser");
const LoginUser = require("../../application/usecases/auth/LoginUser");
const { userRepository } = require("../../infrastructure/container");
const FindUser = require("../../application/usecases/auth/findUser");
const FindAllUsers = require("../../application/usecases/auth/FindAllUsers");

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

  async findOne(req, res) {
    try {
      console.log('reached')
      const findUser = new FindUser(userRepository);
      const result = await findUser.execute(req.params)
      res.status(200).json(result)
    } catch (error) {
      res.status(401).json({ message: error.message })
    }
  }

  async findAll(req, res) {
    try {
      const findUsers = new FindAllUsers(userRepository);
      const conditions = { _id: { $ne: req.user.id } }
      const result = await findUsers.execute(conditions);
      res.status(200).json(result)
    } catch (error) {
      res.status(401).json({ message: error.error.message})
    }
  }
}

module.exports = new AuthController();