class GetUserChats {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error("User id is required");
    }

    const chats = await this.chatRepository.findChatsByUser(userId);

    return chats;
  }
}

module.exports = GetUserChats;