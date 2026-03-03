const IMessageRepository = require("../../../../domain/repositories/IMessageRepository");
const MessageModel = require("../models/MessageModel");

class MessageRepository extends IMessageRepository {
    async create(messageData) {
        const message = await MessageModel.create(messageData);

        const populatedMessage = await MessageModel.findById(message._id)
            .populate("sender", "-password")
            .populate("chat");

        return populatedMessage;
    }

    async findByChat(chatId) {
        return await MessageModel.find({ chat: chatId })
            .populate("sender", "-password")
            .populate("chat")
            .sort({ createdAt: 1 });
    }
}

module.exports = MessageRepository;