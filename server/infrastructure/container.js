const ChatRepository = require("./database/mongoose/repositories/ChatRepository");
const MessageRepository = require("./database/mongoose/repositories/MessageRepository");
const UserRepository = require("./database/mongoose/repositories/UserRepository");

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();

module.exports = {
  userRepository,
  chatRepository,
  messageRepository
};