class GetMessages {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(chatId) {
    if (!chatId) {
      throw new Error("Chat id is required");
    }

    const messages = await this.messageRepository.findByChat(chatId);

    return messages;
  }
}

module.exports = GetMessages;