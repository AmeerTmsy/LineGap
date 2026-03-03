class IMessageRepository {
  async create(messageData) {
    throw new Error("Not implemented");
  }

  async findByChat(chatId) {
    throw new Error("Not implemented");
  }
}

module.exports = IMessageRepository;