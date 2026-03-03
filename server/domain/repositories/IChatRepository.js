class IChatRepository {
    async findOneToOneChat(userId1, userId2) {
        throw new Error("Not implemented");
    }
    async findChatsByUser(userId) {
        throw new Error("Not implemented");
    }
    async create(chatData) {
        throw new Error("Not implemented");
    }
    async updateLatestMessage(chatId, messageId) {
        throw new Error("Not implemented");
    }
}

module.exports = IChatRepository;