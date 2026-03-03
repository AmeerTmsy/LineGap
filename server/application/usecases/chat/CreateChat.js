class CreateChat {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async execute({ currentUserId, targetUserId }) {
    if (!targetUserId) {
      throw new Error("Target user id is required");
    }

    if (String(currentUserId) === String(targetUserId)) {
      throw new Error("Cannot create chat with yourself");
    }

    // 1️⃣ Check if chat already exists
    const existingChat = await this.chatRepository.findOneToOneChat(
      currentUserId,
      targetUserId
    );

    if (existingChat) {
      return existingChat;
    }

    // 2️⃣ Create new chat
    const newChat = await this.chatRepository.create({
      chatName: "private",
      isGroupChat: false,
      users: [currentUserId, targetUserId],
    });

    return newChat;
  }
}

module.exports = CreateChat;