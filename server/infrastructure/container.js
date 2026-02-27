const UserRepository = require("./database/mongoose/repositories/UserRepository");

const userRepository = new UserRepository();

module.exports = {
  userRepository,
};