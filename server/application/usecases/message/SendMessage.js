class SendMessage {
  constructor(messageRepository, chatRepository) {
    this.messageRepository = messageRepository;
    this.chatRepository = chatRepository;
  }

  async execute({ senderId, chatId, content }) {
    if (!chatId || !content) {
      throw new Error("Chat id and content are required");
    }

    // 1️⃣ Create message
    const message = await this.messageRepository.create({
      sender: senderId,
      content,
      chat: chatId,
    });

    // 2️⃣ Update latestMessage in Chat
    await this.chatRepository.updateLatestMessage(chatId, message._id);

    return message;
  }
}

module.exports = SendMessage;