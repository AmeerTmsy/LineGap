const IChatRepository = require("../../../../domain/repositories/IChatRepository");
const ChatModel = require("../models/ChatModel");

class ChatRepository extends IChatRepository {
    async findOneToOneChat(userId1, userId2) {
        return await ChatModel.findOne({
            isGroupChat: false,
            users: { $all: [userId1, userId2] },
        }).populate("users", "-password");

        // $all: Find chat where both users exist in the users array.
    }
    async findChatsByUser(userId) {
        return await ChatModel.find({
            users: { $in: [userId] },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 });

        // $in: finds chats where user exists in users array 
    }
    async create(chatData) {
        const chat = await ChatModel.create(chatData);
        return await chat.populate("users", "-password");
    }
    async updateLatestMessage(chatId, messageId) {
        return await ChatModel.findByIdAndUpdate(
            chatId,
            { latestMessage: messageId },
            { new: true }
        );
    }
}

module.exports = ChatRepository;